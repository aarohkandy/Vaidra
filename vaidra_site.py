"""Local mirror of www.vaidra.org with a premium design layer.

  python3 vaidra_site.py mirror   # fetch every sitemap page + assets into site/
  python3 vaidra_site.py serve    # http://localhost:8080, fills any missing file from upstream
"""
import hashlib, os, re, sys, urllib.error, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

UPSTREAM = "https://www.vaidra.org"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site")
INJECT = '<link rel="stylesheet" href="/premium/premium.css"/><script src="/premium/premium.js" defer></script>'
IMG_RE = re.compile(rb"/_next/image\?url=([^&\"\s]+)(?:&amp;|&)w=\d+(?:&amp;|&)q=\d+")
# Same as robots.txt Disallow: signed-in areas we don't crawl.
PRIVATE = ("/admin", "/api", "/user", "/profile", "/speaker/", "/teacher/", "/auth/login")
UA = {"User-Agent": "Mozilla/5.0 (Macintosh) vaidra-mirror"}


def local_path(path, query=""):
    """Map a URL path(+query) to a file under site/."""
    path = urllib.parse.unquote(path)
    if path.startswith("/_next/image"):
        return os.path.join(ROOT, "_next/image", hashlib.sha1(query.encode()).hexdigest()[:16])
    if path.endswith("/") or "." not in os.path.basename(path):
        return os.path.join(ROOT, path.strip("/"), "index.html")
    return os.path.join(ROOT, path.lstrip("/"))


def fetch(path, query=""):
    """Download path from upstream into site/, injecting the design layer into HTML."""
    dest = local_path(path, query)
    if os.path.exists(dest):
        return dest
    url = UPSTREAM + path + ("?" + query if query else "")
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
            body, ctype = r.read(), r.headers.get("Content-Type", "")
    except Exception as e:
        print("miss", url, e)
        return None
    if "text/html" in ctype:
        body = body.replace(b"</head>", INJECT.encode() + b"</head>", 1)
        # /_next/image needs Next's image server; point at the original file so static hosting works.
        body = IMG_RE.sub(lambda m: urllib.parse.unquote(m.group(1).decode()).encode(), body)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as f:
        f.write(body)
    return dest


# Read-only JSON the site's JS fetches; mirrored so pages work offline and on static hosting.
# (vercel.json rewrites these URLs to the .json files.)
LANGS = ["en", "hi", "te", "ta", "mr", "kn", "bn", "pa"]
API_GETS = [f"/api/translations/{l}" for l in LANGS] + ["/api/volunteers", "/api/auth/session"] + [
    f"/api/catalog/{t}?limit={n}" for t, n in
    [("audiobooks", 40), ("audiobooks", 48), ("courses", 12), ("courses", 48), ("courses", 200),
     ("research-papers", 6), ("research-papers", 48), ("research-papers", 200)]]


def api_file(path, query=""):
    """/api/catalog/courses?limit=12 -> site/api/catalog/courses/limit-12.json"""
    limit = urllib.parse.parse_qs(query).get("limit")
    return os.path.join(ROOT, path.strip("/") + (f"/limit-{limit[0]}" if limit else "") + ".json")


def fetch_api(url):
    path, _, query = url.partition("?")
    try:
        req = urllib.request.Request(UPSTREAM + url, headers={**UA, "Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read()
    except Exception as e:
        return print("miss", url, e)
    dest = api_file(path, query)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "wb") as f:
        f.write(body)


ASSET_RE = re.compile(rb'(?:href|src)="(/[^"#]+)"|url\((/[^)"\']+)\)|"(/_next/static/[^"\\]+)"|(/_next/image\?[^ "&]+(?:&amp;[^ "&]+)*)')


def assets_in(file):
    data = open(file, "rb").read()
    if "/webpack-" in file:  # runtime holds the names of lazily loaded chunks
        yield from (("/_next/" + n.decode(), "") for n in re.findall(rb'"(static/chunks/[^"]+\.js)"', data))
        yield from ((f"/_next/static/chunks/{k.decode()}.{h.decode()}.js", "") for k, h in re.findall(rb'(\d+):"([0-9a-f]{16})"', data))
        return
    for m in ASSET_RE.finditer(data):
        ref = next(g for g in m.groups() if g).decode().replace("&amp;", "&")
        p, _, q = ref.partition("?")
        if p.startswith(("/premium/", "//")):
            continue
        if p.startswith("/_next/") or "." in os.path.basename(p):
            yield p, q if p.startswith("/_next/image") else ""
        elif m.group(1) and not p.startswith(PRIVATE):  # internal page link
            yield p.rstrip("/") or "/", ""


def mirror():
    sitemap = urllib.request.urlopen(urllib.request.Request(UPSTREAM + "/sitemap.xml", headers=UA)).read().decode()
    pages = ["/sitemap.xml", "/robots.txt", "/manifest.json", "/favicon.ico", "/favicon.png"]
    pages += [urllib.parse.urlparse(u).path or "/" for u in re.findall(r"<loc>([^<]+)</loc>", sitemap)]
    pages += ["/sign-in", "/auth/register", "/apply", "/volunteer", "/press", "/faq", "/contact"]
    seen, queue = set(), [(p, "") for p in dict.fromkeys(pages)]
    with ThreadPoolExecutor(12) as pool:
        while queue:
            batch = [x for x in dict.fromkeys(queue) if x not in seen]
            seen.update(batch)
            queue = []
            for dest in pool.map(lambda x: fetch(*x), batch):
                if dest and (dest.endswith((".html", ".css")) or "/webpack-" in dest):
                    queue += [a for a in assets_in(dest) if a not in seen]
        list(pool.map(fetch_api, API_GETS))
    print(f"mirrored {len(seen)} files into {ROOT}")


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def proxy(self):
        """Pass /api calls through to the live backend (same as the Vercel rewrite)."""
        n = int(self.headers.get("Content-Length") or 0)
        req = urllib.request.Request(UPSTREAM + self.path, data=self.rfile.read(n) if n else None, method=self.command,
                                     headers={**UA, "Content-Type": self.headers.get("Content-Type", "application/json")})
        try:
            r = urllib.request.urlopen(req, timeout=30)
            status, ctype, body = r.status, r.headers.get("Content-Type", "application/json"), r.read()
        except urllib.error.HTTPError as e:
            status, ctype, body = e.code, e.headers.get("Content-Type", "application/json"), e.read()
        except Exception as e:  # offline / upstream down: answer instead of dropping the connection
            status, ctype, body = 502, "application/json", ('{"error": "upstream unavailable: %s"}' % e).encode()
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    do_POST = proxy

    def end_headers(self):
        # Design files change constantly while iterating; never let the browser serve a stale copy.
        if self.path.startswith("/premium/"):
            self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_GET(self):
        u = urllib.parse.urlsplit(self.path)
        if u.path.startswith("/api/"):
            f = api_file(u.path, u.query)
            if not os.path.exists(f):
                return self.proxy()
            body = open(f, "rb").read()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        if u.path.startswith("/premium/"):
            return super().do_GET()
        # RSC payload requests: answer 404 so Next.js falls back to a full page load.
        if "_rsc=" in u.query or self.headers.get("RSC"):
            return self.send_error(404)
        query = u.query if u.path.startswith("/_next/image") else ""
        dest = local_path(u.path, query)
        if not os.path.exists(dest) and not fetch(u.path, query):
            return self.send_error(404)
        if u.path.startswith("/_next/image"):
            body = open(dest, "rb").read()
            self.send_response(200)
            self.send_header("Content-Type", "image/webp" if body[8:12] == b"WEBP" else "image/png")
            self.end_headers()
            self.wfile.write(body)
            return
        self.path = "/" + os.path.relpath(dest, ROOT).replace(os.sep, "/")
        if self.path.endswith("/index.html"):
            self.path = self.path[: -len("index.html")]
        super().do_GET()


if __name__ == "__main__":
    if sys.argv[1:] == ["mirror"]:
        mirror()
    else:
        port = int(os.environ.get("PORT", 8080))
        print(f"http://localhost:{port}")
        ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()

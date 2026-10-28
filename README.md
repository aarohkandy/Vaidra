# Vaidra

Static mirror of [vaidra.org](https://www.vaidra.org) with a premium design layer on top.

- `site/` – every page from the sitemap plus all `_next` assets, fonts and images.
- `site/premium/premium.css` + `premium.js` – the redesign. Injected into every page's `<head>`; edit these to change the look.
- `vaidra_site.py` – mirror + local server (stdlib only).

## Local

```bash
python3 vaidra_site.py serve      # http://localhost:8080
```

The server proxies `/api/*` to the live site and fetches any file missing from `site/` on demand.

## Refresh content from the live site

```bash
find site -mindepth 1 -maxdepth 1 ! -name premium -exec rm -rf {} + && python3 vaidra_site.py mirror
```

## Deploy

Vercel serves `site/` as static files (`vercel.json`); `/api/*` is rewritten to www.vaidra.org.
Pushing to `main` redeploys.

## Known gaps

- `/research-papers/<id>` detail pages return HTTP 500 on the live site, so they aren't mirrored.
- Signed-in areas (`/admin`, `/user`, `/profile`, `/speaker`, `/teacher`) aren't mirrored; sign-in itself talks to Firebase directly.
- Content images and audio stream from Firebase Storage, as on the live site.

// Vaidra premium layer: tags a few sections for premium.css, adds scroll reveal + bio toggles.
// Runs after hydration and only adds classes/elements, so React's DOM stays intact.
(function () {
  var root = document.documentElement;
  var page = location.pathname.replace(/\/$/, "").split("/")[1] || "home";

  function tag() {
    // Hydration rewrites <html> attributes, so (re)apply our markers on every pass.
    root.classList.add("vp-js");
    root.dataset.vpPage = page;
    var main = document.querySelector("main");
    if (!main) return;

    // Section headings get the hand-drawn underline; skip ones already tagged.
    main.querySelectorAll("h2.font-display.text-center:not(.vp-h)").forEach(function (h) {
      h.classList.add("vp-h");
    });

    if (page === "about") about(main);

    main.querySelectorAll(".rounded-full > img").forEach(function (img) {
      function fallback() {
        var box = img.parentElement;
        var name = (img.alt || "").trim();
        if (!box || !name || box.classList.contains("vp-noimg")) return;
        box.dataset.initial = name.charAt(0).toUpperCase();
        box.classList.add("vp-noimg");
      }
      if (img.complete && img.naturalWidth === 0 && img.src) fallback();
      else img.addEventListener("error", fallback, { once: true });
    });

    // Reveal cards as they scroll in (CSS hides them only while .vp-js is set).
    // About page only: on catalogue pages a fade just delays content people came for.
    if (page !== "about") return;
    var cards = main.querySelectorAll("article, .card-frame, .rounded-xl.shadow-soft, section > .container > h2");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("vp-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px 15% 0px" });
    cards.forEach(function (el, i) {
      if (el.classList.contains("vp-reveal")) return;
      el.classList.add("vp-reveal");
      el.style.setProperty("--vp-delay", (i % 4) * 50 + "ms");
      io.observe(el);
    });
  }

  function about(main) {
    if (main.querySelector(".vp-stats")) return;
    var sections = main.querySelectorAll("section");
    var hero = sections[0];
    if (hero) {
      hero.classList.add("vp-about-hero");
      var mission = hero.querySelector("h2");
      var col = mission && mission.parentElement;
      if (col) {
        col.classList.add("vp-mission");
        // Facts already stated on this page and in the site footer.
        var stats = document.createElement("dl");
        stats.className = "vp-stats";
        [["60,000+", "students reached"], ["450+", "partner schools"], ["8", "languages"], ["2024", "founded"]].forEach(function (s) {
          var d = document.createElement("div");
          d.innerHTML = "<dt>" + s[0] + "</dt><dd>" + s[1] + "</dd>";
          stats.appendChild(d);
        });
        col.appendChild(stats);
      }
    }

    sections.forEach(function (s) {
      var h = s.querySelector("h2");
      var t = h ? h.textContent : "";
      if (/Our Team/.test(t)) s.classList.add("vp-team");
      else if (/Lead Teachers/.test(t)) s.classList.add("vp-leads");
      else if (/volunteers/i.test(t)) s.classList.add("vp-volunteers");
      else if (/School Partners/.test(t)) s.classList.add("vp-partners");
      else if (/How Vaidra Works/.test(t)) s.classList.add("vp-how");
      else if (/Join Our Mission/.test(t)) s.classList.add("vp-join");
    });

    var team = main.querySelector(".vp-team");
    if (team) {
      var founder = team.querySelector("article");
      if (founder) founder.classList.add("vp-founder");
      // Long bios collapse behind a toggle so the grid stays even.
      team.querySelectorAll("article > p:nth-of-type(2)").forEach(function (p) {
        if (p.classList.contains("vp-bio")) return;
        p.classList.add("vp-bio");
        if (p.scrollHeight <= p.clientHeight + 2) return; // fits, no toggle needed
        var b = document.createElement("button");
        b.type = "button";
        b.className = "vp-more";
        b.textContent = "Read more";
        b.setAttribute("aria-expanded", "false");
        b.onclick = function () {
          var open = p.classList.toggle("vp-bio-open");
          b.textContent = open ? "Show less" : "Read more";
          b.setAttribute("aria-expanded", String(open));
        };
        p.after(b);
      });
    }
  }

  // ---- One card per title ------------------------------------------------
  // Each audiobook/course is published once per language ("…-startup-india-mr",
  // "…-startup-india-ta") with the same cover, so lists fill up with lookalikes.
  // Keep the first card of each title, hide the rest, and list their languages
  // as chips on the kept card.
  var LANGS = { en: "English", hi: "Hindi", te: "Telugu", ta: "Tamil", mr: "Marathi", kn: "Kannada", bn: "Bengali", pa: "Punjabi" };
  var SLUG = /^\/(audiobooks|courses)\/(.+)-(en|hi|te|ta|mr|kn|bn|pa)$/;

  function titleKey(card) {
    var href = card.getAttribute("href") || "";
    var m = SLUG.exec(href);
    if (m) return { base: m[1] + "/" + m[2], lang: LANGS[m[3]], href: m[0] };
    // Research papers use opaque ids; the language only appears in the card text.
    var h = card.querySelector("h3");
    var names = Object.keys(LANGS).map(function (k) { return LANGS[k]; }).join("|");
    var l = new RegExp("research paper in (" + names + ")", "i").exec(card.textContent);
    if (href.indexOf("/research-papers/") === 0 && h && l) return { base: "research-papers/" + h.textContent.trim(), lang: l[1], href: href };
    return null;
  }

  function langChips(others) {
    var row = document.createElement("div");
    row.className = "vp-langs";
    row.appendChild(document.createTextNode("Also in"));
    others.forEach(function (o) {
      // The card itself is a link, so chips navigate by script rather than nesting <a>.
      var chip = document.createElement("span");
      chip.className = "vp-lang";
      chip.setAttribute("role", "link");
      chip.tabIndex = 0;
      chip.textContent = o.lang;
      function go(e) { e.preventDefault(); e.stopPropagation(); location.href = o.href; }
      chip.addEventListener("click", go);
      chip.addEventListener("keydown", function (e) { if (e.key === "Enter") go(e); });
      row.appendChild(chip);
    });
    return row;
  }

  function cardsIn(grid) {
    return Array.prototype.filter.call(grid.children, function (c) { return c.matches("a.card, a.card-frame") && titleKey(c); });
  }

  function groupGrid(grid) {
    // Recompute from scratch: filters re-render these lists and reuse nodes.
    grid.querySelectorAll(":scope > .vp-dup").forEach(function (c) { c.classList.remove("vp-dup"); });
    grid.querySelectorAll(":scope > a > .vp-langs").forEach(function (r) { r.remove(); });
    var groups = {}, order = [];
    cardsIn(grid).forEach(function (c) {
      var k = titleKey(c);
      if (!groups[k.base]) { groups[k.base] = []; order.push(k.base); }
      groups[k.base].push({ card: c, lang: k.lang, href: k.href });
    });
    var hidden = 0;
    order.forEach(function (b) {
      var g = groups[b];
      if (g.length < 2) return;
      g.slice(1).forEach(function (o) { o.card.classList.add("vp-dup"); hidden++; });
      g[0].card.appendChild(langChips(g.slice(1)));
    });
    // A row that collapses to one title shows it as a wide feature card.
    grid.classList.toggle("vp-solo", order.length === 1 && hidden > 0);
    return { hidden: hidden, bases: order };
  }

  var catalog; // browse page cards, fetched once for backfilling the home page
  function backfill(grid, need, shown) {
    var kind = (cardsIn(grid)[0] && titleKey(cardsIn(grid)[0]).base.split("/")[0]);
    if (!kind || !need) return;
    catalog = catalog || fetch("/browse").then(function (r) { return r.text(); }).then(function (html) {
      return new DOMParser().parseFromString(html, "text/html");
    });
    catalog.then(function (doc) {
      var groups = {}, order = [];
      doc.querySelectorAll("a.card, a.card-frame").forEach(function (c) {
        var k = titleKey(c);
        if (!k || k.base.split("/")[0] !== kind || shown.indexOf(k.base) >= 0) return;
        if (!groups[k.base]) { groups[k.base] = []; order.push(k.base); }
        groups[k.base].push({ card: c, lang: k.lang, href: k.href });
      });
      order.slice(0, need).forEach(function (b) {
        var g = groups[b];
        var card = document.importNode(g[0].card, true);
        card.classList.add("vp-filled");
        if (g.length > 1) card.appendChild(langChips(g.slice(1)));
        grid.appendChild(card);
        shown.push(b);
      });
    });
  }

  // "79 courses found" counts every language version. Show distinct titles instead,
  // in our own element next to the page's (which stays, hidden, so React can keep updating it).
  var COUNTER = /^\d+\s+(course|courses|paper|papers)\s+found$/;
  function updateCounters(main) {
    // The courses page renders 12 at a time; counting needs them all, and once
    // grouped the full list is short anyway.
    var more = Array.prototype.find.call(main.querySelectorAll("button"), function (b) { return /^Load More Courses$/i.test(b.textContent.trim()); });
    if (more) more.click();
    // React swaps in a fresh counter node when filters change, so rebuild ours every pass.
    main.querySelectorAll(".vp-count").forEach(function (el) { el.remove(); });
    main.querySelectorAll("p").forEach(function (p) {
      var m = COUNTER.exec(p.textContent.trim());
      if (!m) return;
      var paper = /^paper/.test(m[1]);
      var n = main.querySelectorAll((paper ? 'a[href^="/research-papers/"]' : 'a[href^="/courses/"]') + ":not(.vp-dup)").length;
      var out = document.createElement("p");
      out.className = p.className.replace("vp-count-src", "") + " vp-count";
      p.classList.add("vp-count-src");
      p.after(out);
      out.textContent = n + " " + (paper ? "paper" : "course") + (n === 1 ? "" : "s") + " found";
    });
  }

  var busy = false;
  function dedupe() {
    if (busy) return;
    busy = true;
    var shown = [];
    document.querySelectorAll("main .card-grid, main .grid").forEach(function (grid) {
      if (!cardsIn(grid).length) return;
      var r = groupGrid(grid);
      shown = shown.concat(r.bases);
      if (page === "home" && !grid.dataset.vpFilled) {
        grid.dataset.vpFilled = "1";
        backfill(grid, r.hidden, shown);
      }
    });
    var main = document.querySelector("main");
    if (main) updateCounters(main);
    busy = false;
  }

  function watchLists() {
    var main = document.querySelector("main");
    if (!main) return;
    var t;
    new MutationObserver(function (muts) {
      // Ignore our own edits (chips, classes); react to lists React re-renders.
      // Filters both add and remove cards, so either kind of change triggers a regroup.
      function theirs(n) { return n.nodeType === 1 && !n.classList.contains("vp-langs") && !n.classList.contains("vp-filled") && !n.classList.contains("vp-count"); }
      var external = muts.some(function (m) {
        return Array.prototype.some.call(m.addedNodes, theirs) || Array.prototype.some.call(m.removedNodes, theirs);
      });
      if (!external) return;
      clearTimeout(t);
      t = setTimeout(dedupe, 120);
    }).observe(main, { childList: true, subtree: true });
  }

  // Only touch the DOM after React has hydrated, otherwise it re-renders over our changes.
  // A second pass picks up client-rendered lists that arrive later.
  function start() {
    setTimeout(function () { tag(); dedupe(); watchLists(); }, 300);
    setTimeout(tag, 1500);
  }
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();

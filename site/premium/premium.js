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

  // Only touch the DOM after React has hydrated, otherwise it re-renders over our changes.
  // A second pass picks up client-rendered lists that arrive later.
  function start() { setTimeout(tag, 300); setTimeout(tag, 1500); }
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start);
})();

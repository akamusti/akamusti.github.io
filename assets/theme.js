/* akaMusti theme switcher — Omarchy tarzı.
   - localStorage'da saklar ("akamusti-theme")
   - <html data-theme="..."> üzerinden assets/themes.css'i sürer
   - T tuşu ile turlar (input içindeyken hariç) */
(function () {
  "use strict";
  var KEY = "akamusti-theme";

  var THEMES = [
    { id: "abyss",         name: "Abyss",         c: ["#0b0d10", "#7df0ff", "#ff9d6b"] },
    { id: "tokyo-night",   name: "Tokyo Night",   c: ["#1a1b26", "#7aa2f7", "#bb9af7"] },
    { id: "gruvbox",       name: "Gruvbox",       c: ["#282828", "#fabd2f", "#fe8019"] },
    { id: "catppuccin",    name: "Catppuccin",    c: ["#1e1e2e", "#89b4fa", "#f5c2e7"] },
    { id: "rose-pine",     name: "Rosé Pine",     c: ["#191724", "#ebbcba", "#c4a7e7"] },
    { id: "nord",          name: "Nord",          c: ["#2e3440", "#88c0d0", "#81a1c1"] },
    { id: "dracula",       name: "Dracula",       c: ["#282a36", "#bd93f9", "#ff79c6"] },
    { id: "everforest",    name: "Everforest",    c: ["#2b3339", "#a7c080", "#e69875"] },
    { id: "kanagawa",      name: "Kanagawa",      c: ["#1f1f28", "#7e9cd8", "#d27e99"] },
    { id: "osaka-jade",    name: "Osaka Jade",    c: ["#101815", "#62d99a", "#e0c060"] },
    { id: "matte-black",   name: "Matte Black",   c: ["#000000", "#ffffff", "#8a8a8a"] },
    { id: "flexoki-light", name: "Flexoki Light", c: ["#fffcf0", "#205ea6", "#d14d41"] }
  ];

  function byId(id) {
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i];
    return null;
  }

  function current() {
    var t = document.documentElement.getAttribute("data-theme");
    return byId(t) ? t : "abyss";
  }

  function apply(id, save) {
    if (!byId(id)) id = "abyss";
    document.documentElement.setAttribute("data-theme", id);
    try { if (save !== false) localStorage.setItem(KEY, id); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    try {
      var cs = getComputedStyle(document.documentElement).getPropertyValue("--meta").trim();
      if (meta && cs) meta.setAttribute("content", cs);
    } catch (e) {}
    document.querySelectorAll(".theme-opt").forEach(function (b) {
      b.setAttribute("aria-checked", b.dataset.themeId === id ? "true" : "false");
    });
    document.dispatchEvent(new CustomEvent("akamusti:theme", { detail: { theme: id } }));
  }

  function buildPanel() {
    var wrap = document.getElementById("theme");
    if (!wrap) return;
    var panel = wrap.querySelector(".theme-panel");
    var btn = document.getElementById("themeBtn");
    if (!panel || !btn) return;
    if (panel.dataset.built === "1") { apply(current(), false); return; }
    panel.dataset.built = "1";

    var hint = document.createElement("div");
    hint.className = "theme-hint";
    hint.innerHTML = "tema seç &nbsp;·&nbsp; <kbd>T</kbd> ile turla";
    panel.appendChild(hint);

    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "theme-opt";
      b.dataset.themeId = t.id;
      b.setAttribute("role", "menuitemradio");
      b.setAttribute("aria-checked", "false");
      var dots = document.createElement("span");
      dots.className = "theme-dots";
      t.c.forEach(function (col) {
        var i = document.createElement("i");
        i.style.background = col;
        dots.appendChild(i);
      });
      var nm = document.createElement("span");
      nm.className = "theme-name";
      nm.textContent = t.name;
      var tick = document.createElement("span");
      tick.className = "theme-tick";
      tick.textContent = "✓";
      b.appendChild(dots); b.appendChild(nm); b.appendChild(tick);
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        apply(t.id);
      });
      panel.appendChild(b);
    });

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        wrap.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    apply(current(), false);
  }

  // T ile tema turla (Omarchy'deki gibi) — yazı yazarken tetiklenmesin
  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || "";
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable)) return;
    if (e.key === "t" || e.key === "T" || e.key === "ц" || e.key === "Ц") {
      var ids = THEMES.map(function (t) { return t.id; });
      var next = ids[(ids.indexOf(current()) + 1) % ids.length];
      apply(next);
    }
  });

  window.__akamustiTheme = { list: THEMES, apply: apply, current: current };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildPanel);
  } else {
    buildPanel();
  }
})();

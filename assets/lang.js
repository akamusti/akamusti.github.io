/* akaMusti language switcher — TR/EN.
   - localStorage'da saklar ("akamusti-lang")
   - [data-i18n] elemanlarının metnini sözlükten yazar
   - <html lang="..."> günceller */
(function () {
  "use strict";
  var KEY = "akamusti-lang";

  var STR = {
    "nav.journal":   { tr: "günlük",   en: "journal" },
    "nav.guestbook": { tr: "defter",    en: "guestbook" },
    "nav.projects":  { tr: "projeler",  en: "projects" },
    "cta.projects":  { tr: "projelerim", en: "my projects" },
    "back.home":     { tr: "← ana sayfa", en: "← home" },
    "blog.title":    { tr: "günlük", en: "journal" },
    "blog.sub":      { tr: "aklıma gelenleri buraya karalıyorum", en: "notes I jot down" },
    "blog.empty":    { tr: "henüz yazı yok — yakında.", en: "no posts yet — soon." },
    "guestbook.title": { tr: "ziyaretçi defteri", en: "guestbook" },
    "guestbook.sub":   { tr: "uğradıysan bir satır bırak, çekinme", en: "if you stopped by, leave a line" },
    "projects.title":  { tr: "projeler", en: "projects" },
    "projects.sub":    { tr: "boş vakitlerimde kurcaladıklarım", en: "things I tinker with in my spare time" },
    "privacy.title":   { tr: "gizlilik", en: "privacy" },
    "privacy.sub":     { tr: "bu site verini nasıl ele alır — kısa ve net", en: "how this site handles your data — short and clear" },
    "privacy.p1t": { tr: "toplanmayan veriler", en: "data not collected" },
    "privacy.p1":  { tr: "Bu sitede hesap, takip, reklam ve analitik yoktur. Ziyaretini ölçmüyorum, profil çıkarmıyorum.", en: "This site has no accounts, tracking, ads, or analytics. Your visit is not measured or profiled." },
    "privacy.p2t": { tr: "cihazında saklananlar", en: "stored on your device" },
    "privacy.p2":  { tr: "Tema ve dil tercihin tarayıcının localStorage alanında saklanır. Yalnızca sitenin çalışması için kullanılır, sunucuya gönderilmez.", en: "Your theme and language preference are stored in the browser's localStorage. Used only for the site to function, never sent to a server." },
    "privacy.p3t": { tr: "deftere yazarsan", en: "if you write in the guestbook" },
    "privacy.p3":  { tr: "Defter, utterances üzerinden GitHub Issues ile çalışır. Yorumun, kullanıcı adın ve avatarın herkese açık olur. Bu kısımda GitHub'ın gizlilik politikası geçerlidir.", en: "The guestbook runs on GitHub Issues via utterances. Your comment, username, and avatar become public. GitHub's privacy policy applies to that part." },
    "privacy.p4t": { tr: "üçüncü taraflar", en: "third parties" },
    "privacy.p4":  { tr: "Site GitHub Pages üzerinde barındırılır; temel sunucu kayıtları oluşabilir. Dış bağlantılara (GitHub, X, Letterboxd ve diğerleri) tıklarsan o sitelerin politikaları geçerli olur.", en: "The site is hosted on GitHub Pages; basic server logs may occur. If you follow outbound links (GitHub, X, Letterboxd, and others), those sites' policies apply." },
    "privacy.p5t": { tr: "hakların", en: "your rights" },
    "privacy.p5":  { tr: "Tarayıcı verilerini silerek tercihlerini kaldırabilirsin. Herkese açık yorumlarını GitHub üzerinden düzenleyebilir veya silebilirsin.", en: "You can clear your preferences by deleting browser data. You can edit or delete your public comments via GitHub." },
    "privacy.p6t": { tr: "iletişim", en: "contact" },
    "privacy.p6":  { tr: "Gizlilikle ilgili sorular için GitHub profili üzerinden ulaş.", en: "For privacy questions, reach out via the GitHub profile." },
    "privacy.updated": { tr: "son güncelleme: eylül 2026", en: "last updated: september 2026" },
    "footer.privacy": { tr: "gizlilik", en: "privacy" },
    "home.bio": { tr: "Ur Virtual Puppyboy :3", en: "Ur Virtual Puppyboy :3" }
  };

  var PROJ = {
    "kick-notifier": {
      tr: "Sevdiğin Kick yayıncıları canlıya geçince haber veren site ve tarayıcı eklentileri.",
      en: "Site and browser extensions that notify you when your favorite Kick streamers go live."
    },
    "kick-yayin-takipcisi": {
      tr: "Firefox eklentisi — kanalları ekle, kim canlı bir bakışta gör, yayın başlayınca bildirim al.",
      en: "Firefox extension — add channels, see who is live at a glance, get notified when a stream starts."
    },
    "kick-takipci-chromium": {
      tr: "Yayın takipçisinin Chromium sürümü — Kick yayıncılarının aktifliğini izler.",
      en: "Chromium version of the stream tracker — monitors Kick streamer activity."
    },
    "soundsniff": {
      tr: "Shazam tarzı müzik tanıma eklentisi — Firefox ve türevleri için.",
      en: "Shazam-style music recognition extension — for Firefox and derivatives."
    },
    "dotfiles": {
      tr: "Omarchy / Hyprland kurulumumun nokta dosyaları.",
      en: "Dotfiles of my Omarchy / Hyprland setup."
    },
    "this-site": {
      tr: "Okuduğun sitenin ta kendisi — cam efektli, temalı, müzikli.",
      en: "The very site you are reading — glassy, themed, with music."
    }
  };

  function current() {
    try {
      var l = localStorage.getItem(KEY);
      if (l === "en" || l === "tr") return l;
    } catch (e) {}
    var h = document.documentElement.getAttribute("lang");
    return h === "en" ? "en" : "tr";
  }

  function t(key, lang) {
    var e = STR[key];
    if (e) return e[lang] || e.tr;
    return null;
  }

  function apply(lang, save) {
    if (lang !== "en" && lang !== "tr") lang = "tr";
    document.documentElement.setAttribute("lang", lang);
    try { if (save !== false) localStorage.setItem(KEY, lang); } catch (e) {}
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"), lang);
      if (v !== null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-aria"), lang);
      if (v !== null) el.setAttribute("aria-label", v);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n-title"), lang);
      if (v !== null) el.setAttribute("title", v);
    });
    document.querySelectorAll("[data-proj-desc]").forEach(function (el) {
      var id = el.getAttribute("data-proj-desc");
      if (PROJ[id]) el.textContent = PROJ[id][lang];
    });
    document.querySelectorAll(".lang-opt").forEach(function (b) {
      b.setAttribute("aria-checked", b.dataset.langId === lang ? "true" : "false");
    });
    var btn = document.getElementById("langBtn");
    if (btn) btn.textContent = lang === "tr" ? "EN" : "TR";
    document.dispatchEvent(new CustomEvent("akamusti:lang", { detail: { lang: lang } }));
  }

  function buildSwitcher() {
    var wrap = document.getElementById("lang");
    if (!wrap) return;
    var panel = wrap.querySelector(".lang-panel");
    var btn = document.getElementById("langBtn");
    if (!panel || !btn) return;
    if (panel.dataset.built === "1") { apply(current(), false); return; }
    panel.dataset.built = "1";

    [["tr", "Türkçe"], ["en", "English"]].forEach(function (pair) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lang-opt";
      b.dataset.langId = pair[0];
      b.setAttribute("role", "menuitemradio");
      b.setAttribute("aria-checked", "false");
      var nm = document.createElement("span");
      nm.className = "theme-name";
      nm.textContent = pair[1];
      var tick = document.createElement("span");
      tick.className = "theme-tick";
      tick.textContent = "✓";
      b.appendChild(nm); b.appendChild(tick);
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        apply(pair[0]);
        wrap.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
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

  window.__akamustiLang = { apply: apply, current: current, t: t };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildSwitcher);
  } else {
    buildSwitcher();
  }
})();

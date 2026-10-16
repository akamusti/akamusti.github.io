/* akaMusti language switcher — TR/EN.
   - localStorage'da saklar ("akamusti-lang")
   - [data-i18n] elemanlarının metnini sözlükten yazar
   - <html lang="..."> günceller */
(function () {
  "use strict";
  var KEY = "akamusti-lang";

  var STR = {
    "nav.journal":   { tr: "günlük",   en: "journal" },
    "nav.about":     { tr: "hakkımda", en: "about" },
    "about.title":   { tr: "Hakkımda", en: "About" },
    "about.p1": { tr: "Ben Musti. Kendimce bir şeyler yapıyorum.", en: "I'm Musti. I make stuff my own way." },
    "about.p2": { tr: "Film ve dizi izlemeyi severim. Bu kadar...", en: "I like watching movies and series. That's it..." },
    "nav.guestbook": { tr: "defter",    en: "guestbook" },
    "nav.projects":  { tr: "projeler",  en: "projects" },
    "cta.projects":  { tr: "projelerim", en: "my projects" },
    "back.home":     { tr: "← ana sayfa", en: "← home" },
    "back.blog":     { tr: "← tüm yazılar", en: "← all posts" },
    "blog.title":    { tr: "günlük", en: "journal" },
    "blog.sub":      { tr: "aklıma gelenleri buraya karalıyorum", en: "notes I jot down" },
    "blog.empty":    { tr: "henüz yazı yok — yakında.", en: "no posts yet — soon." },
    "blog.min":      { tr: "dk okuma", en: "min read" },
    "blog.rss":      { tr: "rss aboneliği", en: "rss feed" },
    "post.prev":     { tr: "önceki yazı", en: "previous post" },
    "post.next":     { tr: "sonraki yazı", en: "next post" },
    "post.copy":     { tr: "bağlantıyı kopyala", en: "copy link" },
    "post.share":    { tr: "paylaş", en: "share" },
    "post.copied":   { tr: "kopyalandı :3", en: "copied :3" },
    "post.tags":     { tr: "etiketler", en: "tags" },
    "a11y.skip":     { tr: "içeriğe atla", en: "skip to content" },
    "guestbook.title": { tr: "ziyaretçi defteri", en: "guestbook" },
    "guestbook.sub":   { tr: "uğradıysan bir satır bırak, çekinme", en: "if you stopped by, leave a line" },
    "guestbook.status":{ tr: "*.·.· defter açık ·.·.*", en: "*.·.· guestbook open ·.·.*" },
    "projects.title":  { tr: "projeler", en: "projects" },
    "projects.sub":    { tr: "boş vakitlerimde kurcaladıklarım", en: "things I tinker with in my spare time" },
    "privacy.title":   { tr: "gizlilik", en: "privacy" },
    "privacy.sub":     { tr: "bu site verini nasıl ele alır — kısa ve net", en: "how this site handles your data — short and clear" },
    "privacy.p1t": { tr: "toplanmayan veriler", en: "data not collected" },
    "privacy.p1":  { tr: "Bu sitede hesap, takip, reklam ve analitik yoktur. Ziyaretini ölçmüyorum, profil çıkarmıyorum.", en: "This site has no accounts, tracking, ads, or analytics. Your visit is not measured or profiled." },
    "privacy.p2t": { tr: "cihazında saklananlar", en: "stored on your device" },
    "privacy.p2":  { tr: "Tema, dil ve oynatıcı (ses / açık-kapalı) tercihin tarayıcının localStorage alanında saklanır. Yalnızca sitenin çalışması için kullanılır, sunucuya gönderilmez.", en: "Your theme, language, and player (volume / open-closed) preference are stored in the browser's localStorage. Used only for the site to function, never sent to a server." },
    "privacy.p3t": { tr: "deftere yazarsan", en: "if you write in the guestbook" },
    "privacy.p3":  { tr: "Defter, utterances üzerinden GitHub Issues ile çalışır. Yorumun, kullanıcı adın ve avatarın herkese açık olur. Bu kısımda GitHub'ın gizlilik politikası geçerlidir.", en: "The guestbook runs on GitHub Issues via utterances. Your comment, username, and avatar become public. GitHub's privacy policy applies to that part." },
    "privacy.p4t": { tr: "üçüncü taraflar", en: "third parties" },
    "privacy.p4":  { tr: "Site GitHub Pages üzerinde barındırılır; temel sunucu kayıtları oluşabilir. Dış bağlantılara (GitHub, X, Letterboxd ve diğerleri) tıklarsan o sitelerin politikaları geçerli olur.", en: "The site is hosted on GitHub Pages; basic server logs may occur. If you follow outbound links (GitHub, X, Letterboxd, and others), those sites' policies apply." },
    "privacy.p5t": { tr: "hakların (kvkk m.11)", en: "your rights (kvkk art. 11)" },
    "privacy.p5":  { tr: "İşlenip işlenmediğini öğrenme, bilgi isteme, amaca uygunluğu öğrenme, aktarılan üçüncü kişileri bilme, eksik/yanlışsa düzeltilmesini isteme, şartları varsa silinmesini isteme, otomatik işleme sonuçlarına itiraz etme ve zararın giderilmesini talep etme hakların var. Tercihleri tarayıcı verisini silerek, yorumları GitHub üzerinden kaldırabilirsin.", en: "You have the right to learn whether your data is processed, request information, learn the purpose and whether it is followed, know third-party recipients, request correction of incomplete or inaccurate data, request deletion where applicable, object to automated processing outcomes, and claim compensation for damages. Clear browser data for preferences; manage comments via GitHub." },
    "privacy.controller_t": { tr: "veri sorumlusu", en: "data controller" },
    "privacy.controller": { tr: "Bu sitenin veri sorumlusu akaMusti'dir. Bu sayfa KVKK m.10 kapsamında aydınlatma amaçlıdır. Sorular için GitHub profili üzerinden ulaş.", en: "The data controller of this site is akaMusti. This page serves as information under KVKK art. 10. For questions, reach out via the GitHub profile." },
    "privacy.purpose_t": { tr: "kullanım ve işleme amaçları", en: "purposes of use and processing" },
    "privacy.purpose": { tr: "Bu site kişisel blog ve portföy olarak kullanılır: yazıları okumak, projeleri incelemek, istersen deftere yazmak. Veriler yalnızca şu amaçlarla işlenir: site tercihlerini hatırlamak, defter yorumunu yayınlamak ve sitenin güvenli çalışmasını sağlamak. Reklam, profil çıkarma veya ziyaretçi ölçümü amacı yoktur.", en: "This site is a personal blog and portfolio: read posts, browse projects, optionally write in the guestbook. Data is processed only to remember site preferences, publish guestbook comments, and keep the site running securely. No ads, profiling, or visitor measurement." },
    "privacy.legal_t": { tr: "hukuki sebep ve saklama", en: "legal basis and retention" },
    "privacy.legal": { tr: "Tercihler (tema, dil, oynatıcı sesi) yalnızca senin işlemin üzerine cihazında saklanır, sunucuya gönderilmez ve sen silene kadar durur. Defter yorumun sen silene kadar GitHub Issues üzerinde herkese açık durur. GitHub Pages kaynaklı sunucu kayıtları varsa kısa süreli tutulur.", en: "Preferences (theme, language, player volume) are stored on your device only upon your action, never sent to a server, and kept until you delete them. Guestbook comments stay public on GitHub Issues until you delete them. Any GitHub Pages server logs are kept briefly." },
    "privacy.p6t": { tr: "iletişim", en: "contact" },
    "privacy.p6":  { tr: "Gizlilikle ilgili sorular için GitHub profili üzerinden ulaş.", en: "For privacy questions, reach out via the GitHub profile." },
    "privacy.updated": { tr: "son güncelleme: ekim 2026", en: "last updated: october 2026" },
    "nf.title": { tr: "burada bir şey yok", en: "nothing here" },
    "nf.sub":  { tr: "bağlantı bozuk ya da sayfa taşınmış olabilir", en: "the link is broken or the page moved" },
    "nf.home": { tr: "ana sayfa", en: "home" },
    "nf.blog": { tr: "günlük", en: "journal" },
    "footer.privacy": { tr: "gizlilik", en: "privacy" },
    "sec.projects": { tr: "projeler", en: "projects" },
    "sec.socials": { tr: "sosyal", en: "socials" },
    "sec.skyline": { tr: "hareket", en: "activity" },
    "skyline.title": { tr: "katkı — son bir yıl", en: "contributions — last year" },
    "skyline.total": { tr: "1 yıl toplam", en: "1 year total" },
    "skyline.busiest": { tr: "en yoğun gün", en: "busiest day" },
    "skyline.longest": { tr: "en uzun seri", en: "longest streak" },
    "skyline.current": { tr: "güncel seri", en: "current streak" },
    "skyline.unit": { tr: "katkı", en: "contributions" },
    "skyline.days": { tr: "gün", en: "days" },
    "skyline.hint": { tr: "gün detayı için üzerine gel · 3B'de sürükleyerek döndür", en: "hover a day for details · drag to orbit in 3D" },
    "skyline.less": { tr: "az", en: "less" },
    "skyline.more": { tr: "çok", en: "more" },
    "skyline.source": { tr: "veriler: github/akamusti", en: "data: github/akamusti" },
    "home.all": { tr: "tüm projeler →", en: "all projects →" },
    "home.bio": { tr: "Ur Virtual Puppyboy :3", en: "Ur Virtual Puppyboy :3" },
    "home.meta_langs": { tr: "tr / en", en: "tr / en" },
    "home.meta_projects": { tr: "7 proje", en: "7 projects" },
    "home.status": { tr: ":3", en: ":3" },
    "theme.hint": { tr: "tema seç · T ile turla", en: "select theme · T to cycle" }
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
      tr: "Okuduğun sitenin ta kendisi — sade, temalı, müzikli.",
      en: "The very site you are reading — plain, themed, with music."
    },
    "castmane": {
      tr: "Linux için çökme-güvenli ekran kaydedici — Wayland öncelikli, uygulama çökse bile çekim kurtulur.",
      en: "Crash-safe screen recorder for Linux (Wayland-first) — footage survives even if the app crashes."
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

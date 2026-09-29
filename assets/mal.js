/* akaMusti MyAnimeList widget — istemcide RSS çeker, önbelleğe alır, çizer.
   - rw:  liste başına tek kayıt (son durum)      → "listede son güncellenenler" + home'da ilk 3
   - rwe: bölüm bölüm geçmiş (tekrarlı olabilir)  → dedup'lanıp "bölüm geçmişi" olur
   - sıra: direkt fetch → proxy → (bozuksa) taze olmayan önbellek → profil linki
   - kullanım: <div data-mal="home|updated|episodes"></div> yeter, gerisini bu dosya halleder */
(function () {
  "use strict";

  var RW_URL = "https://myanimelist.net/rss.php?type=rw&u=akamusti";
  var RWE_URL = "https://myanimelist.net/rss.php?type=rwe&u=akamusti";
  var PROFILE_URL = "https://myanimelist.net/profile/akamusti";
  var CACHE_KEY = "akamusti-mal-cache";
  var TTL = 30 * 60 * 1000; // 30 dk

  var STATUS = {
    "Watching":      { tr: "İzliyor",    en: "Watching" },
    "Completed":     { tr: "Tamamlandı", en: "Completed" },
    "Plan to Watch": { tr: "İzleyecek",  en: "Plan to Watch" },
    "On-Hold":       { tr: "Beklemede",  en: "On-Hold" },
    "Dropped":       { tr: "Bıraktı",    en: "Dropped" }
  };

  var TXT = {
    loading: { tr: "yükleniyor…", en: "loading…" },
    fail:    { tr: "liste alınamadı — ", en: "couldn't load the list — " },
    profile: { tr: "myanimelist profilim", en: "myanimelist profile" }
  };

  function lang() {
    try {
      if (window.__akamustiLang) return window.__akamustiLang.current();
    } catch (e) {}
    return (document.documentElement.getAttribute("lang") === "en") ? "en" : "tr";
  }
  function t(dict, key) {
    var l = lang();
    if (dict[key]) return dict[key][l] || dict[key].tr;
    return key;
  }

  function rel(ts) {
    var l = lang();
    var d = Date.now() - ts;
    if (isNaN(d) || d < 0) d = 0;
    var m = Math.floor(d / 60000);
    if (m < 1) return l === "tr" ? "şimdi" : "now";
    if (m < 60) return l === "tr" ? m + " dk" : m + " min";
    var h = Math.floor(m / 60);
    if (h < 24) return l === "tr" ? h + " sa" : h + "h";
    var days = Math.floor(h / 24);
    if (days < 7) return l === "tr" ? days + " g" : days + "d";
    if (days < 30) {
      var w = Math.floor(days / 7);
      return l === "tr" ? w + " hf" : w + "w";
    }
    try {
      return new Date(ts).toLocaleDateString(l === "tr" ? "tr-TR" : "en-US",
        { day: "numeric", month: "short" });
    } catch (e) { return ""; }
  }

  function parseItem(node) {
    function text(tag) {
      var el = node.getElementsByTagName(tag)[0];
      return el ? (el.textContent || "").trim() : "";
    }
    var rawTitle = text("title");
    var link = text("link");
    var desc = text("description");
    var date = Date.parse(text("pubDate"));

    // rw başlıkları "İsim - TV/Movie/OVA..." biter → ismi temizle, türü etikete al
    var name = rawTitle, type = "";
    var tm = rawTitle.match(/^(.*)\s+-\s+(TV|Movie|OVA|ONA|Special|Music)$/);
    if (tm) { name = tm[1].trim(); type = tm[2]; }

    // açıklama "Durum - 12 of 12 episodes" formatında
    var status = "", prog = "";
    var dm = desc.match(/^(.*?)\s+-\s+(\d+)\s+of\s+(\S+)\s+episodes?$/);
    if (dm) {
      status = dm[1].trim();
      prog = dm[2] + "/" + dm[3];
    } else if (desc) {
      status = desc;
    }
    return { name: name, type: type, link: link, status: status, prog: prog, date: date };
  }

  function parseRSS(text) {
    var doc = new DOMParser().parseFromString(text, "text/xml");
    if (doc.getElementsByTagName("parsererror").length) throw new Error("xml");
    var out = [];
    var nodes = doc.getElementsByTagName("item");
    for (var i = 0; i < nodes.length; i++) {
      var it = parseItem(nodes[i]);
      if (it.name && it.link) out.push(it);
    }
    return out;
  }

  function fetchText(url) {
    // 1) direkt dene (CORS izin verirse en temizi)
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return r.text();
    }).catch(function () {
      // 2) proxy üzerinden dene
      return fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url))
        .then(function (r) {
          if (!r.ok) throw new Error("proxy " + r.status);
          return r.text();
        });
    });
  }

  function readCache() {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (c && c.ts && c.updated && c.episodes) return c;
    } catch (e) {}
    return null;
  }
  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        ts: Date.now(), updated: data.updated, episodes: data.episodes
      }));
    } catch (e) {}
  }

  var dataPromise = null;
  function load() {
    if (dataPromise) return dataPromise;
    dataPromise = Promise.all([fetchText(RW_URL), fetchText(RWE_URL)])
      .then(function (pair) {
        var data = { updated: parseRSS(pair[0]), episodes: parseRSS(pair[1]) };
        writeCache(data);
        return data;
      })
      .catch(function () {
        // ağ patlarsa taze olmayan önbellek bile iş görür
        var c = readCache();
        if (c) return { updated: c.updated, episodes: c.episodes, stale: true };
        throw new Error("mal-unavailable");
      });
    // taze önbellek varsa ağı bekletmeden onu ver, arka planda tazele
    var fresh = readCache();
    if (fresh && (Date.now() - fresh.ts) < TTL) {
      return Promise.resolve({ updated: fresh.updated, episodes: fresh.episodes });
    }
    return dataPromise;
  }

  function dedup(items) {
    var seen = {}, out = [];
    for (var i = 0; i < items.length; i++) {
      if (!seen[items[i].link]) { seen[items[i].link] = true; out.push(items[i]); }
    }
    return out;
  }

  function rowEl(it) {
    var a = document.createElement("a");
    a.className = "row";
    a.href = it.link;
    a.target = "_blank";
    a.rel = "noopener";

    var top = document.createElement("div");
    top.className = "row-top";
    var nm = document.createElement("span");
    nm.className = "row-name";
    nm.textContent = it.name;
    top.appendChild(nm);
    if (it.type) {
      var tag = document.createElement("span");
      tag.className = "row-tag";
      tag.textContent = it.type.toLowerCase();
      top.appendChild(tag);
    }
    var arrow = document.createElement("span");
    arrow.className = "row-arrow";
    arrow.textContent = "↗";
    top.appendChild(arrow);
    a.appendChild(top);

    var desc = document.createElement("p");
    desc.className = "row-desc";
    var bits = [];
    if (it.status) bits.push(t(STATUS, it.status));
    if (it.prog) bits.push(it.prog);
    if (!isNaN(it.date)) bits.push(rel(it.date));
    desc.textContent = bits.join(" · ");
    a.appendChild(desc);
    return a;
  }

  function failEl() {
    var p = document.createElement("p");
    p.className = "row-desc";
    p.textContent = t(TXT, "fail");
    var a = document.createElement("a");
    a.href = PROFILE_URL;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = t(TXT, "profile");
    a.style.color = "var(--accent)";
    p.appendChild(a);
    return p;
  }

  // dil değişince yeniden çizilebilmesi için kayıt tut
  var mounted = [];
  function render(box, items) {
    box.innerHTML = "";
    if (!items.length) { box.appendChild(failEl()); return; }
    items.forEach(function (it) { box.appendChild(rowEl(it)); });
  }
  function mount(box, pick) {
    mounted.push({ box: box, pick: pick });
    load().then(function (d) {
      render(box, pick(d));
    }).catch(function () {
      box.innerHTML = "";
      box.appendChild(failEl());
    });
  }

  function init() {
    document.querySelectorAll("[data-mal]").forEach(function (box) {
      var kind = box.getAttribute("data-mal");
      if (kind === "home") mount(box, function (d) { return d.updated.slice(0, 3); });
      else if (kind === "updated") mount(box, function (d) { return d.updated; });
      else if (kind === "episodes") mount(box, function (d) { return dedup(d.episodes).slice(0, 15); });
    });
  }

  document.addEventListener("akamusti:lang", function () {
    if (!mounted.length) return;
    load().then(function (d) {
      mounted.forEach(function (m) { render(m.box, m.pick(d)); });
    }).catch(function () {});
  });

  window.__akamustiMAL = { load: load };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

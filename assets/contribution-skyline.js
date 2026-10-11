/* Contribution Skyline — vanilla JS port for akaMusti (static site, no React).
   Orijinal React bileşenindeki saf matematik + canvas motorunun sadeleştirilmiş uyarlaması.
   Bağımlılık yok. Tema, [data-theme] / prefers-color-scheme değişimlerini izler. */
(function () {
  "use strict";

  var DAY_MS = 86400000;
  var WAVE = 0.42;
  var YAW_3D = Math.PI / 4;
  var ELEV_3D = (34 * Math.PI) / 180;

  function clamp01(v) { return v > 0 ? (v < 1 ? v : 1) : 0; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOutCubic(x) { var t = clamp01(x); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutCubic(x) { return 1 - Math.pow(1 - clamp01(x), 3); }
  function smoothstep(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function toKey(ms) { return new Date(ms).toISOString().slice(0, 10); }
  function dayMs(v) {
    if (typeof v === "number") return Math.floor(v / DAY_MS) * DAY_MS;
    if (typeof v === "string") {
      var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
      if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3]);
      v = new Date(v);
    }
    return Date.UTC(v.getFullYear(), v.getMonth(), v.getDate());
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function generateContributions(endMs, seed, days) {
    seed = seed == null ? 7 : seed; days = days || 371;
    var r = rng(seed);
    var bursts = [];
    for (var b = 0; b < 4; b++) bursts.push({ at: r(), width: 0.035 + r() * 0.07, gain: 0.6 + r() * 1.1 });
    var out = [], mood = 0.5, i, j;
    for (i = 0; i < days; i++) {
      var ms = endMs - (days - 1 - i) * DAY_MS;
      var x = i / Math.max(1, days - 1);
      var dow = new Date(ms).getUTCDay();
      var weekend = dow === 0 || dow === 6;
      var heat = 0.2;
      for (j = 0; j < bursts.length; j++) {
        var bb = bursts[j];
        heat += bb.gain * Math.exp(-Math.pow(x - bb.at, 2) / (2 * bb.width * bb.width));
      }
      mood = mood * 0.85 + r() * 0.15;
      heat *= 0.55 + mood * 0.9;
      var pActive = Math.min(0.94, (weekend ? 0.22 : 0.5) + heat * 0.4);
      var count = 0;
      if (r() < pActive) count = 1 + Math.floor(-Math.log(1 - r()) * (1.2 + heat * 7) * (weekend ? 0.5 : 1));
      if (r() < 0.01) count += 18 + Math.floor(r() * 24);
      out.push({ date: toKey(ms), count: count });
    }
    return out;
  }
  function levelOf(count, busy) {
    if (count <= 0) return 0;
    if (busy <= 0) return 4;
    return 1 + Math.min(3, Math.floor((count / busy) * 4));
  }
  function buildGrid(data, endMs, weekStart) {
    weekStart = weekStart || 0;
    var counts = {}, i;
    for (i = 0; i < data.length; i++) {
      var d = data[i];
      if (!d || typeof d.date !== "string") continue;
      var ms = dayMs(d.date), c = Number(d.count);
      if (!isFinite(ms) || !(c > 0) || !isFinite(c)) continue;
      var k = toKey(ms);
      counts[k] = (counts[k] || 0) + c;
    }
    var start = endMs - 364 * DAY_MS;
    start -= ((new Date(start).getUTCDay() - weekStart + 7) % 7) * DAY_MS;
    var cells = [];
    for (var m2 = start, idx = 0; m2 <= endMs; m2 += DAY_MS, idx++) {
      var date = toKey(m2);
      cells.push({ date: date, count: counts[date] || 0, level: 0, week: Math.floor(idx / 7), day: idx % 7 });
    }
    var nz = cells.map(function (c2) { return c2.count; }).filter(function (c2) { return c2 > 0; }).sort(function (a, b) { return a - b; });
    var busy = nz.length ? nz[Math.floor(0.95 * (nz.length - 1))] : 0;
    for (i = 0; i < cells.length; i++) cells[i].level = levelOf(cells[i].count, busy);
    return { cells: cells, weeks: cells.length ? cells[cells.length - 1].week + 1 : 0, max: nz.length ? nz[nz.length - 1] : 0 };
  }
  function computeStats(cells) {
    var total = 0, best = 0, bestDate = null, run = 0, runStart = null;
    var longest = { days: 0, start: null, end: null }, i;
    for (i = 0; i < cells.length; i++) {
      var c = cells[i];
      total += c.count;
      if (c.count > best) { best = c.count; bestDate = c.date; }
      if (c.count > 0) {
        if (run === 0) runStart = c.date;
        run++;
        if (run > longest.days) longest = { days: run, start: runStart, end: c.date };
      } else run = 0;
    }
    var j = cells.length - 1;
    if (j >= 0 && cells[j].count === 0) j--;
    var endAt = j;
    while (j >= 0 && cells[j].count > 0) j--;
    var days = endAt - j;
    var current = days > 0 ? { days: days, start: cells[j + 1].date, end: cells[endAt].date } : { days: 0, start: null, end: null };
    return { total: total, first: cells.length ? cells[0].date : null, last: cells.length ? cells[cells.length - 1].date : null, busiest: { count: best, date: bestDate }, longest: longest, current: current };
  }

  var PALETTES = {
    github: { light: ["#c6e48b", "#7bc96f", "#239a3b", "#196127"], dark: ["#0e4429", "#006d32", "#26a641", "#39d353"] },
    ocean: { light: ["#b8e3f5", "#6ec3eb", "#2a8fd1", "#0b4f8a"], dark: ["#0c2d4a", "#12508a", "#2a88d8", "#7cc7ff"] },
    ember: { light: ["#fde2c4", "#fbad6e", "#f06b3a", "#b3261e"], dark: ["#4a1a10", "#8f2f16", "#e0572a", "#ffa46b"] }
  };
  function resolvePalette(dark) {
    var set = (dark ? PALETTES.github.dark : PALETTES.github.light);
    return set.slice();
  }
  function barHeight(count, max) { return count > 0 && max > 0 ? 0.4 + Math.pow(count / max, 0.85) * 7.2 : 0.2; }
  function riseAt(t, week, weeks, day) {
    var d = (weeks > 1 ? week / (weeks - 1) : 0) * 0.36 + (day / 6) * 0.06;
    return easeOutCubic((t - d) / (1 - WAVE));
  }
  function camera(e, dYaw, dElev) {
    dYaw = dYaw || 0; dElev = dElev || 0;
    var yaw = Math.min((82 * Math.PI) / 180, Math.max(0, lerp(0, YAW_3D + dYaw, e)));
    var elev = lerp(Math.PI / 2, Math.min((62 * Math.PI) / 180, Math.max((18 * Math.PI) / 180, ELEV_3D + dElev)), e);
    return { cs: Math.cos(yaw), sn: Math.sin(yaw), se: Math.sin(elev), ce: Math.cos(elev) };
  }
  function project(cam, x, y, z) {
    return [x * cam.cs - y * cam.sn, (x * cam.sn + y * cam.cs) * cam.se - z * cam.ce];
  }
  function mixRGB(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function luminance(c) { return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255; }
  function rgbStr(r, g, b) { return "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")"; }

  function hexRGB(h) {
    var m = /^#([0-9a-f]{6})$/i.exec(h);
    if (!m) return null;
    var v = parseInt(m[1], 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }

  function init(root) {
    var stage = root.querySelector("[data-sky-stage]");
    var canvas = root.querySelector("[data-sky-canvas]");
    var tip = root.querySelector("[data-sky-tip]");
    var ctx = canvas.getContext("2d");
    if (!stage || !canvas || !ctx) return;

    var grid = null, stats = null, n = 0, weeks = 0;
    var wk = new Float32Array(0), dy = new Float32Array(0), lv = new Uint8Array(0), hgt = new Float32Array(0);
    var zs = new Float32Array(0), hover = new Float32Array(0), dim = new Float32Array(0);
    var polys = new Float32Array(0), faces = new Uint8Array(0);
    var order = [];

    // Veri setini değiştirir (önce demo, sonra gerçek GitHub verisi gelir).
    function setData(data, endMs) {
      grid = buildGrid(data, endMs, 0);
      stats = computeStats(grid.cells);
      n = grid.cells.length; weeks = grid.weeks;
      wk = new Float32Array(n); dy = new Float32Array(n); lv = new Uint8Array(n); hgt = new Float32Array(n);
      zs = new Float32Array(n); hover = new Float32Array(n); dim = new Float32Array(n);
      polys = new Float32Array(n * 24); faces = new Uint8Array(n);
      order = [];
      for (var i = 0; i < n; i++) {
        order.push(i);
        var c = grid.cells[i];
        wk[i] = c.week; dy[i] = c.day; lv[i] = c.level;
        hgt[i] = barHeight(c.count, grid.max);
      }
      hovered = -1; pinned = -1; activeIdx = -1;
      updateTip();
      relayout(); kick();
    }

    // Gerçek GitHub katkıları (herkese açık veri, tokensız). Olmazsa demo veriyle devam.
    function loadReal() {
      var user = root.getAttribute("data-sky-user") || "akamusti";
      fetch("https://github-contributions-api.jogruber.de/v4/" + encodeURIComponent(user) + "?y=last")
        .then(function (res) { if (!res.ok) throw new Error("http " + res.status); return res.json(); })
        .then(function (json) {
          var list = json && json.contributions;
          if (!list || !list.length) return;
          var data = list.map(function (d) { return { date: d.date, count: +d.count || 0 }; });
          setData(data, dayMs(data[data.length - 1].date));
          retheme();
        })
        .catch(function () { /* demo verisiyle devam */ });
    }

    var t = 0, target = 0, entered = false;
    var yaw = 0, elev = 0, yawGoal = 0, elevGoal = 0;
    var W = 0, H2 = 0, H3 = 0, Hmax = 0, lastH = -1, dpr = 1, gutter = 30, labelW = 30;
    var col = new Float32Array(15), colGoal = new Float32Array(15), colReady = false;
    var fg = [238, 242, 243], bg = [11, 13, 16], isDark = true;
    var hovered = -1, pinned = -1, activeIdx = -1, legendLevel = -1, tipW = 0;
    var raf = 0, last = 0, view = "3d", orbit = true, duration = 1300;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function cssVar(name, fb) {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fb;
    }
    function retheme() {
      var fgc = cssVar("--fg", "#eef2f3"), bgc = cssVar("--bg", "#0b0d10");
      fg = hexRGB(fgc) || fg; bg = hexRGB(bgc) || bg;
      isDark = luminance(bg) < 0.45;
      var pal = resolvePalette(isDark).map(hexRGB);
      var empty = mixRGB(bg, fg, isDark ? 0.11 : 0.075);
      var all = [empty].concat(pal);
      for (var k = 0; k < 5; k++) for (var ch = 0; ch < 3; ch++) colGoal[k * 3 + ch] = all[k][ch];
      if (!colReady || reduced) { col.set(colGoal); colReady = true; }
      updateLegend(); updateStats(stats);
      kick();
    }
    function extent(cam, e, full) {
      var w = lerp(0.78, 0.9, e), off = (1 - w) / 2;
      var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
      function add(x, y, z) {
        var p = project(cam, x, y, z);
        if (p[0] < minx) minx = p[0];
        if (p[0] > maxx) maxx = p[0];
        if (p[1] < miny) miny = p[1];
        if (p[1] > maxy) maxy = p[1];
      }
      for (var q = 0; q < n; q++) {
        var x0 = wk[q] + off, y0 = dy[q] + off;
        var z = full ? hgt[q] * e : zs[q];
        add(x0, y0, z); add(x0 + w, y0, z); add(x0, y0 + w, z);
        add(x0 + w, y0 + w, 0); add(x0, y0 + w, 0); add(x0 + w, y0, 0);
      }
      add(0, 7 + 1.5 * e, 0); add(weeks, 7 + 1.5 * e, 0);
      return { minx: minx, maxx: maxx, miny: miny, maxy: maxy };
    }
    function relayout() {
      var w = Math.round(stage.clientWidth);
      if (!w || !n) return;
      W = w; gutter = W < 520 ? 0 : labelW;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      var b2 = extent(camera(0), 0, true);
      H2 = 20 + 4 + ((b2.maxy - b2.miny) / (b2.maxx - b2.minx)) * (W - gutter - 4);
      var b3 = extent(camera(1), 1, true);
      var natural = ((b3.maxy - b3.miny) / (b3.maxx - b3.minx)) * (W - 40) + 40;
      H3 = Math.max(Math.min(natural, W * 0.72, 620), Math.min(natural, 240));
      Hmax = Math.ceil(Math.max(H2, H3));
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(Hmax * dpr);
      canvas.style.width = W + "px"; canvas.style.height = Hmax + "px";
      lastH = -1; draw();
    }
    function pointInQuad(o, x, y) {
      var sign = 0;
      for (var k = 0; k < 4; k++) {
        var ax = polys[o + k * 2], ay = polys[o + k * 2 + 1];
        var b = (k + 1) % 4;
        var bx = polys[o + b * 2], by = polys[o + b * 2 + 1];
        var cross = (bx - ax) * (y - ay) - (by - ay) * (x - ax);
        if (Math.abs(cross) < 1e-9) continue;
        var s = cross > 0 ? 1 : -1;
        if (sign === 0) sign = s; else if (s !== sign) return false;
      }
      return sign !== 0;
    }
    function quadPath(o, r) {
      if (r < 0.3) {
        ctx.moveTo(polys[o], polys[o + 1]); ctx.lineTo(polys[o + 2], polys[o + 3]);
        ctx.lineTo(polys[o + 4], polys[o + 5]); ctx.lineTo(polys[o + 6], polys[o + 7]);
        ctx.closePath(); return;
      }
      ctx.moveTo((polys[o + 6] + polys[o]) / 2, (polys[o + 7] + polys[o + 1]) / 2);
      for (var k = 0; k < 4; k++) {
        var b = (k + 1) % 4;
        ctx.arcTo(polys[o + k * 2], polys[o + k * 2 + 1], polys[o + b * 2], polys[o + b * 2 + 1], r);
      }
      ctx.closePath();
    }
    function draw() {
      if (!W || !n) return;
      var e = easeInOutCubic(t);
      var cam = camera(e, yaw, elev);
      var Hc = lerp(H2, H3, e);
      if (Math.abs(Hc - lastH) > 0.2) { stage.style.height = Hc.toFixed(1) + "px"; lastH = Hc; }
      for (var i = 0; i < n; i++) zs[i] = riseAt(t, wk[i], weeks, dy[i]) * hgt[i];
      var b = extent(cam, e, false);
      var pad = lerp(2, 20, e);
      var left = pad + gutter * (1 - e), top = pad + 20 * (1 - e);
      var aw = W - left - pad, ah = Hc - top - pad;
      var bw = Math.max(1e-6, b.maxx - b.minx), bh = Math.max(1e-6, b.maxy - b.miny);
      var s = Math.min(aw / bw, ah / bh);
      var ox = left + (aw - bw * s) / 2 - b.minx * s;
      var oy = top + (ah - bh * s) / 2 - b.miny * s;
      function px(x, y) { return ox + (x * cam.cs - y * cam.sn) * s; }
      function py(x, y, z) { return oy + ((x * cam.sn + y * cam.cs) * cam.se - z * cam.ce) * s; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, Hmax);
      order.sort(function (a, c2) { return (wk[a] + 0.5) * cam.sn + (dy[a] + 0.5) * cam.cs - ((wk[c2] + 0.5) * cam.sn + (dy[c2] + 0.5) * cam.cs); });
      var w = lerp(0.78, 0.9, e), off = (1 - w) / 2;
      var radius = lerp(0.17, 0.03, e) * s;
      var lift = 0.7 * e;
      var ex = col[0], ey = col[1], ez = col[2];
      for (var k = 0; k < n; k++) {
        var idx = order[k];
        var x0 = wk[idx] + off, y0 = dy[idx] + off, x1 = x0 + w, y1 = y0 + w;
        var z = zs[idx] + hover[idx] * lift, o = idx * 24;
        polys[o] = px(x0, y0); polys[o + 1] = py(x0, y0, z);
        polys[o + 2] = px(x1, y0); polys[o + 3] = py(x1, y0, z);
        polys[o + 4] = px(x1, y1); polys[o + 5] = py(x1, y1, z);
        polys[o + 6] = px(x0, y1); polys[o + 7] = py(x0, y1, z);
        polys[o + 8] = px(x0, y1); polys[o + 9] = py(x0, y1, 0);
        polys[o + 10] = px(x1, y1); polys[o + 11] = py(x1, y1, 0);
        polys[o + 12] = polys[o + 4]; polys[o + 13] = polys[o + 5];
        polys[o + 14] = polys[o + 6]; polys[o + 15] = polys[o + 7];
        polys[o + 16] = px(x1, y0); polys[o + 17] = py(x1, y0, 0);
        polys[o + 18] = polys[o + 10]; polys[o + 19] = polys[o + 11];
        polys[o + 20] = polys[o + 4]; polys[o + 21] = polys[o + 5];
        polys[o + 22] = polys[o + 2]; polys[o + 23] = polys[o + 3];
        var tall = z * cam.ce * s, f = 0;
        if (tall > 0.35 && w * cam.cs * s > 0.35) f |= 1;
        if (tall > 0.35 && w * cam.sn * s > 0.35) f |= 2;
        faces[idx] = f;
        var L = lv[idx] * 3, r = col[L], g = col[L + 1], bl = col[L + 2];
        var dd = dim[idx];
        if (dd > 0.002) { r += (ex - r) * 0.72 * dd; g += (ey - g) * 0.72 * dd; bl += (ez - bl) * 0.72 * dd; }
        var hv = hover[idx];
        if (hv > 0.002) { var mm = 0.16 * hv; r += (fg[0] - r) * mm; g += (fg[1] - g) * mm; bl += (fg[2] - bl) * mm; }
        if (f & 1) { ctx.beginPath(); quadPath(o + 8, 0); ctx.fillStyle = rgbStr(r * 0.84, g * 0.84, bl * 0.84); ctx.fill(); }
        if (f & 2) { ctx.beginPath(); quadPath(o + 16, 0); ctx.fillStyle = rgbStr(r * 0.68, g * 0.68, bl * 0.68); ctx.fill(); }
        ctx.beginPath(); quadPath(o, radius);
        ctx.fillStyle = rgbStr(r, g, bl); ctx.fill();
        if (hv > 0.02) { ctx.strokeStyle = "rgba(" + fg[0] + "," + fg[1] + "," + fg[2] + "," + (0.85 * hv).toFixed(3) + ")"; ctx.lineWidth = 1.5; ctx.stroke(); }
      }
      if (activeIdx >= 0 && activeIdx < n) {
        var ai = activeIdx;
        var zz = zs[ai] + hover[ai] * lift;
        var tx = px(wk[ai] + 0.5, dy[ai] + 0.5);
        var ty = Math.min(py(wk[ai] + off, dy[ai] + off, zz), py(wk[ai] + off + w, dy[ai] + off, zz));
        var half = tipW / 2;
        var cx = Math.min(W - half - 2, Math.max(half + 2, tx));
        tip.style.transform = "translate(" + (cx - half).toFixed(1) + "px," + (ty - 8).toFixed(1) + "px) translateY(-100%)";
      }
    }
    function tick(now) {
      raf = 0;
      var dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
      var moving = false, i, k;
      if (t !== target) {
        var step = reduced ? 1 : (dt * 1000) / Math.max(1, duration);
        t = target > t ? Math.min(target, t + step) : Math.max(target, t - step);
        moving = true;
      }
      var ko = reduced ? 1 : 1 - Math.exp(-dt * 12);
      yaw += (yawGoal - yaw) * ko; elev += (elevGoal - elev) * ko;
      if (Math.abs(yawGoal - yaw) > 1e-4 || Math.abs(elevGoal - elev) > 1e-4) moving = true;
      else { yaw = yawGoal; elev = elevGoal; }
      var kc = reduced ? 1 : 1 - Math.exp(-dt * 7);
      for (k = 0; k < 15; k++) {
        var d = colGoal[k] - col[k];
        if (Math.abs(d) > 0.4) { col[k] += d * kc; moving = true; } else col[k] = colGoal[k];
      }
      var kh = reduced ? 1 : 1 - Math.exp(-dt * 16);
      var kd = reduced ? 1 : 1 - Math.exp(-dt * 10);
      for (i = 0; i < n; i++) {
        var hg = i === activeIdx ? 1 : 0;
        var dg = legendLevel >= 0 && lv[i] !== legendLevel ? 1 : 0;
        if (hover[i] !== hg) { hover[i] = Math.abs(hg - hover[i]) < 0.003 ? hg : hover[i] + (hg - hover[i]) * kh; moving = true; }
        if (dim[i] !== dg) { dim[i] = Math.abs(dg - dim[i]) < 0.003 ? dg : dim[i] + (dg - dim[i]) * kd; moving = true; }
      }
      draw();
      if (moving) raf = requestAnimationFrame(tick);
    }
    function kick() { if (raf) return; last = performance.now(); raf = requestAnimationFrame(tick); }
    function refreshActive() {
      var next = hovered >= 0 ? hovered : pinned;
      if (next === activeIdx) return;
      activeIdx = next; updateTip(); kick();
    }
    function hit(x, y) {
      for (var k = n - 1; k >= 0; k--) {
        var i = order[k], o = i * 24;
        if (pointInQuad(o, x, y)) return i;
        if ((faces[i] & 1) && pointInQuad(o + 8, x, y)) return i;
        if ((faces[i] & 2) && pointInQuad(o + 16, x, y)) return i;
      }
      return -1;
    }
    function local(ev) { var r = canvas.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; }
    function fmtDay(ds) {
      try {
        return new Intl.DateTimeFormat(document.documentElement.lang === "en" ? "en-US" : "tr-TR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(dayMs(ds));
      } catch (e) { return ds; }
    }
    function updateTip() {
      if (activeIdx >= 0 && grid && grid.cells[activeIdx]) {
        var cc = grid.cells[activeIdx];
        tip.innerHTML = "<strong>" + (cc.count ? cc.count : "0") + "</strong><span> · " + fmtDay(cc.date) + "</span>";
        tip.style.opacity = "1"; tipW = tip.offsetWidth || 120;
      } else tip.style.opacity = "0";
    }
    function updateStats(st) {
      var el = root.querySelector("[data-sky-total]");
      if (el) el.textContent = st.total;
      var b = root.querySelector("[data-sky-busiest]");
      if (b) b.textContent = st.busiest.count;
      var l = root.querySelector("[data-sky-longest]");
      if (l) l.textContent = st.longest.days;
      var cu = root.querySelector("[data-sky-current]");
      if (cu) cu.textContent = st.current.days;
      var acc = rgbStr(colGoal[12], colGoal[13], colGoal[14]);
      root.querySelectorAll("[data-sky-accent]").forEach(function (e2) { e2.style.color = acc; });
    }
    function updateLegend() {
      var sw = root.querySelectorAll("[data-sky-sw]");
      var cols = [rgbStr(colGoal[0], colGoal[1], colGoal[2]), rgbStr(colGoal[3], colGoal[4], colGoal[5]), rgbStr(colGoal[6], colGoal[7], colGoal[8]), rgbStr(colGoal[9], colGoal[10], colGoal[11]), rgbStr(colGoal[12], colGoal[13], colGoal[14])];
      for (var i = 0; i < sw.length && i < cols.length; i++) sw[i].style.background = cols[i];
    }

    var drag = null;
    canvas.addEventListener("pointerdown", function (ev) {
      if (ev.button !== 0) return;
      drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, yaw: yawGoal, elev: elevGoal, moved: false, mouse: ev.pointerType === "mouse" };
    });
    canvas.addEventListener("pointermove", function (ev) {
      if (drag && ev.pointerId === drag.id && target === 1 && orbit) {
        var dx = ev.clientX - drag.x, dyy = ev.clientY - drag.y;
        if (drag.moved || Math.hypot(dx, dyy) > 4) {
          drag.moved = true;
          yawGoal = Math.min((82 * Math.PI) / 180 - YAW_3D, Math.max((8 * Math.PI) / 180 - YAW_3D, drag.yaw + dx * 0.006));
          if (drag.mouse) elevGoal = Math.min((62 * Math.PI) / 180 - ELEV_3D, Math.max((18 * Math.PI) / 180 - ELEV_3D, drag.elev + dyy * 0.004));
          hovered = -1; refreshActive(); kick(); return;
        }
      }
      if (ev.pointerType !== "mouse") return;
      var p = local(ev), i = hit(p[0], p[1]);
      if (i !== hovered) { hovered = i; refreshActive(); }
    });
    canvas.addEventListener("pointerup", function (ev) {
      if (!drag || ev.pointerId !== drag.id) return;
      var wasMoved = drag.moved; drag = null;
      if (wasMoved) return;
      var p = local(ev), i = hit(p[0], p[1]);
      pinned = i === pinned ? -1 : i;
      if (ev.pointerType !== "mouse") hovered = -1;
      refreshActive();
    });
    canvas.addEventListener("pointerleave", function () { if (!drag) { hovered = -1; refreshActive(); } });
    canvas.addEventListener("dblclick", function () { yawGoal = 0; elevGoal = 0; kick(); });

    root.querySelectorAll("[data-sky-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        view = btn.getAttribute("data-sky-view");
        target = view === "3d" ? 1 : 0;
        if (target === 0) { yawGoal = 0; elevGoal = 0; }
        root.querySelectorAll("[data-sky-view]").forEach(function (b2) { b2.setAttribute("aria-pressed", b2 === btn ? "true" : "false"); });
        kick();
      });
    });
    root.querySelectorAll("[data-sky-sw]").forEach(function (sw) {
      function set(v) { legendLevel = v; kick(); }
      sw.addEventListener("mouseenter", function () { set(+sw.getAttribute("data-sky-sw")); });
      sw.addEventListener("focus", function () { set(+sw.getAttribute("data-sky-sw")); });
      sw.addEventListener("mouseleave", function () { set(-1); });
      sw.addEventListener("blur", function () { set(-1); });
      sw.addEventListener("click", function () {
        var v = +sw.getAttribute("data-sky-sw");
        set(legendLevel === v ? -1 : v);
      });
    });

    var bootEnd = dayMs(new Date());
    setData(generateContributions(bootEnd, 7), bootEnd);
    retheme(); relayout();
    loadReal();
    var io = null;
    function enter() { if (entered) return; entered = true; if (reduced) t = target; target = view === "3d" ? 1 : 0; kick(); }
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(function (es) {
        if (es.some(function (en) { return en.isIntersecting; })) { enter(); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(stage);
    } else enter();
    new ResizeObserver(function () { if (Math.round(stage.clientWidth) !== W) relayout(); }).observe(stage);
    new MutationObserver(retheme).observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    document.addEventListener("akamusti:lang", updateTip);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { document.querySelectorAll("[data-skyline]").forEach(init); });
  else document.querySelectorAll("[data-skyline]").forEach(init);
})();

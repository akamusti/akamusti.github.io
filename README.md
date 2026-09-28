# akaMusti

[🇬🇧 English version](README.en.md)

Kişisel sitem: [akamusti.github.io](https://akamusti.github.io)

Sade, hızlı ve bağımlılıksız — Jekyll + GitHub Pages üzerinde çalışan tek kişilik kişisel site.

## Özellikler

- **Ana sayfa:** typewriter bio, öne çıkan projeler, hakkımda, sosyal linkler
- **Müzik çalar:** sağ altta açılan popup, oynat / durdur, ses seviyesi, ilerleme çubuğu, çarpıyla kapatma + mini butonla geri açma (tercih `localStorage`'da saklanır)
- **Günlük (blog):** Jekyll posts (`_posts/`), RSS (`blog/feed.xml`)
- **Defter:** utterances (GitHub Issues) tabanlı ziyaretçi defteri
- **Projeler:** öne çıkan işlerin listelendiği sayfa
- **Tema:** birden fazla renk teması, `T` kısayoluyla değiştirme, tercih saklanır
- **Dil:** TR / EN desteği (`assets/lang.js` sözlüğü üzerinden), tercih saklanır

## Dosya yapısı

```
index.html              → ana sayfa (tek dosyalık)
_layouts/default.html   → blog / defter / projeler / gizlilik iskeleti
_layouts/post.html      → blog yazı iskeleti
_posts/                 → günlük yazıları (markdown)
blog/ defter/ projeler/ gizlilik/ → alt sayfalar
assets/                 → theme.js, lang.js, themes.css, salvatore.mp3
img/                    → avatar, kapak ve disk görselleri
```

## Kendine göre ayarlama

- **İsim / bio:** `index.html` içindeki `<h1>` ve `home.bio` metni (`assets/lang.js`)
- **Projeler:** `index.html` içindeki `.row` blokları + `PROJ` sözlüğü (`assets/lang.js`)
- **Sosyal linkler:** `index.html` içindeki `.soc` blokları
- **Müzik:** `assets/salvatore.mp3` dosyasını değiştir, `.title` / `.artist` yazılarını güncelle
- **Avatar / görseller:** `img/` klasöründeki dosyaları değiştir
- **Tema renkleri:** `assets/themes.css` + `assets/theme.js`
- **Çeviriler:** `assets/lang.js` içindeki `STR` sözlüğü

## Yerelde çalıştırma

```bash
# ana sayfa için herhangi bir statik sunucu yeterli
python3 -m http.server 8000

# blog (Jekyll) için
bundle install
bundle exec jekyll serve
```

Pushladığında GitHub Pages otomatik yayınlar.

# akaMusti

[English](README.en.md) · [Siteyi ziyaret et](https://akamusti.github.io)

Kişisel sitem; projelerimi, yazılarımı ve internetteki hesaplarımı bir araya getiren sade bir köşe. Jekyll ile oluşturulur ve GitHub Pages üzerinde yayınlanır.

## Sitede

- **Projeler** — üzerinde çalıştığım işler ve kaynak kodları
- **Hesaplar** — GitHub, X, Kick, Letterboxd, Serializd, IMDb, AniList, MyAnimeList, Pinterest, RankOne ve Spotify profillerim
- **Günlük** — Markdown yazıları, RSS akışı, okuma süresi ve yazı paylaşımı
- **Defter** — GitHub Issues üzerinden çalışan ziyaretçi defteri
- **TR / EN** — dil tercihi tarayıcıda saklanır
- **Erişilebilirlik** — klavye ile gezinme, içeriğe atlama bağlantısı ve azaltılmış hareket desteği

Tasarım bilerek sakin tutuldu: içerik önde, gereksiz hareket ve dikkat dağıtıcı öğeler yok.

## Proje yapısı

```text
index.html              Ana sayfa
hesaplar/index.html     Sosyal ve platform hesapları
projeler/index.html     Proje listesi
blog/index.html         Yazı arşivi ve RSS
defter/index.html       Ziyaretçi defteri
gizlilik/index.html     Gizlilik açıklaması
404.html                Bulunamayan sayfa
_layouts/               Jekyll sayfa ve yazı şablonları
_posts/                 Markdown günlük yazıları
assets/                 CSS, JavaScript ve medya dosyaları
img/                    Site görselleri
```

## Yerelde çalıştırma

Jekyll ve gerekli eklentiler kuruluysa:

```bash
jekyll serve
```

Ardından `http://localhost:4000` adresini aç. Yalnızca HTML/CSS görünümüne bakmak için:

```bash
python3 -m http.server 8000
```

Bu yöntem Jekyll şablonlarını veya günlük yazılarını derlemez. `main` dalına gönderilen değişiklikler GitHub Pages tarafından yayınlanır.

## İçeriği güncelleme

- Hesap bağlantıları ve görünen kullanıcı adları: `hesaplar/index.html`
- Projeler: `projeler/index.html`
- Yeni yazı: `_posts/` içine `YYYY-AA-GG-baslik.md` biçiminde dosya ekle
- TR / EN metinleri: `assets/lang.js`
- Ana sayfa ve iç sayfa stilleri: `assets/home.css`, `assets/site.css`
- Tema renkleri: `assets/themes.css`

Sitede analitik, reklam veya ziyaretçi takibi kullanılmaz. Defter, yorumları yayınlamak için GitHub Issues hizmetine bağlanır.

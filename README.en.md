# akaMusti

[Türkçe](README.md) · [Visit the site](https://akamusti.github.io)

My personal corner of the internet: a simple home for my projects, writing, and accounts across other platforms. Built with Jekyll and published on GitHub Pages.

## What's here

- **Projects** — things I'm working on and their source code
- **Accounts** — my profiles on GitHub, X, Kick, Letterboxd, Serializd, IMDb, AniList, MyAnimeList, Pinterest, RankOne, and Spotify
- **Journal** — Markdown posts, an RSS feed, reading times, and post sharing
- **Guestbook** — a visitor book powered by GitHub Issues
- **TR / EN** — language preference is stored in the browser
- **Accessibility** — keyboard navigation, a skip link, and reduced-motion support

The design is intentionally quiet: content first, with no unnecessary motion or distractions.

## Project structure

```text
index.html              Homepage
hesaplar/index.html     Social and platform accounts
projeler/index.html     Project list
blog/index.html         Post archive and RSS
defter/index.html       Guestbook
gizlilik/index.html     Privacy information
404.html                Not-found page
_layouts/               Jekyll page and post layouts
_posts/                 Markdown journal posts
assets/                 CSS, JavaScript, and media
img/                    Site images
```

## Run locally

With Jekyll and its required plugins installed:

```bash
jekyll serve
```

Then open `http://localhost:4000`. To preview only the HTML and CSS:

```bash
python3 -m http.server 8000
```

This does not render Jekyll templates or journal posts. Changes pushed to `main` are published by GitHub Pages.

## Updating content

- Account links and displayed usernames: `hesaplar/index.html`
- Projects: `projeler/index.html`
- New post: add a `YYYY-MM-DD-title.md` file to `_posts/`
- TR / EN text: `assets/lang.js`
- Homepage and inner-page styles: `assets/home.css`, `assets/site.css`
- Theme colors: `assets/themes.css`

The site uses no analytics, ads, or visitor tracking. The guestbook connects to GitHub Issues to publish comments.

# akaMusti

[🇹🇷 Türkçe sürüm](README.md)

Source code of my personal site: [akamusti.github.io](https://akamusti.github.io)

Simple, fast and dependency-free — a one-person personal site running on Jekyll + GitHub Pages.

## Features

- **Homepage:** bio, featured projects, about, social links
- **Music player:** bottom-right popup with play / pause, volume, seek bar, close via ✕ + reopen via mini button (preference stored in `localStorage`)
- **Journal (blog):** Jekyll posts (`_posts/`), RSS (`blog/feed.xml`), reading time, tags, previous/next post navigation, copy / share link
- **Guestbook:** utterances (GitHub Issues) based guestbook
- **Projects:** page listing featured work
- **Themes:** multiple color themes, switch with the `T` shortcut, preference is saved
- **Language:** TR / EN support (via the `assets/lang.js` dictionary), preference is saved
- **Accessibility:** "skip to content" link for keyboard users, `aria-*` labels, `prefers-reduced-motion` support
- **SEO / sharing:** `og:` + `twitter:` tags, `canonical`, RSS discovery link, `application/ld+json` structured data, automatic `sitemap.xml` (`jekyll-sitemap`), `robots.txt`
- **Share image:** `img/og.png` (1200x630) — used in social previews
- **404:** custom not-found page styled like the rest of the site

## File structure

```
index.html              → homepage (single file)
404.html                → custom 404 page
robots.txt              → crawler rules
_layouts/default.html   → layout for blog / guestbook / projects / privacy
_layouts/post.html      → blog post layout
_posts/                 → journal posts (markdown)
blog/ defter/ projeler/ gizlilik/ → subpages
assets/                 → theme.js, lang.js, themes.css, salvatore.mp3
img/                    → avatar, cover, disc and og (share) images
```

## Customization

- **Name / bio:** `<h1>` and the `home.bio` string in `index.html` (`assets/lang.js`)
- **Projects:** `.row` blocks in `index.html` + the `PROJ` dictionary (`assets/lang.js`)
- **Social links:** `.soc` blocks in `index.html`
- **Music:** replace `assets/salvatore.mp3`, update the `.title` / `.artist` texts
- **Avatar / images:** replace files in the `img/` folder
- **Theme colors:** `assets/themes.css` + `assets/theme.js`
- **Translations:** the `STR` dictionary in `assets/lang.js`
- **Post tags:** add `tags: [blog, personal]` to a `_posts/` file's front matter

## Run locally

```bash
# any static server is enough for the homepage
python3 -m http.server 8000

# for the blog (Jekyll)
bundle install
bundle exec jekyll serve
```

Pushing to `main` deploys automatically via GitHub Pages.

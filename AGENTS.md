# AGENTS.md — akaMusti sitesi çalışma kuralları

## Proje
Statik Jekyll sitesi (GitHub Pages). React / shadcn / Tailwind / build adımı yok.
Bağımlılıksız vanilla HTML + CSS + JS yaz. Yeni bölüm eklersen `index.html`,
`assets/*.css`, `assets/*.js` ve `assets/lang.js` içindeki TR/EN sözlüğü birlikte güncellenir.

## Site kuralları
- Tema değişkenlerini kullan (`--bg`, `--fg`, `--muted`, `--accent`, `--card`, `--stroke`).
  Sabit renk gömme; `[data-theme]` değişimini `MutationObserver` ile izle.
- TR/EN desteği zorunlu: görünen her metne `data-i18n` + `assets/lang.js` karşılığı ekle.
- `prefers-reduced-motion` desteğini koru.
- Gizlilik: takip, analitik, reklam, harici veri gönderimi yok. Kalıcı bilgi yalnızca
  `localStorage` içinde (tema, dil, oynatıcı tercihi).
- Harici veri (ör. GitHub katkıları) gerekiyorsa tokensız, herkese açık uç kullan;
  başarısız olursa sayfa kırılmadan yedek içerikle devam et.
- Erişilebilirlik: etkileşimli öğelere `aria-label`, canvas'a `role="img"` + açıklama ekle;
  klavye ile kullanılamayan bileşen ekleme.
- Performans: `<script>`lere `defer` koy, görsellere `width/height` + `loading="lazy"`
  (kritik olanlara `fetchpriority="high"`) ver, yeni font/kütüphane eklemeden önce sor.

## Kod kalitesi
- Commit'ten önce JS dosyalarına `node --check` çalıştır.
- Üçüncü parti servise gömülü kullanıcı adı/token değişirse tek yerden değişsin
  (`data-*` özniteliği gibi); değeri JS/HTML içine sabit gömme.
- Gizli bilgi bir kez bile commit'lendiyse geçmişten temizlenmeden iş bitmiş sayılmaz
  (`git rm --cached` + geçmiş temizliği + token'ı iptal et).
- `.gitignore` içinde `.env` olduğundan emin ol; örnek değerler için `.env.example` bırak.
- Büyük medya (`*.mp3`, `*.jpg`) eklerken dosya boyutunu küçük tut; gereksiz yere
  yeniden kodlama/kopyalama yapma.

## Kullanıcıyla iletişim
- Kullanıcıyla her zaman Türkçe konuş.
- Kısa ve net yaz, gereksiz övgü/superlatif yok.

## Her kod bitiminde zorunlu akış
1. **Gizli bilgi taraması:** biten kodda token, API anahtarı, parola/secret,
   kişisel bilgi (e-posta, telefon, adres, gerçek kullanıcı adı vb.) var mı diye kontrol et
   (`grep -rniE 'api[_-]?key|secret|bearer|ghp_|sk-|password|private[_-]?key'` vb.).
2. **Varsa ayıkla:** gizli değeri koda gömme; `.env` (veya uygun env/config) dosyasına taşı,
   kodu env'den okuyacak şekilde düzenle, `.env`'i repoya commit'leme
   (`.gitignore` içinde olduğundan emin ol) ve `.env.example` bırak.
3. **Yoksa:** `.env` oluşturma, bunu raporda belirt.
4. **GitHub:** değişikliği İngilizce commit mesajıyla commit'le ve `git push` ile gönder.
   Kullanıcı aksini söylemedikçe onay beklemeden push'la.

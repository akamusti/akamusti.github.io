# akaMusti

guns.lol tarzı tek sayfalık profil sitem. ortada avatar + isim, altında yan yana sosyal ikonlar, bir de müzik çalar var.

## kendine göre ayarlama

hepsi `index.html` içinde, korkulacak bir şey yok:

- **isim / bio:** `<h1>` ile `.handle` kısmını ve `const text = ...` satırındaki yazıyı değiştir.
- **profil fotoğrafı:** `img/pfp.jpg` dosyasını kendi fotoğrafınla değiştir (üstüne yaz yeterli).
- **arka plan:** `img/wallpaper.jpg` dosyasını sevdiğin bir görselle değiştir.
- **linkler:** `.links` içindeki `<a class="link-btn" ...>` satırlarını kopyala/yapıştır, `href` ve `title` kısmını güncelle. ikon lazım olursa svg'yi değiştirmen yeterli.
- **müzik:** `assets/salvatore.mp3` dosyasını kendi mp3'ünle değiştir, `.title` ve `.artist` yazılarını güncellemeyi unutma.

bitti, pushla ve github pages'ten yayınlansın.

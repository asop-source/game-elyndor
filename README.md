# Elyndor

Game petualangan fantasi Nusantara untuk HP: pilih elemen (Api, Air, Udara, Tanah), jelajahi 6 wilayah termasuk **Desa Angker**
(tuyul, pocong, kuntilanak, genderuwo), lawan naga Vaelgorn, dan main bersama pemain lain.
Tanpa framework dan tanpa file audio/gambar: semua digambar dan dibunyikan lewat kode (Canvas + Web Audio).

## Isi folder
```
www/                 <- seluruh game (ini yang dipasang ke APK)
  index.html         halaman utama
  style.css          tampilan
  game.js            logika game (±1800 baris, lihat "Peta kode")
  claude-shim.js     database lokal + presence antar-tab (pengganti backend Claude)
  manifest.webmanifest, sw.js, icons/   supaya bisa dipasang sebagai PWA
docs/DESAIN.md       tabel zona, monster, skill, quest, rumus (dibuat dari kode)
docs/BACKEND.md      kontrak backend untuk multiplayer online
backend-examples/    kerangka adapter Supabase (belum diuji)
package.json, capacitor.config.json   untuk membuat APK Android
CLAUDE.md            panduan singkat untuk AI agent/pengembang berikutnya
```

## 1. Jalankan di komputer
Butuh salah satu: Python atau Node.
```bash
cd www && python3 -m http.server 8080     # atau: npm start
```
Buka http://localhost:8080. Progress tersimpan di browser (localStorage). Buka dua tab untuk melihat dua pemain saling terlihat.
Font Google dimuat dari internet; kalau offline game tetap jalan dengan font cadangan.

## 2. Pasang sebagai aplikasi tanpa APK (PWA)
Taruh folder `www` di hosting statis HTTPS (GitHub Pages, Netlify, Cloudflare Pages, dll). Buka di Chrome Android, lalu menu ⋮ → **Tambahkan ke layar utama**.
Aplikasi berjalan layar penuh, mendatar, dan bisa offline.

## 3. Buat APK Android (Capacitor)
Butuh: Node 18+, JDK 17, Android Studio (atau Android SDK).
```bash
npm install
npx cap add android          # membuat folder android/
npx cap sync android         # menyalin www/ ke aplikasi
```
Kunci layar ke mendatar: buka `android/app/src/main/AndroidManifest.xml`, pada tag `<activity ...>` tambahkan
`android:screenOrientation="sensorLandscape"`.
Lalu bangun APK:
```bash
npm run apk                  # hasil: android/app/build/outputs/apk/debug/app-debug.apk
```
atau `npx cap open android` lalu **Build → Build APK(s)** di Android Studio. Untuk Play Store, buat rilis bertanda tangan (AAB) dari Android Studio.
Ganti `appId` di `capacitor.config.json` dengan ID milikmu sebelum rilis.

## 4. Multiplayer online
Mode mandiri hanya menyimpan data di perangkat. Supaya banyak orang bermain bersama, buat adapter backend
(Firebase/Supabase/server sendiri) dan muat menggantikan `claude-shim.js`. Kontraknya ada di `docs/BACKEND.md`.
Baca juga catatan keamanan di sana (perhitungan game ada di klien, nama tanpa password).

## Peta kode (`www/game.js`)
| Bagian | Isi |
|---|---|
| DATA | zona, monster, elemen, skill, quest, dialog |
| STATE + layout | variabel global, rotasi mendatar (`applyLayout`) |
| AUDIO | sintesis musik per zona (`ZMUS`) dan efek suara (`SFX`) |
| ZONE BUILD | pembuatan peta, dekorasi, latar |
| LOGIN / START | login nama, pilih elemen, mulai game |
| NETWORK | simpan data, presence |
| CONTROLS / COMBAT | input, serangan, skill, monster |
| UPDATE / DRAW | loop game dan semua gambar (karakter, monster, efek) |
| HUD / SHEETS / NPC DIALOG | antarmuka, menu, dialog |

## Catatan
- Versi yang berjalan di dalam Claude (artifact) dan proyek ini adalah salinan terpisah; perubahan tidak tersinkron otomatis.
- Keyboard HP selalu tegak. Karena itu layar login dan input teks sementara tampil tegak walau game mendatar.

# Panduan untuk AI agent (Claude Code, dll)

Proyek: **Elyndor**, game 2D tampak atas berbasis web (Canvas + Web Audio), tanpa build step. Bahasa UI: Indonesia.

## Aturan kerja
- Semua kode game ada di `www/game.js` (satu IIFE, JavaScript gaya ES5: `var`, `function`). Pertahankan gaya itu.
- Jangan menambah dependensi/framework kecuali diminta. Tidak ada file gambar/audio: semua digambar/disintesis lewat kode.
- Data konten (zona, monster, skill, quest) ada di bagian `DATA` paling atas `game.js`. Menambah konten biasanya cukup edit data + fungsi gambar.
- Backend hanya lewat `window.claude.use('db'|'room')`. Kontrak di `docs/BACKEND.md`. Jangan panggil layanan lain langsung dari game.js.
- Setelah mengubah `game.js`: jalankan `node --check www/game.js`, buka lewat `npm start`, uji di viewport HP (mendatar), dan pastikan tidak ada error di konsol.
- Naikkan `VERSION` di `www/sw.js` setiap rilis supaya cache PWA diperbarui.
- Simpan format data pemain kompatibel ke belakang (lihat `loadPlayer()` yang menormalkan data lama).

## Menambah monster baru (contoh alur)
1. Tambah entri di `MON` (hp, atk, spd, xp, coin, r, aggro, acd; opsi: `hop`, `fly`, `steal`, `wail`).
2. Tambah cabang gambar di `drawMonster()` dan warna di `monColor()`.
3. Tambah ke `spawns` sebuah zona di `ZONES`.
4. (Opsional) suara sapaan di `monAggro()`.

## Ide lanjutan
Backend online nyata + login, server memvalidasi damage/koin, lebih banyak zona dan boss, party/chat, pengaturan volume, penyimpanan cloud.

# Desain Game Elyndor

Dokumen ini dibuat otomatis dari data di `www/game.js` (bagian DATA), jadi angkanya sesuai game.

## Ringkasan
Game petualangan fantasi 2D tampak atas, dimainkan di HP (layar mendatar). Pemain memilih satu elemen, menjelajah 6 wilayah, melawan monster secara real-time, mengumpulkan koin untuk memperkuat skill, dan menamatkan quest sampai melawan naga Vaelgorn. Pemain lain terlihat bergerak di dunia yang sama (multiplayer, lewat backend).

## Zona
| Zona | Min Lv | Ukuran | Monster | NPC | Terhubung ke |
|---|---|---|---|---|---|
| Desa Awal | 1 | 1300×1000 | - | Penyihir Ilra, Pedagang Bram | Hutan Bisikan, Desa Angker |
| Hutan Bisikan | 1 | 1700×1300 | Slime×8, Serigala×5 | Pemburu Toran | Desa Awal, Reruntuhan Kastil |
| Reruntuhan Kastil | 4 | 1700×1300 | Tengkorak×7, Kelelawar×5 | Penyihir Maren | Hutan Bisikan, Gua Kristal |
| Gua Kristal | 7 | 1700×1300 | Laba-laba kristal×6, Golem kristal×4 | Penyihir Sael | Reruntuhan Kastil, Sarang Vaelgorn |
| Sarang Vaelgorn | 10 | 1500×1100 | Vaelgorn×1 | - | Gua Kristal |
| Desa Angker | 5 | 1700×1300 | Tuyul×7, Pocong×6, Kuntilanak×4, Genderuwo×2 | Mbah Darmo | Desa Awal |

## Monster
| Monster | HP | Serangan | Kecepatan | XP | Koin | Catatan |
|---|---|---|---|---|---|---|
| Slime | 22 | 4 | 0.9 | 7 | 3 |  |
| Serigala | 40 | 6 | 1.7 | 12 | 5 |  |
| Tengkorak | 75 | 11 | 1.3 | 22 | 9 |  |
| Kelelawar | 45 | 8 | 2.1 | 16 | 7 | terbang |
| Laba-laba kristal | 110 | 15 | 1.9 | 32 | 13 |  |
| Golem kristal | 220 | 22 | 0.85 | 55 | 22 | lambat, sangat tebal |
| Tuyul | 55 | 9 | 2 | 20 | 8 | mencuri koin saat berhasil memukul; koin kembali saat dikalahkan |
| Pocong | 120 | 15 | 1.1 | 36 | 12 | bergerak dengan melompat |
| Kuntilanak | 95 | 17 | 1.5 | 44 | 16 | melayang, menjerit membuat lingkaran serangan di tanah |
| Genderuwo | 320 | 27 | 0.9 | 95 | 38 |  |
| Vaelgorn | 2400 | 30 | 1.1 | 900 | 300 | boss, semburan api area |

## Elemen (Skill Utama)
Setiap karakter memilih satu elemen saat dibuat. Skill utama punya 3 level (naik lewat koin). Rumus biaya naik level: `40 + level × 40`.

| Elemen | Skill | Deskripsi | Cooldown (Lv1/2/3, detik) |
|---|---|---|---|
| 🔥 Api | Bola Api | Bola api melesat ke musuh terdekat lalu meledak, membakar tanah di sekitarnya. | 4 / 3.5 / 3 |
| 💧 Air | Gelombang Air | Gelombang air menghantam ke depan, mendorong dan melukai semua musuh di jalurnya. | 5 / 4 / 3.2 |
| 🌪️ Udara | Puting Beliung | Angin puyuh menyedot musuh di sekitarmu lalu menghempaskan mereka menjauh. | 6 / 5 / 4 |
| 🪨 Tanah | Duri Bumi | Duri batu menusuk keluar dari tanah, menjalar lurus ke arah musuh. | 5 / 4.2 / 3.4 |

## Skill Pendukung
Pasang sampai 2 di tombol kecil. Biaya naik level: `base + level × base`.

| Skill | Buka di Lv | Base biaya | Deskripsi | Cooldown |
|---|---|---|---|---|
| 🌀 Tebasan puyuh | 1 | 25 | Pedang berputar dua kali, menebas semua musuh di sekelilingmu. | 6 / 5 / 4 |
| 💨 Terjangan kilat | 3 | 35 | Melesat ke depan meninggalkan bayangan, menebas musuh yang dilewati. Kebal saat melesat. | 5 / 4 / 3 |
| 🛡️ Perisai cahaya | 4 | 50 | Kubah cahaya berputar yang menyerap damage selama 5 detik. | 14 / 12 / 10 |
| ⚡ Petir langit | 5 | 60 | Petir menyambar 3 / 4 / 5 musuh terdekat sekaligus. | 8 / 7 / 6 |
| ☄️ Hujan meteor | 8 | 120 | Meteor raksasa jatuh dari langit dan meledakkan area luas. | 18 / 15 / 12 |

## Latihan Tubuh (skill pasif)
| Skill | Efek | Maks level | Base biaya |
|---|---|---|---|
| 🗡️ Tebasan tajam | +4 serangan per level | 5 | 20 |
| ❤️ Jantung baja | +25 HP maksimum per level | 5 | 20 |
| 👟 Kaki ringan | +8% kecepatan gerak per level | 3 | 30 |
| 🎯 Mata elang | +7% peluang serangan kritikal | 3 | 35 |
| 🌿 Regenerasi | Memulihkan HP perlahan saat bertualang | 3 | 35 |

## Rumus
- Serangan = `10 + (Lv-1)×3 + Tebasan tajam×4`
- HP maks = `60 + (Lv-1)×14 + Jantung baja×25`
- Kecepatan = `2.6 × (1 + 0.08 × Kaki ringan)`
- Peluang kritikal = `5% + 7% × Mata elang`
- XP untuk naik level = `30 × Lv^1.45`
- Kalah: kehilangan 10% koin, kembali ke Desa Awal.

## Quest Utama
| # | Judul | Pemberi | Tujuan | Hadiah |
|---|---|---|---|---|
| 1 | Lendir di hutan | ilra | Slime ×5 | 30 koin, 40 xp |
| 2 | Taring di kegelapan | toran | Serigala ×4 | 45 koin, 70 xp |
| 3 | Suara dari reruntuhan | toran | Bicara dengan NPC maren | 25 koin, 50 xp |
| 4 | Tulang yang bangkit | maren | Tengkorak ×6 | 80 koin, 160 xp |
| 5 | Cahaya di bawah tanah | maren | Bicara dengan NPC sael | 40 koin, 100 xp |
| 6 | Jantung kristal | sael | Golem kristal ×3 | 140 koin, 320 xp |
| 7 | Sang naga purba | sael | Vaelgorn ×1 | 600 koin, 1200 xp |

## Quest Sampingan (Desa Angker, Mbah Darmo)
| # | Judul | Tujuan | Hadiah |
|---|---|---|---|
| 1 | Tuyul pencuri | Tuyul ×6 | 90 koin, 140 xp |
| 2 | Pocong yang tersesat | Pocong ×5 | 130 koin, 220 xp |
| 3 | Tawa di tengah malam | Kuntilanak ×4 | 180 koin, 300 xp |
| 4 | Penunggu beringin | Genderuwo ×2 | 320 koin, 520 xp |

## Kontrol
- **Sentuh:** geser di setengah kiri layar = joystick. Tombol 🗡️ = serang (berubah jadi 💬 saat dekat NPC). Tombol berwarna = skill utama. Dua tombol kecil = skill pendukung. 🧪 = ramuan.
- **Keyboard:** WASD/panah = gerak, Spasi/J = serang, K atau 1 = skill utama, 2 dan 3 = skill pendukung, H = ramuan.
- Menu kanan/atas: Skill, Quest, Peta, Top (peringkat), Online, Emote, Bot, Pengaturan.

## Tampilan mendatar
Kalau layar perangkat terkunci tegak, `applyLayout()` di game.js memutar seluruh tampilan 90°. Layar login dan saat mengetik tetap tegak supaya keyboard normal. Di APK/PWA yang sudah dikunci mendatar, rotasi ini otomatis mati.

## Audio
Semua suara dibuat dengan Web Audio API (tanpa file audio): musik/ambient per zona di `ZMUS`, efek suara di `SFX`. Tombol suara ada di menu Pengaturan.


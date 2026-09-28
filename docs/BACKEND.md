# Kontrak Backend

Game hanya bicara ke backend lewat `window.claude.use('db')` dan `window.claude.use('room')`.
`www/claude-shim.js` menyediakannya untuk mode mandiri (localStorage + BroadcastChannel).
Untuk multiplayer online, buat adapter yang memenuhi kontrak di bawah dan muat **sebelum** `game.js`
(ganti `claude-shim.js`).

## db

```js
claude.use('db') -> Promise<db>
db.doc('players/<id>').get()   -> Promise<{exists:boolean, data():object}>
db.doc('players/<id>').set(obj)-> Promise<void>      // timpa seluruh dokumen
db.collection('players').orderBy('level','desc').limit(15).get()
                               -> Promise<{docs:[{id, data()}]}>   // dipakai papan peringkat
```

`<id>` = nama karakter huruf kecil, spasi diganti `_`. Game menyimpan dokumen setiap beberapa detik saat ada perubahan,
dan langsung saat penting (naik level, beli skill, ganti zona).

### Isi dokumen pemain (`serialize()` di game.js)
`name, zone, x, y, hp, level, xp, coins, potions, skills{}, element, slots[], v3, sq, sqa, sqp, q, qa, qp, chests[], visited[], kills, hero`

## room (presence real-time)

```js
claude.use('room') -> Promise<room>
room.presence(obj)             -> Promise<void>         // dikirim ±8×/detik saat berubah
room.onPeers(cb)               // cb({peers:[{peer, isMe, presence}]}) tiap ada perubahan
room.peers()                   -> [{peer, isMe, presence}]
```

### Isi `presence`
`n` nama, `z` zona, `x,y` posisi, `f` arah, `w` sedang jalan, `at` penghitung serangan, `ak` jenis kombo,
`lv` level, `hp`, `mh` HP maks, `e` emote, `et` waktu emote, `hero`, `sn` penghitung skill,
`sk` id skill terakhir, `sa` sudut, `sx,sy` target.
Pemain hanya menggambar peer yang `z`-nya sama dengan zonanya.

## Catatan penting sebelum rilis online
- **Semua logika (damage, koin, XP) dihitung di klien.** Pemain bisa curang dengan mengubah data. Untuk game publik, pindahkan
  perhitungan penting ke server atau validasi lewat aturan database.
- **Nama tidak punya password.** Siapa pun yang mengetik nama yang sama menjadi karakter itu. Tambahkan login/PIN kalau perlu.
- Kalau game akan dibagikan luas, jangan menjanjikan hadiah uang/pulsa untuk poin dalam game tanpa memahami aturan yang berlaku di negaramu.

## Pilihan backend
Firebase (Firestore + Realtime Database untuk presence) atau Supabase (Postgres + Realtime Presence) keduanya cocok
untuk skala puluhan sampai ratusan pemain. Kerangka adapter Supabase ada di `backend-examples/supabase-adapter.example.js`
(belum diuji, jadikan titik awal).

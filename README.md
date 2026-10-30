# LOST ISLAND — Three.js Survival

Prototype game survival 3D Low Poly berbasis browser.

## Fitur versi ini
- Pulau prosedural Low Poly, laut, pantai, hutan, batu, bangkai kapal, api unggun.
- Karakter third-person dan kontrol WASD / tombol layar sentuh.
- Hewan ayam, sapi, babi hutan, rusa sebagai target berburu.
- Resource kayu, batu, serat; inventory.
- Survival: HP, lapar, haus, pergantian hari.
- Crafting tombak, api unggun, dan 4 tahap bagian kapal.
- Objektif progres membangun kapal.

## Menjalankan
Butuh koneksi internet saat pertama membuka karena Three.js diambil dari CDN.

### Cara 1 — VS Code
1. Ekstrak ZIP.
2. Buka folder `LOST_ISLAND` di VS Code.
3. Jalankan dengan ekstensi Live Server, klik kanan `index.html` → Open with Live Server.

### Cara 2 — Python
Buka terminal di folder project:
```bash
python -m http.server 8000
```
Buka `http://localhost:8000`.

### Cara 3 — Node.js
```bash
npx serve .
```
Buka alamat lokal yang ditampilkan terminal.

Jangan membuka `index.html` langsung dengan `file://`, karena browser memblokir ES module.

## Kontrol
- WASD: bergerak
- SHIFT: berlari
- E: mengambil resource
- Klik kiri / Space: menyerang hewan
- C: membuka crafting
- Mobile: tombol arah, E, dan tombol serang di layar

## Struktur
```
LOST_ISLAND/
├── index.html
├── style.css
├── README.md
└── src/
    ├── main.js       # game loop, kontrol, HUD, inventory, crafting
    ├── world.js      # pulau, pepohonan, batu, kapal karam
    └── entities.js   # karakter dan hewan low-poly
```

## Catatan pengembangan
Ini adalah playable prototype awal dengan model 3D placeholder yang dibuat dari geometri Three.js, bukan game final berisi model artistik eksternal. Fitur lanjutan yang cocok ditambahkan: animasi karakter, suara, save/load, memasak, minum di sungai, sistem senjata dan tool durability, kapal final yang bisa dinaiki, quest cinematic, serta optimasi pulau besar.

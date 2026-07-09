# 📐 MathLearn SMP 8 — Web Pembelajaran Matematika

Website edukasi interaktif untuk siswa SMP Kelas 8 dengan 3 materi pertemuan (Kedudukan Garis, Hubungan Antar Sudut, dan Kesebangunan Segitiga) menggunakan model pembelajaran Challenge-Based Learning (CBL).

---

## 📁 Struktur Folder Proyek (Folder Separation)

Proyek ini telah dipisahkan menjadi dua folder utama untuk frontend dan backend:

```
d:\Website\mathshape\
├── frontend/               # Folder khusus aplikasi klien (React + Vite + TypeScript)
│   ├── src/                # Kode sumber frontend
│   ├── public/             # Aset publik frontend
│   ├── package.json        # Dependensi frontend
│   └── vite.config.ts      # Konfigurasi bundler Vite
│
├── backend/                # Folder khusus API server (Node.js + Express)
│   ├── server.js           # Server Express utama
│   ├── schema.sql          # Skema database untuk menyimpan jawaban
│   └── package.json        # Dependensi backend
│
└── README.md               # Dokumentasi utama proyek ini
```

---

## 🛠️ Persiapan Database (Supabase PostgreSQL)

Untuk menyimpan jawaban siswa, Anda perlu membuat tabel `user_answers` di database Supabase Anda.

### Langkah-langkah:
1. Buka [Dashboard Supabase](https://supabase.com).
2. Pilih proyek Anda: `izkvezvrdbvkkvayfout`.
3. Buka tab **SQL Editor** di bilah sisi kiri.
4. Buat query baru, lalu salin isi file [backend/schema.sql](file:///D:/Website/mathshape/backend/schema.sql) ke dalamnya.
5. Klik **Run** untuk membuat tabel dan mengaktifkan RLS (Row Level Security).

---

## 🚀 Cara Menjalankan Aplikasi Secara Lokal

### 1. Menjalankan Backend (Express API)
Masuk ke direktori backend, instal dependensi, lalu jalankan server:

```bash
cd backend
npm install
npm run start
```
Server backend akan berjalan di [http://localhost:3000](http://localhost:3000) dan secara otomatis mendengarkan permintaan penyimpanan dan pengambilan jawaban dari frontend.

### 2. Menjalankan Frontend (React + Vite)
Buka terminal baru, masuk ke direktori frontend, dan jalankan dev server:

```bash
cd frontend
npm run dev
```
Aplikasi frontend akan berjalan di port default Vite (biasanya [http://localhost:5173](http://localhost:5173)).

---

## 💡 Ringkasan Perubahan UI & Fungsionalitas
1. **Separated Architecture**: Seluruh aset frontend dipindahkan ke subfolder `frontend/`, sedangkan logika server dipindahkan ke `backend/`.
2. **Paginated Material Content Page**: Halaman isi materi (`MaterialContentPage.tsx`) diubah dari model *scrollable stacked cards* menjadi model *paginated* (hanya menampilkan satu bagian per halaman) sesuai dengan desain mockup `Desktop-isi-materi (2).jpg`.
3. **Answer Columns**:
   - Kolom jawaban berupa textarea ditambahkan di setiap bagian materi kecuali pada bagian *Capaian & Tujuan Pembelajaran*, *Big Idea*, dan *Guiding Resources*.
   - Jawaban disimpan ke database PostgreSQL di Supabase melalui API Backend yang aman.
4. **Answer Read-Only Mode**: Ketika siswa telah menyelesaikan seluruh materi (`is_completed === true`), input textarea otomatis terkunci (read-only) agar jawaban tidak dapat dimodifikasi lagi.
5. **Interactive Controls**: Tombol navigasi `< Selanjutnya >` di bagian bawah halaman mengontrol pergantian halaman, validasi pengisian jawaban, dan penyimpanan otomatis sebelum berganti tab.

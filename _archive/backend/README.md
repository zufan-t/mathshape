# MathLearn — Backend Server (Node.js / Express)

## Struktur Folder

```
backend/
├── src/
│   ├── controllers/       # Handler request per fitur
│   │   ├── auth.controller.ts
│   │   ├── materials.controller.ts
│   │   └── progress.controller.ts
│   ├── middlewares/       # Middleware (auth guard, error handler, dll.)
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/            # Definisi endpoint REST API
│   │   ├── auth.routes.ts
│   │   ├── materials.routes.ts
│   │   └── progress.routes.ts
│   ├── services/          # Business logic terpisah dari controller
│   │   ├── auth.service.ts
│   │   ├── materials.service.ts
│   │   └── progress.service.ts
│   ├── models/            # Tipe data / schema database
│   │   ├── user.model.ts
│   │   ├── material.model.ts
│   │   └── progress.model.ts
│   ├── config/            # Koneksi database & env
│   │   └── db.ts
│   └── app.ts             # Entry point Express
├── .env                   # Variabel lingkungan backend (TIDAK di-commit)
├── .env.example           # Template variabel lingkungan
├── package.json
└── tsconfig.json
```

## Setup

```bash
cd backend
npm install
cp .env.example .env     # lalu isi nilainya
npm run dev
```

## Endpoints Utama

| Method | Endpoint                   | Deskripsi                        |
|--------|----------------------------|----------------------------------|
| POST   | /v1/auth/register          | Daftar akun baru                 |
| POST   | /v1/auth/login             | Masuk dengan email & kata sandi  |
| POST   | /v1/auth/forgot-password   | Kirim email reset kata sandi     |
| POST   | /v1/auth/reset-password    | Simpan kata sandi baru           |
| GET    | /v1/materials              | Daftar semua materi              |
| GET    | /v1/materials/:id          | Detail satu materi               |
| GET    | /v1/progress               | Progres belajar pengguna         |
| PUT    | /v1/progress/:materialId   | Update progres materi            |

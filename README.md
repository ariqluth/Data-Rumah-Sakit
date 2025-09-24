# Rumah Sakit Management Platform

A full-stack reference implementation for managing pasien data with RBAC requirements.

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Auth0 JWT validation, Excel export via OpenPyXL
- **Frontend**: React (Vite), TailwindCSS, Redux Toolkit, Auth0 React SDK

## 1. Backend (FastAPI)

### Prasyarat
- Python 3.11+
- PostgreSQL instance (contoh: `postgresql://postgres:postgres@localhost:5432/rumahsakit`)
- Virtual environment (opsional tetapi direkomendasikan)

### Instalasi
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate           # PowerShell (Windows)
pip install -r requirements.txt
copy .env.example .env            # lalu sesuaikan isinya
```

Isi `.env` minimal:
```
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/rumahsakit
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_AUDIENCE=https://rumahsakit-api
AUTH0_CUSTOM_ROLE_CLAIM=https://rumahsakit.example.com/roles
DEFAULT_ROLE=admin
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

> **Auth0**: pastikan API Audience (`Identifier`) sama dengan `AUTH0_AUDIENCE`. Tambahkan Rule / Action di Auth0 yang menambahkan claim custom (misal `https://rumahsakit.example.com/roles`) berisi array role pengguna.

### Menjalankan server
```bash
uvicorn app.main:app --reload
```

Server otomatis membuat tabel (`users`, `patients`) saat startup. Gunakan Auth0 untuk login pertama kali; user baru otomatis tersinkronisasi dengan role default jika klaim tidak tersedia.

### Endpoint utama
- `POST /api/patients` – tambah pasien (`dokter`)
- `GET /api/patients` – daftar + filter by `name`, `start_date`, `end_date`
- `PUT /api/patients/{id}` – edit pasien (`dokter`)
- `DELETE /api/patients/{id}` – hapus pasien (`dokter`)
- `GET /api/reports/patients` – ringkasan + tabel untuk dashboard
- `GET /api/reports/patients/export` – export Excel
- `POST /api/integrations/patients/import` – import dummy bulk
- `GET /api/users/me` – profil + role saat ini

Gunakan Bearer token Auth0 (RS256) di header `Authorization`.

## 2. Frontend (React + Redux)

### Prasyarat
- Node.js 22.16.0+

### Instalasi & konfigurasi
```bash
cd frontend
npm install
copy .env.example .env
```

Isi `.env` minimal:
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_AUTH0_DOMAIN=your-tenant.us.auth0.com
VITE_AUTH0_CLIENT_ID=xxxxxxxxxxxx
VITE_AUTH0_AUDIENCE=https://rumahsakit-api
VITE_AUTH0_ROLE_CLAIM=https://rumahsakit.example.com/roles
```

### Menjalankan
```bash
npm run dev
```
Aplikasi tersedia di `http://localhost:5173`.

### Alur utama
- Login via Auth0 (Auth0Provider + Auth0 React SDK)
- Redux menyimpan token, profil Auth0, dan akun backend (role)
- Guard berbasis role:
  - `dokter`: CRUD pasien, import, export
  - `admin`: hanya melihat dashboard & daftar
- Dashboard gabungan menampilkan ringkasan, tabel pasien, filter, export, serta import dummy.

## 3. Testing & Validasi
- Backend: jalankan `uvicorn` dan uji endpoint dengan token Auth0 (gunakan Postman/curl). Tambahkan data dummy melalui import atau endpoint `POST /api/patients`.
- Frontend: gunakan tombol Export untuk memastikan file Excel di-download. Filter nama/tanggal untuk memverifikasi query param.
- Pastikan Auth0 role claim bekerja; tanpa claim pengguna akan turun ke role default (`admin`).

## 4. Langkah Lanjut
- Tambahkan Alembic migration jika diperlukan.
- Gunakan `docker-compose` untuk orkestrasi PostgreSQL + FastAPI + Vite proxy.
- Tambahkan unit test (pytest) & komponen test (Vitest/RTL) bila dibutuhkan.

Selamat mencoba! Jika ada penyesuaian lebih lanjut (misal integrasi sistem eksternal sungguhan), struktur kode sudah dipisah per modul sehingga mudah untuk diextend.

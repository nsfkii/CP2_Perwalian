 ##       Sistem Pencatatan Perwalian Mahasiswa - STMIK Bandung

Sistem Pencatatan Perwalian adalah aplikasi web yang dikembangkan sebagai Capstone Project untuk memfasilitasi proses administrasi dan pencatatan histori konsultasi akademik antara Mahasiswa dan Dosen Wali di STMIK Bandung.

Aplikasi ini menggunakan arsitektur pemisahan antara Backend (RESTful API) dan Frontend (Single Page Application), dilengkapi dengan Role-Based Access Control (RBAC) untuk tiga entitas pengguna: Admin, Dosen, dan Mahasiswa.

##         Teknologi yang Digunakan

1. Frontend:
*   React.js (Vite)
*   Bootstrap 5 & React Bootstrap
*   React Router DOM (Routing)
*   React Hook Form (Form Handling)
*   Axios (HTTP Client)
*   Recharts (Data Visualization)

2. Backend:
*   PHP & Laravel (REST API)
*   Laravel Sanctum (Token-based Authentication)
*   Laravel Excel & DomPDF (Reporting & Export)

3. Database:
*   PostgreSQL

-----------------------------------------------------------------------------------------------------

##           Prasyarat Sistem

Sebelum menginstal, pastikan komputer Anda telah terinstal perangkat lunak berikut:
1.  **PHP** (minimal versi 8.2)
2.  **Composer** (Package manager untuk PHP)
3.  **Node.js & npm** (minimal versi 18+)
4.  **PostgreSQL** (Database Server)

-----------------------------------------------------------------------------------------------------

##           Panduan Instalasi & Menjalankan Proyek

Langkah-langkah untuk menjalankan proyek ini dari awal di mesin lokal Anda.

### 1. Setup Database
*   Buka pgAdmin atau terminal PostgreSQL Anda.
*   Buat database baru kosong dengan nama, misalnya: `db_perwalian_stmik`.

### 2. Setup Backend (Laravel API)
Buka terminal dan masuk ke dalam folder backend:
```bash
cd backend
Instal dependensi PHP:
Bash
composer install


Salin file konfigurasi environment:
Bash
cp .env.example .env
Buka file .env yang baru dibuat dan sesuaikan konfigurasi database Anda:

Cuplikan kode
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=db_perwalian_stmik
DB_USERNAME=postgres
DB_PASSWORD=password_postgres_anda
Generate application key:

Bash
php artisan key:generate
Jalankan migrasi database beserta data awal (Seeder):

Bash
php artisan migrate --seed
Jalankan server backend:

Bash
php artisan serve
(Backend akan berjalan di http://127.0.0.1:8000)

### 3. Setup Frontend (React SPA)
Buka terminal baru dan masuk ke dalam folder frontend:

Bash
cd frontend
Instal dependensi Node:

Bash
npm install

Jalankan server development:
Bash
npm run dev
(Frontend akan berjalan di http://localhost:5173)

##  Akun Default (Hasil Seeder)
Gunakan akun berikut untuk mencoba masuk (Login) ke dalam sistem:

1. Administrator

Email: admin@stmik-bandung.ac.id

Password: password123

2. Mahasiswa

Email: 1223017@stmik-bandung.ac.id

Password: password123

3. Dosen

Email: mina@stmik-bandung.ac.id

Password: password123

(Catatan: Saat Admin menambahkan data Mahasiswa/Dosen baru via UI atau Excel, kredensial default yang otomatis dibuat adalah Email: [NIM/NIDN]@stmik-bandung.ac.id dan Password: [NIM/NIDN]).

Dikembangkan untuk memenuhi syarat Capstone Project STMIK Bandung.

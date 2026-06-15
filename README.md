# Nikky Frozen POS

Sistem Point Of Sale (POS) berbasis Web untuk manajemen toko frozen food multi cabang.

## 🚀 Fitur

- Dashboard Analitik
- Point Of Sale (Kasir)
- Manajemen Produk
- Manajemen Stok
- Transfer Stok Antar Cabang
- Laporan Keuangan
- Riwayat Transaksi
- Audit Log
- Manajemen Cabang
- Manajemen User
- Monitoring Produk Kadaluarsa

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Recharts
- SweetAlert2

### Backend

- Laravel 13
- PHP 8+
- MySQL

---

# 📥 Instalasi Project

## 1. Clone Repository

```bash
git clone https://github.com/iqblmlnf/nikky-frozen-pos.git
```

```bash
cd nikky-frozen-pos
```

---

# ⚙️ Setup Backend

Masuk ke folder backend

```bash
cd backend
```

Install dependency Laravel

```bash
composer install
```

### Copy File Environment

Salin file:

```text
.env.example
```

menjadi:

```text
.env
```

Generate application key

```bash
php artisan key:generate
```

Konfigurasi database pada file `.env`

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nikky_frozen_pos
DB_USERNAME=root
DB_PASSWORD=
```

Jalankan server backend

```bash
php artisan serve
```

Backend akan berjalan pada:

```text
http://localhost:8000
```

---

# 🎨 Setup Frontend

Masuk ke folder frontend

```bash
cd frontend
```

Install dependency

```bash
npm install
```

Jalankan aplikasi

```bash
npm run dev
```

Frontend akan berjalan pada:

```text
http://localhost:5173
```

---

# 🗄 Setup Database

1. Buat database baru di phpMyAdmin

```sql
nikky_frozen_pos
```

2. Import file database yang tersedia pada link berikut:

📁 Database Download:

https://drive.google.com/drive/folders/1I8uDXJpVJyO8V327RIEC0Zvpt7Y5TlHO?usp=sharing

3. Setelah import selesai, jalankan backend dan frontend.

---

# 🔑 Akun Demo

## Owner

```text
Username : owner@nikkyfrozen.com
Password : password
```

---

# 📂 Struktur Project

```
nikky-frozen-pos
│
├── backend
│   ├── app
│   ├── routes
│   ├── database
│   └── ...
│
├── frontend
│   ├── src
│   ├── public
│   └── ...
│
└── README.md
```

---

# 👨‍💻 Developer

Iqbal Maulana

Sistem Point Of Sale Frozen Food

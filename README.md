# Nikky Frozen POS

Sistem Point of Sale (POS) berbasis web untuk toko frozen food dengan dukungan multi cabang, manajemen stok, pembayaran digital Midtrans, serta mode offline untuk memastikan transaksi tetap berjalan meskipun koneksi internet terputus.

## 🚀 Fitur Utama

### 🛒 Point of Sale (POS)

* Transaksi penjualan produk
* Keranjang belanja (cart)
* Perhitungan subtotal otomatis
* Metode pembayaran Cash, Transfer, QRIS, dan Midtrans

### 🏪 Multi Cabang

* Manajemen banyak cabang
* Pemilihan cabang aktif
* Monitoring performa cabang

### 📦 Manajemen Produk & Stok

* CRUD produk
* Monitoring stok
* Transfer stok antar cabang
* Kategori produk

### 💳 Integrasi Midtrans

* Pembayaran QRIS
* GoPay
* Virtual Account
* Kartu Kredit/Debit
* Sandbox Mode untuk testing

### 🌐 Offline First

* Deteksi status online/offline
* Penyimpanan transaksi ke localStorage saat offline
* Sinkronisasi transaksi otomatis saat koneksi kembali tersedia

### 📊 Dashboard & Laporan

* Statistik penjualan
* Ringkasan transaksi
* Monitoring performa cabang

### 🔍 Audit Trail

* Riwayat aktivitas pengguna
* Pelacakan perubahan data

---

## 🛠️ Teknologi yang Digunakan

### Frontend

* React + TypeScript
* Vite
* Tailwind CSS
* Axios
* SweetAlert2
* Lucide React

### Backend

* Laravel
* MySQL
* Laravel API

### Payment Gateway

* Midtrans Snap API

---

## 📂 Struktur Project

```bash
nikky-frozen-pos/
│
├── frontend/       # React + Vite
│
├── backend/        # Laravel API
│
└── README.md
```

---

### Import Database

Download database dari Google Drive:

https://drive.google.com/drive/folders/1I8uDXJpVJyO8V327RIEC0Zvpt7Y5TlHO?usp=drive_link

Import file database.sql ke MySQL/phpMyAdmin.

### Download Folder Gambar Produk

Download folder products dari Google Drive:

https://drive.google.com/drive/folders/1G4I_EWabs2AvgKsjUqs9eNochHbRq0lc?usp=drive_link

Salin folder tersebut ke:

```
backend/storage/app/public/products
```

## ⚙️ Instalasi

### Clone Repository

```bash
git clone https://github.com/USERNAME/nikky-frozen-pos.git
cd nikky-frozen-pos
```

### Backend

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🔑 Konfigurasi Midtrans

Tambahkan pada file `.env` backend:

```env
MIDTRANS_SERVER_KEY=YOUR_SERVER_KEY
MIDTRANS_CLIENT_KEY=YOUR_CLIENT_KEY
MIDTRANS_IS_PRODUCTION=false
```

## 👨‍💻 Developer

Dikembangkan sebagai Project UTS Pemrograman.

Nama: Iqbal Maulana

Universitas: UNIVERSITAS AMIKOM YOGYAKARTA

Tahun: 2026

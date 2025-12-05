# Prisma Studio - Database Management Guide

## 🚀 Cara Menjalankan Prisma Studio

### Step 1: Buka Terminal/Command Prompt

### Step 2: Jalankan Command

```bash
npx prisma studio
```

### Step 3: Tunggu Server Buka

Browser otomatis akan membuka interface Prisma Studio di:

```
http://localhost:5555
```

## 📋 Fitur Prisma Studio

### 1. **Browse Data**

- Pilih model di sidebar (User, Barang, Order, Paket, dll)
- Lihat semua records dalam tabel

### 2. **Tambah Data Baru**

- Klik tombol **"Add record"**
- Isi semua field yang diperlukan
- Klik **"Save"** untuk simpan

### 3. **Edit Data**

- Klik pada row untuk membuka detail
- Edit field yang ingin diubah
- Klik **"Save"** untuk update

### 4. **Hapus Data**

- Pilih record
- Klik tombol **"Delete"**
- Confirm untuk hapus

### 5. **Cari/Filter Data**

- Gunakan field search di atas tabel
- Atau filter berdasarkan kolom tertentu

## 📊 Model Data yang Tersedia

1. **User** - Data pengguna (email, nama, alamat, no telepon, isAdmin)
2. **Barang** - Perlengkapan camping (nama, kategori, harga, stok, foto, deskripsi)
3. **Paket** - Paket penyewaan (nama, deskripsi, harga, foto, items)
4. **Order** - Pesanan (user, items, total harga, status pembayaran/pengiriman)
5. **OrderItem** - Item dalam pesanan (barang, harga, jumlah, durasi)
6. **PaketItem** - Item dalam paket (barang, jumlah)

## 🔗 Database Connection

- **Provider**: PostgreSQL (Supabase)
- **Connection URL**: Diambil dari file `.env`
- **DATABASE_URL**: `postgresql://postgres:AnakUc1ngs7$@db.qgmcydwvsqahtepbrozb.supabase.co:5432/postgres`

## ⚠️ Tips Penting

- Jangan hapus data penting secara tidak sengaja
- Semua perubahan langsung tersimpan ke database
- Gunakan untuk testing dan development saja
- Untuk production, gunakan aplikasi langsung

## 🆘 Jika Ada Masalah

1. Pastikan database connection string benar di `.env`
2. Pastikan Supabase instance aktif dan accessible
3. Restart Prisma Studio jika stuck: tekan `Ctrl+C` lalu jalankan ulang command

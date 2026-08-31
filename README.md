# Undangan Digital Pernikahan: Yusup & Tika

Website undangan pernikahan digital minimalis & elegan (*quiet luxury editorial*) untuk akad nikah intimate **Muhamad Yusup & Tika Oktavia Heningsih**.

## 📅 Detail Acara
- **Hari, Tanggal**: Rabu, 9 September 2026
- **Waktu**: 09.00 WIB - Selesai
- **Tempat**: KUA Kecamatan Kuningan, Jl. Otista No. 87, Kuningan, Jawa Barat
- **Sifat Acara**: Intimate (Khusus Keluarga Inti)

---

## ✨ Fitur Utama
1. **Interactive Opening Cover**: Cover amplop mewah dengan nama tamu yang otomatis menyesuaikan parameter URL.
2. **Kustom Nama Tamu**: Cukup tambahkan parameter `?to=Nama+Tamu` di tautan, contoh: `https://your-site.vercel.app/?to=Bapak+Ahmad`.
3. **Ambient Music Player**: Musik latar instrumental dengan tombol kontrol melayang (*floating play/pause* & gelombang suara).
4. **Live Countdown Timer**: Hitung mundur otomatis menuju hari pernikahan.
5. **Simpan ke Google Calendar**: Tombol 1-klik untuk memasukkan agenda ke kalender Google / smartphone.
6. **Integrasi Google Maps**: Akses navigasi langsung ke lokasi KUA Kuningan.
7. **Kotak Doa & Ucapan (Wishes Board)**: Tamu dapat menuliskan ucapan selamat & doa restu secara langsung.
8. **WhatsApp Share Generator**: Generator pesan WhatsApp otomatis untuk membagikan undangan ke daftar kontak.

---

## 🚀 Cara Deploy ke Vercel

### Metode 1: Lewat Dashboard Vercel (Rekomendasi)
1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **Add New...** > **Project**.
3. Pilih repository **`inv-pengedarseni`** (atau `pengedarseni/inv-pengedarseni`).
4. Pada pengaturan framework preset, biarkan **Other** / **Standard**.
5. Klik **Deploy**.
6. Selesai! Website Anda langsung aktif dengan domain gratis seperti `inv-pengedarseni.vercel.app`.

### Metode 2: Push ke GitHub
Setiap kali Anda melakukan `git push origin main`, Vercel akan otomatis melakukan update website secara instan (*auto CI/CD deployment*).

---

## 💻 Menjalankan Secara Lokal
Cukup buka file `index.html` di browser Anda, atau gunakan live server:
```bash
# Menggunakan Python:
python -m http.server 3000

# Atau menggunakan npx serve:
npx serve .
```
Lalu akses `http://localhost:3000` pada browser Anda.

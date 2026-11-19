# Daftar Fitur Produk — LaundryCalc

Dokumen ini merangkum daftar fitur yang diturunkan dari PRD **LaundryCalc & Catalog (v1.1 / MVP v0.1)** beserta pembaruan iterasi dari pengguna, prioritas, ketergantungan, status pengerjaan, dan keputusan atas hal yang sebelumnya ambigu.

## Daftar Fitur

| Kode | Nama Fitur | Prioritas | Ketergantungan | Status | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| FT-01 | Tampilan Katalog & Durasi | Must Have | - | Selesai | Paket L01, L02, L03 (grid 3 kolom di desktop) |
| FT-02 | Input Berat Aktual Desimal | Must Have | FT-01 | Selesai | Desimal presisi tanpa pembulatan dan tanpa minimum charge 3 kg |
| FT-03 | Opsi Add-on & Jarak Pengiriman per Km | Must Have | FT-02 | Selesai | T01 Antar-Jemput Rp 2.000/km (maks 5 km) & T02 Pewangi Premium Rp 2.000/kg aktual |
| FT-04 | Floating Price Summary | Must Have | FT-01, FT-02, FT-03, FT-08 | Selesai | Rincian persamaan desimal presisi, status Bayar Nanti, sticky bar ponsel & panel desktop |
| FT-05 | Form Data Pemesan | Must Have | FT-03 | Selesai | Nama, Alamat kondisional jika Antar-Jemput aktif, Catatan Khusus |
| FT-06 | WhatsApp Deep Link Button | Must Have | FT-04, FT-05, FT-08 | Selesai | Validasi BL-03 + jarak + member dan tautan `wa.me` ter-encode |
| FT-07 | Info Jam Operasional Toko | Should Have | - | Ditunda | Di luar lingkup permintaan saat ini |
| FT-08 | Pengajuan Bayar Nanti Member > 1 Tahun | Tambahan Chat | FT-05 | Selesai | Alternatif browser-only tanpa server/database; pengajuan hutang diteruskan ke WhatsApp admin |

## Klarifikasi & Keputusan Produk

1. **Format penulisan Rupiah:** Memakai `Rp 18.000` (spasi setelah `Rp`, pemisah ribuan titik, tanpa desimal) secara seragam di layar dan pesan WhatsApp.
2. **Perhitungan sesuai berat aktual tanpa minimum 3 kg dan tanpa pembulatan (Iterasi terbaru):** Atas permintaan terbaru pengguna, aturan *minimum charge* 3 kg dihapus. Berat ditagih selalu sama persis dengan berat aktual desimal (`W_ditagih = W_aktual`, contoh `2,43 kg` dihitung `2,43 kg`, tidak dinaikkan ke `3 kg` dan tidak dibulatkan). Jarak pengiriman juga memakai angka desimal persis tanpa pembulatan. Nilai akhir Rupiah tetap bilangan bulat (`Math.round` hanya bila ada pecahan di bawah Rp 1).
3. **Tarif Antar-Jemput per km (Iterasi):** Diubah dari flat Rp 10.000 menjadi `Rp 2.000/km` dikalikan jarak desimal aktual (`0,1` s.d. `5` km sesuai radius maksimal toko). Pada jarak `5 km`, biaya tetap `Rp 10.000`.
4. **Pengajuan Bayar Nanti / Hutang Member > 1 Tahun (Iterasi):** Karena aplikasi berjalan 100% di browser tanpa server dan database akun, fitur hutang dijalankan melalui input status dan lama keanggotaan di formulir. Syarat ketat `lamaMember > 1` tahun membuka opsi pengajuan **Bayar Nanti** yang dicantumkan pada pesan WhatsApp untuk diverifikasi manual oleh admin toko.
5. **Nomor WhatsApp tujuan:** Memakai nomor contoh `6281234567890` di `src/config.ts` agar mudah diganti pemilik toko tanpa menyimpan data pribadi asli.

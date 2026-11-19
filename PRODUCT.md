# Daftar Fitur Produk — LaundryCalc

Dokumen ini merangkum daftar fitur yang diturunkan dari PRD **LaundryCalc & Catalog (v1.1 / MVP v0.1)** beserta prioritas, ketergantungan, status pengerjaan, dan keputusan atas hal yang sebelumnya ambigu di PRD.

## Daftar Fitur

| Kode | Nama Fitur | Prioritas | Ketergantungan | Status | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| FT-01 | Tampilan Katalog & Durasi | Must Have | - | Selesai | Paket L01, L02, L03 dengan tarif/kg dan durasi |
| FT-02 | Input Berat & Notifikasi Min. Charge | Must Have | FT-01 | Selesai | Aturan BL-01 minimal 3 kg |
| FT-03 | Opsi Add-on Terintegrasi | Must Have | FT-02 | Selesai | T01 Antar-Jemput & T02 Pewangi Premium (BL-02) |
| FT-04 | Floating Price Summary | Must Have | FT-01, FT-02, FT-03 | Selesai | Rincian biaya live (sticky bottom di ponsel, panel kanan di desktop) |
| FT-05 | Form Data Pemesan | Must Have | FT-03 | Selesai | Nama, Alamat kondisional jika Antar-Jemput aktif, Catatan Khusus |
| FT-06 | WhatsApp Deep Link Button | Must Have | FT-04, FT-05 | Selesai | Validasi BL-03 dan tautan `wa.me` ter-encode |
| FT-07 | Info Jam Operasional Toko | Should Have | - | Ditunda | Di luar lingkup permintaan saat ini (sampai FT-06) |

## Klarifikasi & Keputusan atas Hal Ambigu di PRD

1. **Format penulisan Rupiah:** Di PRD terdapat variasi `Rp 6.000` (dengan spasi pada tabel fitur, AC, TC, dan template WA) serta `Rp45.000` (tanpa spasi di rumus matematika). Diputuskan memakai **`Rp 18.000`** (spasi setelah `Rp`, pemisah ribuan titik, tanpa desimal) secara seragam di layar dan pesan WhatsApp agar cocok 100% dengan template pesan PRD dan seluruh kriteria penerimaan.
2. **Pembulatan & rentang berat:** PRD menetapkan berat `>= 0,1 kg` dengan step `0,1`. Diputuskan kolom menerima koma maupun titik, batas atas wajar `100 kg`, nilai awal saat halaman dibuka `3 kg`, dan hasil perkalian harga dibulatkan ke bilangan bulat Rupiah terdekat (`Math.round`).
3. **Nomor WhatsApp tujuan:** Di PRD tertulis placeholder `628xxxxxxxxxx`. Diputuskan memakai nomor contoh `6281234567890` di `src/config.ts` agar tautan `wa.me` dapat diuji dan mudah diganti oleh pemilik toko tanpa menyimpan data pribadi asli.
4. **Penamaan add-on Pewangi Premium:** Di tabel fitur PRD tertulis "Pewangi Premium Downy", sedangkan di JSON konfigurasi tertulis `"name": "Pewangi Premium"` dengan catatan `"Aroma mewah pilihan tahan lama (Downy Passion / Mystique)"`. Diputuskan menampilkan nama **Pewangi Premium** dan keterangan resmi dari JSON konfigurasi, serta memakai label `Pewangi Premium` pada template WhatsApp sesuai Bagian 7 PRD.

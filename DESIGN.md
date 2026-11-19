# Panduan Desain — LaundryCalc

Dokumen ini mencatat seluruh keputusan desain yang disetujui pengguna serta token tampilan tetap untuk seluruh fitur LaundryCalc (FT-01 s.d. FT-06).

## Keputusan Desain Pengguna

| Aspek | Keputusan | Keterangan |
| :--- | :--- | :--- |
| Nama aplikasi | LaundryCalc | Sesuai PRD (Katalog & Kalkulator Estimasi Laundry) |
| Kesan visual | Modern dan ringkas | Font tunggal **Manrope** (400, 500, 600) lewat `@fontsource/manrope` |
| Warna aksen | Biru (`blue`) | `bg-blue-700`, hover `bg-blue-800`, teks `text-blue-700`, terpilih `border-blue-700 bg-blue-50` |
| Sapaan pengguna | Kamu | Bahasa Indonesia sesuai EYD V, akrab dan ringkas |
| Susunan halaman | Satu halaman bergulir | 1 kolom di ponsel (`>= 360px`), 2 kolom di desktop (`>= 1024px`) |
| Posisi aksi utama | Bar menempel di bawah layar (ponsel) & panel samping tetap (desktop) | Sesuai FT-04 PRD; aksi utama terlihat tanpa menggulir di layar `360 x 740 px` |
| Gambar | Tanpa gambar | Fokus kecepatan muat dan kejelasan angka tarif |

## Token Visual Tetap

- **Permukaan:** Kanvas `bg-neutral-50`, panel dan kartu `bg-white`. Tidak ada kartu di dalam kartu.
- **Garis tepi:** `border-neutral-200` khusus untuk input, kontrol pilihan, dan garis pemisah.
- **Sudut:** Panel dan kartu `rounded-2xl`, tombol dan input `rounded-xl`, penanda ringkas `rounded-full` hanya jika diperlukan.
- **Bayangan:** Hanya untuk bar melayang di bawah layar (`shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]`).
- **Tipografi:**
  - Judul halaman: `text-2xl font-semibold`
  - Judul bagian: `text-lg font-semibold`
  - Isi & input: `text-base` (minimal 16 px di dalam input)
  - Label & teks pendukung: `text-sm` (minimal 14 px)
  - Nominal total utama: `text-3xl font-semibold tabular-nums`
  - Seluruh angka harga dan berat memakai `tabular-nums`.
- **Warna teks & status:**
  - Teks utama: `text-neutral-900`
  - Teks pendukung: `text-neutral-600`
  - Placeholder: `text-neutral-500`
  - Cincin fokus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700`
  - Peringatan minimum charge: `bg-amber-50 text-amber-800` dengan ikon dan teks penjelas
  - Error validasi: `bg-red-50 text-red-800` / `text-red-700` dengan ikon dan contoh perbaikan
- **Aksesibilitas & Gerak:**
  - Area sentuh seluruh kontrol interaktif minimal `44 x 44 px`.
  - Transisi hanya `transform` dan `opacity` (150–200 ms, `ease-out`, menghormati `motion-reduce:`).
  - Tanpa gradasi, `backdrop-blur`, efek glow, emoji, ikon sparkle, atau garis tepi kiri tebal berwarna.

## Pilihan Tampilan per Fitur

- **FT-01 (Katalog Paket):** Kartu radio vertikal yang dapat diklik seluruh areanya, menampilkan nama paket, durasi pengerjaan dalam teks bersih, deskripsi ringkas, dan tarif per kg rata kanan dengan `tabular-nums`.
- **FT-02 (Input Berat):** Kolom angka besar dengan tombol `-0,5` dan `+0,5` berarea sentuh minimal 44 px, diikuti kotak peringatan amber otomatis jika berat `> 0` dan `< 3 kg`.
- **FT-03 (Add-on):** Daftar checkbox kartu lebar penuh yang mudah disentuh, menampilkan tarif satuan dan biaya live yang sedang dihitung.
- **FT-04 & FT-06 (Ringkasan & Tombol WA):** Pada layar ponsel (`< 1024px`) tampil sebagai bar bawah melayang yang ringkas (total + tombol rincian + tombol kirim) agar tetap terlihat tanpa menggulir di `360 x 740 px`. Pada desktop (`>= 1024px`) tampil sebagai panel sticky di sisi kanan dengan rincian terbuka penuh.
- **FT-05 (Form Pemesan):** Kolom bertumpuk dengan label selalu terlihat di atas input; kolom alamat muncul otomatis saat *Antar-Jemput* dicentang.

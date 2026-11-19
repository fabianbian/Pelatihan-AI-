# Panduan Desain — LaundryCalc

Dokumen ini mencatat seluruh keputusan desain yang disetujui pengguna serta token tampilan tetap untuk LaundryCalc (FT-01 s.d. FT-06 dan FT-08).

## Keputusan Desain Pengguna

| Aspek | Keputusan | Keterangan |
| :--- | :--- | :--- |
| Nama aplikasi | Mantap Laundry | Diperbarui sesuai permintaan pengguna pada judul header |
| Kesan visual | Modern, ringkas, dan kontras tegas | Font tunggal **Manrope** (400, 500, 600) lewat `@fontsource/manrope` |
| Warna aksen | Biru (`blue`) kontras tinggi | `bg-blue-700`, hover `bg-blue-800`, teks `text-blue-700`, terpilih `border-blue-700 bg-blue-50` |
| Sapaan pengguna | Kamu | Bahasa Indonesia sesuai EYD V, akrab dan ringkas |
| Susunan halaman | Satu halaman bergulir dengan struktur tegas | Bilah header putih berbingkai bawah, katalog 3 kolom di desktop (`>= 1024px`), diikuti 2 kolom kerja; 1 kolom di ponsel (`>= 360px`) |
| Posisi aksi utama | Bar menempel di bawah layar (ponsel) & panel samping tetap (desktop) | Aksi utama terlihat tanpa menggulir di layar `360 x 740 px` |
| Gambar | Tanpa gambar | Fokus kecepatan muat, presisi angka desimal, dan kontras tinggi |

## Token Visual Tetap

- **Permukaan:** Kanvas `bg-neutral-50`, panel dan kartu `bg-white`. Tidak ada kartu di dalam kartu.
- **Garis tepi:** `border-neutral-200` untuk pemisah dan bingkai panel, `border-neutral-300` untuk kontrol input dan kartu tidak terpilih agar kontras struktur lebih tegas, serta `border-2 border-blue-700` untuk elemen terpilih.
- **Sudut:** Panel dan kartu `rounded-2xl`, tombol dan input `rounded-xl`.
- **Bayangan:** Hanya untuk bar melayang di bawah layar (`shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)]`).
- **Tipografi:**
  - Judul halaman: `text-2xl font-semibold tracking-tight`
  - Judul bagian: `text-lg font-semibold tracking-tight`
  - Isi & input: `text-base` (minimal 16 px di dalam input)
  - Label & teks pendukung: `text-sm` (minimal 14 px)
  - Nominal total utama: `text-3xl font-semibold tabular-nums`
  - Seluruh angka harga, berat desimal, dan jarak desimal memakai `tabular-nums`.
- **Warna teks & status:**
  - Teks utama: `text-neutral-900`
  - Teks pendukung: `text-neutral-600`
  - Placeholder: `text-neutral-500`
  - Cincin fokus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700`
  - Peringatan minimum charge & syarat member: `bg-amber-50 text-amber-800` dengan ikon dan teks penjelas
  - Error validasi: `text-red-800` / `border-red-600` dengan ikon dan contoh perbaikan
  - Status berhasil / pengajuan Bayar Nanti aktif: `bg-emerald-50 text-emerald-800` atau `bg-blue-50 text-blue-800` dengan ikon dan teks penjelas
- **Aksesibilitas & Gerak:**
  - Area sentuh seluruh kontrol interaktif minimal `44 x 44 px`.
  - Transisi hanya `transform` dan `opacity` (150 ms, `ease-out`, menghormati `motion-reduce:`).
  - Tanpa gradasi, `backdrop-blur`, efek neon/glow, emoji, ikon sparkle, atau garis tepi kiri tebal berwarna.

## Pilihan Tampilan per Fitur

- **FT-01 (Katalog Paket):** 3 kartu radio horizontal di desktop (`grid-cols-3`) dan bertumpuk di ponsel, menonjolkan tarif per kg dalam ukuran tegas (`text-xl font-semibold tabular-nums`) dan durasi pengerjaan tanpa pil dekoratif.
- **FT-02 (Input Berat):** Input desimal presisi besar tanpa pembulatan dengan tombol `-0,5` dan `+0,5`; berat aktual langsung dihitung tanpa menaikkan ke minimum 3 kg.
- **FT-03 (Add-on & Jarak Pengiriman):** Dua kartu checkbox tegas; saat *Antar-Jemput* aktif, tampil kolom **Jarak penjemputan (km)** tanpa pembulatan tepat di bawah blok add-on (sebagai panel putih terpisah, bukan kartu di dalam kartu) dengan kalkulasi ongkir live.
- **FT-04 & FT-06 (Ringkasan & Tombol WA):** Panel sticky kanan di desktop dengan blok total tegas di bagian atas/bawah dan rincian persamaan desimal; bar bawah melayang yang ringkas di ponsel.
- **FT-05 & FT-08 (Data Pemesan & Bayar Nanti Member):** Kolom bertumpuk rapi diikuti blok keanggotaan member dan checkbox **Ajukan Bayar Nanti (Hutang Member)** yang hanya terbuka bila lama keanggotaan `> 1` tahun.

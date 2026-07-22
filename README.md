# MutabaahSantri

Aplikasi full-stack untuk pencatatan setoran hafalan, monitoring progress, muraja'ah otomatis, dan portal wali santri di pondok pesantren.

## Fitur MVP

- Login berbasis peran: Super Admin, Admin Pondok, Ustadz/Musyrif, Wali Santri, Pimpinan, dan struktur untuk Santri.
- Master data santri, ustadz, halaqah, kelas, asrama, wali, tahun ajaran, serta program.
- Input setoran Al-Qur'an dengan nilai kelancaran, tajwid, makhraj, status, catatan, dan catatan akhlak.
- Jadwal muraja'ah otomatis H+1, H+3, H+7, dan H+30 setiap kali setoran disimpan.
- Dashboard sesuai cakupan peran, grafik nilai, progress dan peta Juz, riwayat santri, dan hafalan yang perlu dikuatkan.
- Portal wali yang hanya menampilkan anak yang terkait dengan akun wali.
- Laporan yang dapat dicetak sebagai PDF melalui dialog cetak browser dan diunduh sebagai CSV yang dapat dibuka di Excel.
- Notifikasi in-app, program hafalan, dan target harian/mingguan/bulanan.

## Teknologi

- Next.js App Router + TypeScript
- Tailwind CSS
- PostgreSQL + Drizzle ORM
- React Hook Form + Zod
- Recharts
- PostgreSQL lokal pada development; struktur tabel kompatibel untuk dipindahkan ke Supabase PostgreSQL.

> Proyek starter environment ini menggunakan Drizzle/PostgreSQL lokal sesuai runtime platform. Untuk Supabase, arahkan `DATABASE_URL` ke connection string Supabase, gunakan Supabase Auth sebagai pengganti session demo, lalu terapkan template `supabase/rls.sql` setelah menyesuaikan klaim role Anda.

## Menjalankan Lokal

1. Salin atau buat `.env`:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
   ```

2. Pasang dependensi:

   ```bash
   bun install
   # atau npm install
   ```

3. Terapkan database dan data contoh:

   ```bash
   npx drizzle-kit push
   npx tsx src/db/seed.ts
   ```

4. Jalankan aplikasi:

   ```bash
   bun run dev
   # atau npm run dev
   ```

5. Buka `http://localhost:3000`.

## Akun Demo

Semua akun demo menggunakan kata sandi `mutabaah123`.

| Peran | Email |
| --- | --- |
| Super Admin | `admin@mutabaah.test` |
| Admin Pondok | `pondok@mutabaah.test` |
| Ustadz Putra | `ahmad@mutabaah.test` |
| Ustadzah Putri | `fatimah@mutabaah.test` |
| Wali Aisyah/Maryam/Hafshah | `wali.aisyah@mutabaah.test` |
| Wali Zaid/Yusuf | `wali.zaid@mutabaah.test` |
| Pimpinan Pondok | `pimpinan@mutabaah.test` |

## Alur Operasional yang Disarankan

1. Admin membuat tahun ajaran, ustadz, halaqah, kelas/asrama, dan data wali.
2. Admin menempatkan santri ke halaqah.
3. Ustadz mencatat setoran harian dari menu **Input Setoran**.
4. Sistem menambahkan riwayat, memperbarui peta progress, dan membuat jadwal muraja'ah.
5. Ustadz menyelesaikan agenda pada menu **Muraja'ah**.
6. Wali masuk ke **Portal Wali** untuk memantau anak.
7. Pimpinan/Admin membuka **Laporan** untuk rekap dan ekspor.

## Catatan Produksi

- Autentikasi pada MVP menggunakan cookie sesi dan kata sandi demo yang disimpan untuk keperluan sandbox. **Jangan gunakan mekanisme ini pada produksi.**
- Produksi disarankan menggunakan Supabase Auth atau penyedia autentikasi lain dengan hash kata sandi, reset token, verifikasi email, dan audit log.
- Audio setoran belum diaktifkan pada UI; kolom `url_audio` sudah tersedia di tabel untuk integrasi Supabase Storage/S3.
- Tabel `kitab_submissions` dan `reports` sudah tersedia untuk pengembangan modul setoran kitab/matan/hadits dan rapor periodik.
- Gunakan connection pooling Supabase/Vercel dan set environment variable `DATABASE_URL` pada deployment Vercel.

## Validasi

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

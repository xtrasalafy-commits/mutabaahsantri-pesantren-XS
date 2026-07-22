-- Template RLS untuk instalasi Supabase MutabaahSantri.
-- Jalankan setelah tabel dipindahkan ke schema Supabase dan `users.id`
-- terhubung dengan `auth.users.id`. Pastikan JWT memiliki claim `role`.

alter table public.users enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.parents enable row level security;
alter table public.halaqahs enable row level security;
alter table public.quran_submissions enable row level security;
alter table public.kitab_submissions enable row level security;
alter table public.murajaah_schedules enable row level security;
alter table public.targets enable row level security;
alter table public.reports enable row level security;
alter table public.notifications enable row level security;

-- Helper: admin dan pimpinan memperoleh akses operasional penuh.
create or replace function public.is_pengelola()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((auth.jwt() ->> 'role') in ('super_admin', 'admin_pondok', 'pimpinan'), false);
$$;

-- Admin/pimpinan dapat membaca data utama.
create policy "pengelola membaca santri" on public.students for select using (public.is_pengelola());
create policy "pengelola mengelola santri" on public.students for all using ((auth.jwt() ->> 'role') in ('super_admin', 'admin_pondok')) with check ((auth.jwt() ->> 'role') in ('super_admin', 'admin_pondok'));
create policy "pengelola membaca halaqah" on public.halaqahs for select using (public.is_pengelola());
create policy "pengelola membaca setoran" on public.quran_submissions for select using (public.is_pengelola());

-- Ustadz hanya membaca santri pada halaqah yang diampu dan menulis setoran mereka.
create policy "ustadz membaca santri binaan" on public.students for select using (
  exists (select 1 from public.teachers t join public.halaqahs h on h.ustadz_id = t.id where t.pengguna_id = auth.uid() and h.id = students.halaqah_id)
);
create policy "ustadz membaca setoran binaan" on public.quran_submissions for select using (
  exists (select 1 from public.students s join public.halaqahs h on h.id = s.halaqah_id join public.teachers t on t.id = h.ustadz_id where s.id = quran_submissions.santri_id and t.pengguna_id = auth.uid())
);
create policy "ustadz menambah setoran binaan" on public.quran_submissions for insert with check (
  exists (select 1 from public.students s join public.halaqahs h on h.id = s.halaqah_id join public.teachers t on t.id = h.ustadz_id where s.id = quran_submissions.santri_id and t.pengguna_id = auth.uid())
);

-- Wali hanya melihat anak dan laporan mereka sendiri.
create policy "wali membaca anak" on public.students for select using (
  exists (select 1 from public.parents p where p.id = students.wali_id and p.pengguna_id = auth.uid())
);
create policy "wali membaca setoran anak" on public.quran_submissions for select using (
  exists (select 1 from public.students s join public.parents p on p.id = s.wali_id where s.id = quran_submissions.santri_id and p.pengguna_id = auth.uid())
);
create policy "pengguna membaca notifikasi sendiri" on public.notifications for select using (pengguna_id = auth.uid());
create policy "pengguna memperbarui notifikasi sendiri" on public.notifications for update using (pengguna_id = auth.uid()) with check (pengguna_id = auth.uid());

-- Tambahkan kebijakan serupa untuk kelas, asrama, program, dan tabel lain sesuai kebutuhan pondok.

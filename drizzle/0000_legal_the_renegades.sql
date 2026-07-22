CREATE TYPE "public"."jenis_kelamin" AS ENUM('putra', 'putri');--> statement-breakpoint
CREATE TYPE "public"."status_murajaah" AS ENUM('terjadwal', 'selesai', 'terlewat');--> statement-breakpoint
CREATE TYPE "public"."jenis_program" AS ENUM('quran', 'murajaah', 'hadits', 'matan', 'nazham', 'kitab');--> statement-breakpoint
CREATE TYPE "public"."peran_pengguna" AS ENUM('super_admin', 'admin_pondok', 'ustadz', 'santri', 'wali', 'pimpinan');--> statement-breakpoint
CREATE TYPE "public"."status_setoran" AS ENUM('lulus', 'mengulang', 'perlu_murajaah', 'belum_lancar');--> statement-breakpoint
CREATE TYPE "public"."jenis_setoran_quran" AS ENUM('hafalan_baru', 'murajaah', 'tasmi', 'perbaikan', 'ujian_juz_surah');--> statement-breakpoint
CREATE TABLE "academic_years" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(40) NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"tanggal_mulai" date NOT NULL,
	"tanggal_selesai" date NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "academic_years_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(80) NOT NULL,
	"tingkatan" varchar(50),
	"tahun_ajaran_id" uuid,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "classes_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "dorms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(100) NOT NULL,
	"gedung" varchar(80),
	"kapasitas" integer DEFAULT 0 NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "dorms_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "halaqahs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(110) NOT NULL,
	"ustadz_id" uuid,
	"jenis_kelamin" "jenis_kelamin" NOT NULL,
	"tempat_setoran" varchar(140),
	"jadwal" varchar(140),
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "halaqahs_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "kitab_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"santri_id" uuid NOT NULL,
	"ustadz_id" uuid,
	"program_id" uuid,
	"tanggal_setoran" date NOT NULL,
	"nama_kitab" varchar(160) NOT NULL,
	"bab_pasal_bait" varchar(180) NOT NULL,
	"nilai_hafalan" integer NOT NULL,
	"nilai_bacaan" integer NOT NULL,
	"nilai_pemahaman" integer NOT NULL,
	"status" "status_setoran" NOT NULL,
	"catatan" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "murajaah_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"santri_id" uuid NOT NULL,
	"setoran_quran_id" uuid,
	"tanggal_jadwal" date NOT NULL,
	"interval_hari" integer DEFAULT 1 NOT NULL,
	"status" "status_murajaah" DEFAULT 'terjadwal' NOT NULL,
	"catatan_hasil" text,
	"selesai_pada" timestamp with time zone,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pengguna_id" uuid NOT NULL,
	"judul" varchar(180) NOT NULL,
	"pesan" text NOT NULL,
	"tautan" varchar(240),
	"sudah_dibaca" boolean DEFAULT false NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "parents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pengguna_id" uuid,
	"nama" varchar(160) NOT NULL,
	"hubungan" varchar(50) DEFAULT 'Orang Tua' NOT NULL,
	"nomor_telepon" varchar(32),
	"alamat" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "parents_pengguna_id_unique" UNIQUE("pengguna_id")
);
--> statement-breakpoint
CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(150) NOT NULL,
	"jenis" "jenis_program" NOT NULL,
	"deskripsi" text,
	"satuan_target" varchar(40) DEFAULT 'halaman' NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "programs_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "quran_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"santri_id" uuid NOT NULL,
	"ustadz_id" uuid,
	"program_id" uuid,
	"tanggal_setoran" date NOT NULL,
	"jenis" "jenis_setoran_quran" DEFAULT 'hafalan_baru' NOT NULL,
	"surah" varchar(90) NOT NULL,
	"ayat_awal" integer NOT NULL,
	"ayat_akhir" integer NOT NULL,
	"nilai_kelancaran" integer NOT NULL,
	"nilai_tajwid" integer NOT NULL,
	"nilai_makhraj" integer NOT NULL,
	"status" "status_setoran" NOT NULL,
	"catatan_ustadz" text,
	"url_audio" text,
	"catatan_akhlak" varchar(300),
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"santri_id" uuid NOT NULL,
	"tahun_ajaran_id" uuid,
	"periode" varchar(80) NOT NULL,
	"ringkasan" text NOT NULL,
	"rekomendasi" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pengguna_id" uuid,
	"nis" varchar(60) NOT NULL,
	"nama" varchar(160) NOT NULL,
	"jenis_kelamin" "jenis_kelamin" NOT NULL,
	"tempat_lahir" varchar(120),
	"tanggal_lahir" date,
	"kelas_id" uuid,
	"asrama_id" uuid,
	"halaqah_id" uuid,
	"wali_id" uuid,
	"tahun_masuk" varchar(10),
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_pengguna_id_unique" UNIQUE("pengguna_id"),
	CONSTRAINT "students_nis_unique" UNIQUE("nis")
);
--> statement-breakpoint
CREATE TABLE "targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"santri_id" uuid,
	"halaqah_id" uuid,
	"tahun_ajaran_id" uuid,
	"target_harian" numeric(8, 2) DEFAULT '0' NOT NULL,
	"target_mingguan" numeric(8, 2) DEFAULT '0' NOT NULL,
	"target_bulanan" numeric(8, 2) DEFAULT '0' NOT NULL,
	"catatan" text,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pengguna_id" uuid,
	"nip" varchar(50) NOT NULL,
	"nama" varchar(160) NOT NULL,
	"jenis_kelamin" "jenis_kelamin" NOT NULL,
	"keahlian" varchar(140),
	"nomor_telepon" varchar(32),
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "teachers_pengguna_id_unique" UNIQUE("pengguna_id"),
	CONSTRAINT "teachers_nip_unique" UNIQUE("nip")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(160) NOT NULL,
	"email" varchar(180) NOT NULL,
	"kata_sandi" varchar(180) NOT NULL,
	"peran" "peran_pengguna" DEFAULT 'ustadz' NOT NULL,
	"nomor_telepon" varchar(32),
	"url_avatar" text,
	"aktif" boolean DEFAULT true NOT NULL,
	"dibuat_pada" timestamp with time zone DEFAULT now() NOT NULL,
	"diubah_pada" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "classes" ADD CONSTRAINT "classes_tahun_ajaran_id_academic_years_id_fk" FOREIGN KEY ("tahun_ajaran_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "halaqahs" ADD CONSTRAINT "halaqahs_ustadz_id_teachers_id_fk" FOREIGN KEY ("ustadz_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kitab_submissions" ADD CONSTRAINT "kitab_submissions_santri_id_students_id_fk" FOREIGN KEY ("santri_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kitab_submissions" ADD CONSTRAINT "kitab_submissions_ustadz_id_teachers_id_fk" FOREIGN KEY ("ustadz_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kitab_submissions" ADD CONSTRAINT "kitab_submissions_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "murajaah_schedules" ADD CONSTRAINT "murajaah_schedules_santri_id_students_id_fk" FOREIGN KEY ("santri_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "murajaah_schedules" ADD CONSTRAINT "murajaah_schedules_setoran_quran_id_quran_submissions_id_fk" FOREIGN KEY ("setoran_quran_id") REFERENCES "public"."quran_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_pengguna_id_users_id_fk" FOREIGN KEY ("pengguna_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parents" ADD CONSTRAINT "parents_pengguna_id_users_id_fk" FOREIGN KEY ("pengguna_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_submissions" ADD CONSTRAINT "quran_submissions_santri_id_students_id_fk" FOREIGN KEY ("santri_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_submissions" ADD CONSTRAINT "quran_submissions_ustadz_id_teachers_id_fk" FOREIGN KEY ("ustadz_id") REFERENCES "public"."teachers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_submissions" ADD CONSTRAINT "quran_submissions_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_santri_id_students_id_fk" FOREIGN KEY ("santri_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_tahun_ajaran_id_academic_years_id_fk" FOREIGN KEY ("tahun_ajaran_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_pengguna_id_users_id_fk" FOREIGN KEY ("pengguna_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_kelas_id_classes_id_fk" FOREIGN KEY ("kelas_id") REFERENCES "public"."classes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_asrama_id_dorms_id_fk" FOREIGN KEY ("asrama_id") REFERENCES "public"."dorms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_halaqah_id_halaqahs_id_fk" FOREIGN KEY ("halaqah_id") REFERENCES "public"."halaqahs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_wali_id_parents_id_fk" FOREIGN KEY ("wali_id") REFERENCES "public"."parents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_santri_id_students_id_fk" FOREIGN KEY ("santri_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_halaqah_id_halaqahs_id_fk" FOREIGN KEY ("halaqah_id") REFERENCES "public"."halaqahs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "targets" ADD CONSTRAINT "targets_tahun_ajaran_id_academic_years_id_fk" FOREIGN KEY ("tahun_ajaran_id") REFERENCES "public"."academic_years"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_pengguna_id_users_id_fk" FOREIGN KEY ("pengguna_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
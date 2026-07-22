import {
  boolean,
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("peran_pengguna", [
  "super_admin",
  "admin_pondok",
  "ustadz",
  "santri",
  "wali",
  "pimpinan",
]);

export const genderEnum = pgEnum("jenis_kelamin", ["putra", "putri"]);
export const submissionTypeEnum = pgEnum("jenis_setoran_quran", [
  "hafalan_baru",
  "murajaah",
  "tasmi",
  "perbaikan",
  "ujian_juz_surah",
]);
export const submissionStatusEnum = pgEnum("status_setoran", [
  "lulus",
  "mengulang",
  "perlu_murajaah",
  "belum_lancar",
]);
export const programTypeEnum = pgEnum("jenis_program", [
  "quran",
  "murajaah",
  "hadits",
  "matan",
  "nazham",
  "kitab",
]);
export const murajaahStatusEnum = pgEnum("status_murajaah", [
  "terjadwal",
  "selesai",
  "terlewat",
]);

const auditColumns = {
  createdAt: timestamp("dibuat_pada", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("diubah_pada", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("nama", { length: 160 }).notNull(),
  email: varchar("email", { length: 180 }).notNull().unique(),
  password: varchar("kata_sandi", { length: 180 }).notNull(),
  role: roleEnum("peran").notNull().default("ustadz"),
  phone: varchar("nomor_telepon", { length: 32 }),
  avatarUrl: text("url_avatar"),
  isActive: boolean("aktif").notNull().default(true),
  ...auditColumns,
});

export const academicYears = pgTable("academic_years", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("nama", { length: 40 }).notNull().unique(),
  isActive: boolean("aktif").notNull().default(true),
  startDate: date("tanggal_mulai").notNull(),
  endDate: date("tanggal_selesai").notNull(),
  ...auditColumns,
});

export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("nama", { length: 80 }).notNull().unique(),
  level: varchar("tingkatan", { length: 50 }),
  academicYearId: uuid("tahun_ajaran_id").references(() => academicYears.id, { onDelete: "set null" }),
  ...auditColumns,
});

export const dorms = pgTable("dorms", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("nama", { length: 100 }).notNull().unique(),
  building: varchar("gedung", { length: 80 }),
  capacity: integer("kapasitas").notNull().default(0),
  ...auditColumns,
});

export const teachers = pgTable("teachers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("pengguna_id").references(() => users.id, { onDelete: "set null" }).unique(),
  nip: varchar("nip", { length: 50 }).notNull().unique(),
  name: varchar("nama", { length: 160 }).notNull(),
  gender: genderEnum("jenis_kelamin").notNull(),
  specialization: varchar("keahlian", { length: 140 }),
  phone: varchar("nomor_telepon", { length: 32 }),
  isActive: boolean("aktif").notNull().default(true),
  ...auditColumns,
});

export const parents = pgTable("parents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("pengguna_id").references(() => users.id, { onDelete: "set null" }).unique(),
  name: varchar("nama", { length: 160 }).notNull(),
  relation: varchar("hubungan", { length: 50 }).notNull().default("Orang Tua"),
  phone: varchar("nomor_telepon", { length: 32 }),
  address: text("alamat"),
  ...auditColumns,
});

export const halaqahs = pgTable("halaqahs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("nama", { length: 110 }).notNull().unique(),
  teacherId: uuid("ustadz_id").references(() => teachers.id, { onDelete: "set null" }),
  gender: genderEnum("jenis_kelamin").notNull(),
  meetingPlace: varchar("tempat_setoran", { length: 140 }),
  schedule: varchar("jadwal", { length: 140 }),
  isActive: boolean("aktif").notNull().default(true),
  ...auditColumns,
});

export const students = pgTable("students", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("pengguna_id").references(() => users.id, { onDelete: "set null" }).unique(),
  nis: varchar("nis", { length: 60 }).notNull().unique(),
  name: varchar("nama", { length: 160 }).notNull(),
  gender: genderEnum("jenis_kelamin").notNull(),
  birthPlace: varchar("tempat_lahir", { length: 120 }),
  birthDate: date("tanggal_lahir"),
  classId: uuid("kelas_id").references(() => classes.id, { onDelete: "set null" }),
  dormId: uuid("asrama_id").references(() => dorms.id, { onDelete: "set null" }),
  halaqahId: uuid("halaqah_id").references(() => halaqahs.id, { onDelete: "set null" }),
  parentId: uuid("wali_id").references(() => parents.id, { onDelete: "set null" }),
  enrollmentYear: varchar("tahun_masuk", { length: 10 }),
  isActive: boolean("aktif").notNull().default(true),
  ...auditColumns,
});

export const programs = pgTable("programs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("nama", { length: 150 }).notNull().unique(),
  type: programTypeEnum("jenis").notNull(),
  description: text("deskripsi"),
  unit: varchar("satuan_target", { length: 40 }).notNull().default("halaman"),
  isActive: boolean("aktif").notNull().default(true),
  ...auditColumns,
});

export const targets = pgTable("targets", {
  id: uuid("id").defaultRandom().primaryKey(),
  programId: uuid("program_id").notNull().references(() => programs.id, { onDelete: "cascade" }),
  studentId: uuid("santri_id").references(() => students.id, { onDelete: "cascade" }),
  halaqahId: uuid("halaqah_id").references(() => halaqahs.id, { onDelete: "cascade" }),
  academicYearId: uuid("tahun_ajaran_id").references(() => academicYears.id, { onDelete: "set null" }),
  dailyTarget: numeric("target_harian", { precision: 8, scale: 2 }).notNull().default("0"),
  weeklyTarget: numeric("target_mingguan", { precision: 8, scale: 2 }).notNull().default("0"),
  monthlyTarget: numeric("target_bulanan", { precision: 8, scale: 2 }).notNull().default("0"),
  notes: text("catatan"),
  ...auditColumns,
});

export const quranSubmissions = pgTable("quran_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("santri_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  teacherId: uuid("ustadz_id").references(() => teachers.id, { onDelete: "set null" }),
  programId: uuid("program_id").references(() => programs.id, { onDelete: "set null" }),
  submissionDate: date("tanggal_setoran").notNull(),
  type: submissionTypeEnum("jenis").notNull().default("hafalan_baru"),
  surah: varchar("surah", { length: 90 }).notNull(),
  verseStart: integer("ayat_awal").notNull(),
  verseEnd: integer("ayat_akhir").notNull(),
  fluencyScore: integer("nilai_kelancaran").notNull(),
  tajwidScore: integer("nilai_tajwid").notNull(),
  makhrajScore: integer("nilai_makhraj").notNull(),
  status: submissionStatusEnum("status").notNull(),
  notes: text("catatan_ustadz"),
  audioUrl: text("url_audio"),
  characterNote: varchar("catatan_akhlak", { length: 300 }),
  ...auditColumns,
});

export const kitabSubmissions = pgTable("kitab_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("santri_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  teacherId: uuid("ustadz_id").references(() => teachers.id, { onDelete: "set null" }),
  programId: uuid("program_id").references(() => programs.id, { onDelete: "set null" }),
  submissionDate: date("tanggal_setoran").notNull(),
  bookTitle: varchar("nama_kitab", { length: 160 }).notNull(),
  chapter: varchar("bab_pasal_bait", { length: 180 }).notNull(),
  memorizationScore: integer("nilai_hafalan").notNull(),
  readingScore: integer("nilai_bacaan").notNull(),
  understandingScore: integer("nilai_pemahaman").notNull(),
  status: submissionStatusEnum("status").notNull(),
  notes: text("catatan"),
  ...auditColumns,
});

export const murajaahSchedules = pgTable("murajaah_schedules", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("santri_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  quranSubmissionId: uuid("setoran_quran_id").references(() => quranSubmissions.id, { onDelete: "cascade" }),
  dueDate: date("tanggal_jadwal").notNull(),
  intervalDays: integer("interval_hari").notNull().default(1),
  status: murajaahStatusEnum("status").notNull().default("terjadwal"),
  resultNote: text("catatan_hasil"),
  completedAt: timestamp("selesai_pada", { withTimezone: true }),
  ...auditColumns,
});

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  studentId: uuid("santri_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  academicYearId: uuid("tahun_ajaran_id").references(() => academicYears.id, { onDelete: "set null" }),
  period: varchar("periode", { length: 80 }).notNull(),
  summary: text("ringkasan").notNull(),
  recommendation: text("rekomendasi"),
  generatedAt: timestamp("dibuat_pada", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("pengguna_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("judul", { length: 180 }).notNull(),
  message: text("pesan").notNull(),
  link: varchar("tautan", { length: 240 }),
  isRead: boolean("sudah_dibaca").notNull().default(false),
  ...auditColumns,
});

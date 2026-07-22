import "dotenv/config";
import { db, pool } from "@/db";
import {
  academicYears,
  classes,
  dorms,
  halaqahs,
  murajaahSchedules,
  notifications,
  parents,
  programs,
  quranSubmissions,
  students,
  targets,
  teachers,
  users,
} from "@/db/schema";

const isoDate = (offset = 0) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

async function seed() {
  await db.delete(murajaahSchedules);
  await db.delete(quranSubmissions);
  await db.delete(targets);
  await db.delete(notifications);
  await db.delete(students);
  await db.delete(halaqahs);
  await db.delete(teachers);
  await db.delete(parents);
  await db.delete(classes);
  await db.delete(dorms);
  await db.delete(programs);
  await db.delete(academicYears);
  await db.delete(users);

  const [admin, pondokAdmin, ustadzAhmad, ustadzFatimah, waliAisyah, waliZaid, pimpinan] = await db
    .insert(users)
    .values([
      { name: "Ahmad Fauzan", email: "admin@mutabaah.test", password: "mutabaah123", role: "super_admin", phone: "0812-0000-0001" },
      { name: "Nabila Rahmah", email: "pondok@mutabaah.test", password: "mutabaah123", role: "admin_pondok", phone: "0812-0000-0002" },
      { name: "Ustadz Ahmad Hakim", email: "ahmad@mutabaah.test", password: "mutabaah123", role: "ustadz", phone: "0812-0000-0003" },
      { name: "Ustadzah Fatimah", email: "fatimah@mutabaah.test", password: "mutabaah123", role: "ustadz", phone: "0812-0000-0004" },
      { name: "Bpk. Abdullah", email: "wali.aisyah@mutabaah.test", password: "mutabaah123", role: "wali", phone: "0812-0000-0005" },
      { name: "Ibu Maryam", email: "wali.zaid@mutabaah.test", password: "mutabaah123", role: "wali", phone: "0812-0000-0006" },
      { name: "KH. Hasan Basri", email: "pimpinan@mutabaah.test", password: "mutabaah123", role: "pimpinan", phone: "0812-0000-0007" },
    ])
    .returning();

  const [year] = await db.insert(academicYears).values({ name: "2025/2026", startDate: "2025-07-01", endDate: "2026-06-30", isActive: true }).returning();
  const [classOne, classTwo] = await db.insert(classes).values([
    { name: "Kelas 1 Tahfidz", level: "Tsanawiyah", academicYearId: year.id },
    { name: "Kelas 2 Tahfidz", level: "Tsanawiyah", academicYearId: year.id },
  ]).returning();
  const [dormA, dormB] = await db.insert(dorms).values([
    { name: "Asrama An-Nur", building: "Gedung A", capacity: 24 },
    { name: "Asrama Al-Hikmah", building: "Gedung B", capacity: 24 },
  ]).returning();
  const [parentA, parentZ] = await db.insert(parents).values([
    { userId: waliAisyah.id, name: "Bpk. Abdullah", relation: "Ayah", phone: "0812-0000-0005", address: "Bandung" },
    { userId: waliZaid.id, name: "Ibu Maryam", relation: "Ibu", phone: "0812-0000-0006", address: "Garut" },
  ]).returning();
  const [teacherA, teacherF] = await db.insert(teachers).values([
    { userId: ustadzAhmad.id, nip: "UST-001", name: "Ustadz Ahmad Hakim", gender: "putra", specialization: "Tahfidz Al-Qur'an", phone: "0812-0000-0003", isActive: true },
    { userId: ustadzFatimah.id, nip: "UST-002", name: "Ustadzah Fatimah", gender: "putri", specialization: "Tahsin & Tahfidz", phone: "0812-0000-0004", isActive: true },
  ]).returning();
  const [halaqahA, halaqahF] = await db.insert(halaqahs).values([
    { name: "Halaqah Al-Fatih", teacherId: teacherA.id, gender: "putra", meetingPlace: "Masjid Utama", schedule: "Ba'da Subuh", isActive: true },
    { name: "Halaqah An-Nisa", teacherId: teacherF.id, gender: "putri", meetingPlace: "Aula Putri", schedule: "Ba'da Ashar", isActive: true },
  ]).returning();
  const [quranProgram, murajaahProgram, haditsProgram] = await db.insert(programs).values([
    { name: "Tahfidz Al-Qur'an", type: "quran", description: "Program hafalan Al-Qur'an bertahap", unit: "ayat", isActive: true },
    { name: "Muraja'ah Al-Qur'an", type: "murajaah", description: "Penguatan hafalan berkala", unit: "halaman", isActive: true },
    { name: "Hadits Arbain", type: "hadits", description: "Hafalan hadits pilihan", unit: "hadits", isActive: true },
  ]).returning();
  const [aisyah, maryam, zaid, yusuf, hafshah] = await db.insert(students).values([
    { nis: "ST-25001", name: "Aisyah Rahma", gender: "putri", classId: classOne.id, dormId: dormB.id, halaqahId: halaqahF.id, parentId: parentA.id, enrollmentYear: "2025", isActive: true },
    { nis: "ST-25002", name: "Maryam Zahra", gender: "putri", classId: classOne.id, dormId: dormB.id, halaqahId: halaqahF.id, parentId: parentA.id, enrollmentYear: "2025", isActive: true },
    { nis: "ST-25003", name: "Zaid Al-Karim", gender: "putra", classId: classOne.id, dormId: dormA.id, halaqahId: halaqahA.id, parentId: parentZ.id, enrollmentYear: "2025", isActive: true },
    { nis: "ST-25004", name: "Yusuf Maulana", gender: "putra", classId: classTwo.id, dormId: dormA.id, halaqahId: halaqahA.id, parentId: parentZ.id, enrollmentYear: "2025", isActive: true },
    { nis: "ST-25005", name: "Hafshah Anwar", gender: "putri", classId: classTwo.id, dormId: dormB.id, halaqahId: halaqahF.id, parentId: parentA.id, enrollmentYear: "2025", isActive: true },
  ]).returning();

  await db.insert(targets).values([
    { programId: quranProgram.id, studentId: aisyah.id, academicYearId: year.id, dailyTarget: "5", weeklyTarget: "25", monthlyTarget: "100", notes: "Target adaptif berdasarkan kelancaran." },
    { programId: quranProgram.id, studentId: zaid.id, academicYearId: year.id, dailyTarget: "5", weeklyTarget: "25", monthlyTarget: "100", notes: "Fokus perbaikan tajwid." },
    { programId: murajaahProgram.id, halaqahId: halaqahA.id, academicYearId: year.id, dailyTarget: "2", weeklyTarget: "12", monthlyTarget: "50", notes: "Dua halaman per hari." },
  ]);

  const submissions = await db.insert(quranSubmissions).values([
    { studentId: aisyah.id, teacherId: teacherF.id, programId: quranProgram.id, submissionDate: isoDate(0), type: "hafalan_baru", surah: "Al-Mulk", verseStart: 1, verseEnd: 10, fluencyScore: 94, tajwidScore: 92, makhrajScore: 93, status: "lulus", notes: "MasyaAllah, setoran sangat stabil.", characterNote: "Datang tepat waktu dan siap belajar." },
    { studentId: aisyah.id, teacherId: teacherF.id, programId: quranProgram.id, submissionDate: isoDate(-2), type: "hafalan_baru", surah: "Al-Mulk", verseStart: 11, verseEnd: 20, fluencyScore: 90, tajwidScore: 91, makhrajScore: 90, status: "lulus", notes: "Pertahankan waqaf yang baik.", characterNote: "Sangat fokus." },
    { studentId: maryam.id, teacherId: teacherF.id, programId: quranProgram.id, submissionDate: isoDate(-1), type: "murajaah", surah: "Al-Qalam", verseStart: 1, verseEnd: 12, fluencyScore: 82, tajwidScore: 85, makhrajScore: 84, status: "perlu_murajaah", notes: "Ulangi sambungan ayat 7–10.", characterNote: "Perlu lebih percaya diri." },
    { studentId: zaid.id, teacherId: teacherA.id, programId: quranProgram.id, submissionDate: isoDate(0), type: "hafalan_baru", surah: "Al-Muzzammil", verseStart: 1, verseEnd: 8, fluencyScore: 88, tajwidScore: 89, makhrajScore: 87, status: "lulus", notes: "Bagus, lanjutkan pengulangan malam ini.", characterNote: "Adab setoran baik." },
    { studentId: zaid.id, teacherId: teacherA.id, programId: quranProgram.id, submissionDate: isoDate(-3), type: "hafalan_baru", surah: "Al-Muzzammil", verseStart: 9, verseEnd: 15, fluencyScore: 76, tajwidScore: 80, makhrajScore: 79, status: "mengulang", notes: "Perbaiki kelancaran pada ayat 12–14.", characterNote: "Tetap semangat saat mengulang." },
    { studentId: yusuf.id, teacherId: teacherA.id, programId: quranProgram.id, submissionDate: isoDate(-4), type: "tasmi", surah: "Al-Jinn", verseStart: 1, verseEnd: 10, fluencyScore: 91, tajwidScore: 88, makhrajScore: 90, status: "lulus", notes: "Sambungan ayat cukup kuat.", characterNote: "Aktif menyimak teman." },
    { studentId: hafshah.id, teacherId: teacherF.id, programId: quranProgram.id, submissionDate: isoDate(-5), type: "perbaikan", surah: "Al-Muddassir", verseStart: 1, verseEnd: 7, fluencyScore: 72, tajwidScore: 78, makhrajScore: 75, status: "belum_lancar", notes: "Ulangi dengan pendampingan mushaf.", characterNote: "Perlu meningkatkan kesiapan." },
  ]).returning();

  await db.insert(murajaahSchedules).values([
    { studentId: aisyah.id, quranSubmissionId: submissions[1].id, dueDate: isoDate(0), intervalDays: 3, status: "terjadwal" },
    { studentId: zaid.id, quranSubmissionId: submissions[3].id, dueDate: isoDate(0), intervalDays: 3, status: "terjadwal" },
    { studentId: maryam.id, quranSubmissionId: submissions[2].id, dueDate: isoDate(-1), intervalDays: 1, status: "terjadwal" },
    { studentId: yusuf.id, quranSubmissionId: submissions[5].id, dueDate: isoDate(2), intervalDays: 7, status: "terjadwal" },
    { studentId: hafshah.id, quranSubmissionId: submissions[6].id, dueDate: isoDate(0), intervalDays: 7, status: "terjadwal" },
  ]);

  await db.insert(notifications).values([
    { userId: ustadzAhmad.id, title: "Muraja'ah perlu ditindaklanjuti", message: "Ada 2 santri halaqah Anda dengan jadwal muraja'ah hari ini.", link: "/murajaah" },
    { userId: waliAisyah.id, title: "Setoran baru Aisyah", message: "Aisyah menyelesaikan setoran Al-Mulk ayat 1–10 dengan hasil sangat baik.", link: "/portal-wali" },
    { userId: pimpinan.id, title: "Ringkasan halaqah tersedia", message: "Dashboard performa halaqah telah diperbarui hari ini.", link: "/dashboard" },
  ]);

  console.log("Seed MutabaahSantri selesai. Semua akun menggunakan kata sandi: mutabaah123");
  console.log("Login admin: admin@mutabaah.test | Login ustadz: ahmad@mutabaah.test | Login wali: wali.aisyah@mutabaah.test");
}

seed().catch((error) => {
  console.error("Seed gagal:", error);
  process.exitCode = 1;
}).finally(async () => {
  await pool.end();
});

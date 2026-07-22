"use server";

import { clearSession, canInputSubmission, canManageData, getCurrentUser, setSession } from "@/lib/auth";
import { getTeacherForUser } from "@/lib/data";
import { db } from "@/db";
import {
  academicYears,
  halaqahs,
  murajaahSchedules,
  notifications,
  programs,
  quranSubmissions,
  students,
  targets,
  teachers,
  users,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const safeText = (value: FormDataEntryValue | null) => (typeof value === "string" ? value.trim() : "");
const optionalText = (value: FormDataEntryValue | null) => {
  const result = safeText(value);
  return result || null;
};

function redirectWithError(path: string, message: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}galat=${encodeURIComponent(message)}`);
}

function redirectWithSuccess(path: string, message: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}pesan=${encodeURIComponent(message)}`);
}

async function requireManager() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (!canManageData(user.role)) redirectWithError("/dashboard", "Anda tidak memiliki akses untuk mengelola data.");
  return user;
}

export async function loginAction(formData: FormData) {
  const email = safeText(formData.get("email")).toLowerCase();
  const password = safeText(formData.get("password"));
  if (!email || !password) redirectWithError("/masuk", "Email dan kata sandi wajib diisi.");

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || user.password !== password || !user.isActive) {
    redirectWithError("/masuk", "Email, kata sandi, atau status akun tidak valid.");
  }
  await setSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/masuk?pesan=Anda%20telah%20keluar%20dari%20aplikasi.");
}

export async function createStudentAction(formData: FormData) {
  await requireManager();
  const parsed = z.object({
    nis: z.string().min(3, "NIS minimal 3 karakter"),
    name: z.string().min(3, "Nama santri minimal 3 karakter"),
    gender: z.enum(["putra", "putri"]),
    classId: z.string().uuid().nullable(),
    dormId: z.string().uuid().nullable(),
    halaqahId: z.string().uuid().nullable(),
    parentId: z.string().uuid().nullable(),
    enrollmentYear: z.string().max(10).nullable(),
  }).safeParse({
    nis: safeText(formData.get("nis")),
    name: safeText(formData.get("name")),
    gender: safeText(formData.get("gender")),
    classId: optionalText(formData.get("classId")),
    dormId: optionalText(formData.get("dormId")),
    halaqahId: optionalText(formData.get("halaqahId")),
    parentId: optionalText(formData.get("parentId")),
    enrollmentYear: optionalText(formData.get("enrollmentYear")),
  });
  if (!parsed.success) redirectWithError("/master-data", parsed.error.issues[0]?.message ?? "Data santri belum valid.");
  try {
    await db.insert(students).values({ ...parsed.data, isActive: true });
  } catch {
    redirectWithError("/master-data", "NIS sudah digunakan atau data referensi tidak ditemukan.");
  }
  revalidatePath("/master-data");
  revalidatePath("/dashboard");
  redirectWithSuccess("/master-data", "Data santri berhasil ditambahkan.");
}

export async function toggleStudentAction(formData: FormData) {
  await requireManager();
  const id = safeText(formData.get("id"));
  const active = safeText(formData.get("active")) === "true";
  if (!id) redirectWithError("/master-data", "Santri tidak ditemukan.");
  await db.update(students).set({ isActive: !active, updatedAt: new Date() }).where(eq(students.id, id));
  revalidatePath("/master-data");
  revalidatePath("/dashboard");
  redirectWithSuccess("/master-data", `Akun santri berhasil ${active ? "dinonaktifkan" : "diaktifkan"}.`);
}

export async function createTeacherAction(formData: FormData) {
  await requireManager();
  const parsed = z.object({
    nip: z.string().min(3, "NIP minimal 3 karakter"),
    name: z.string().min(3, "Nama ustadz minimal 3 karakter"),
    gender: z.enum(["putra", "putri"]),
    specialization: z.string().nullable(),
    phone: z.string().nullable(),
  }).safeParse({
    nip: safeText(formData.get("nip")),
    name: safeText(formData.get("name")),
    gender: safeText(formData.get("gender")),
    specialization: optionalText(formData.get("specialization")),
    phone: optionalText(formData.get("phone")),
  });
  if (!parsed.success) redirectWithError("/master-data", parsed.error.issues[0]?.message ?? "Data ustadz belum valid.");
  try {
    await db.insert(teachers).values({ ...parsed.data, isActive: true });
  } catch {
    redirectWithError("/master-data", "NIP sudah digunakan.");
  }
  revalidatePath("/master-data");
  redirectWithSuccess("/master-data", "Data ustadz berhasil ditambahkan.");
}

export async function createHalaqahAction(formData: FormData) {
  await requireManager();
  const parsed = z.object({
    name: z.string().min(3, "Nama halaqah minimal 3 karakter"),
    gender: z.enum(["putra", "putri"]),
    teacherId: z.string().uuid().nullable(),
    meetingPlace: z.string().nullable(),
    schedule: z.string().nullable(),
  }).safeParse({
    name: safeText(formData.get("name")),
    gender: safeText(formData.get("gender")),
    teacherId: optionalText(formData.get("teacherId")),
    meetingPlace: optionalText(formData.get("meetingPlace")),
    schedule: optionalText(formData.get("schedule")),
  });
  if (!parsed.success) redirectWithError("/master-data", parsed.error.issues[0]?.message ?? "Data halaqah belum valid.");
  try {
    await db.insert(halaqahs).values({ ...parsed.data, isActive: true });
  } catch {
    redirectWithError("/master-data", "Nama halaqah sudah digunakan.");
  }
  revalidatePath("/master-data");
  revalidatePath("/dashboard");
  redirectWithSuccess("/master-data", "Halaqah berhasil dibuat dan siap digunakan.");
}

export async function createQuranSubmissionAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (!canInputSubmission(user.role)) redirectWithError("/dashboard", "Anda tidak memiliki akses untuk menginput setoran.");

  const parsed = z.object({
    studentId: z.string().uuid(),
    teacherId: z.string().uuid().nullable(),
    programId: z.string().uuid().nullable(),
    submissionDate: z.string().date(),
    type: z.enum(["hafalan_baru", "murajaah", "tasmi", "perbaikan", "ujian_juz_surah"]),
    surah: z.string().min(2, "Nama surah wajib diisi"),
    verseStart: z.coerce.number().int().positive("Ayat awal harus lebih dari 0"),
    verseEnd: z.coerce.number().int().positive("Ayat akhir harus lebih dari 0"),
    fluencyScore: z.coerce.number().int().min(0).max(100),
    tajwidScore: z.coerce.number().int().min(0).max(100),
    makhrajScore: z.coerce.number().int().min(0).max(100),
    status: z.enum(["lulus", "mengulang", "perlu_murajaah", "belum_lancar"]),
    notes: z.string().max(1200).nullable(),
    characterNote: z.string().max(300).nullable(),
  }).superRefine((values, context) => {
    if (values.verseEnd < values.verseStart) context.addIssue({ code: "custom", path: ["verseEnd"], message: "Ayat akhir harus sama atau lebih besar dari ayat awal" });
  }).safeParse({
    studentId: safeText(formData.get("studentId")),
    teacherId: optionalText(formData.get("teacherId")),
    programId: optionalText(formData.get("programId")),
    submissionDate: safeText(formData.get("submissionDate")),
    type: safeText(formData.get("type")),
    surah: safeText(formData.get("surah")),
    verseStart: safeText(formData.get("verseStart")),
    verseEnd: safeText(formData.get("verseEnd")),
    fluencyScore: safeText(formData.get("fluencyScore")),
    tajwidScore: safeText(formData.get("tajwidScore")),
    makhrajScore: safeText(formData.get("makhrajScore")),
    status: safeText(formData.get("status")),
    notes: optionalText(formData.get("notes")),
    characterNote: optionalText(formData.get("characterNote")),
  });
  if (!parsed.success) redirectWithError("/setoran", parsed.error.issues[0]?.message ?? "Data setoran belum valid.");

  const currentTeacher = await getTeacherForUser(user.id);
  const teacherId = user.role === "ustadz" ? currentTeacher?.id ?? null : parsed.data.teacherId;
  const [submission] = await db.insert(quranSubmissions).values({ ...parsed.data, teacherId }).returning({ id: quranSubmissions.id });

  if (submission) {
    const base = new Date(`${parsed.data.submissionDate}T12:00:00`);
    const scheduleValues = [1, 3, 7, 30].map((intervalDays) => {
      const due = new Date(base);
      due.setDate(due.getDate() + intervalDays);
      return { studentId: parsed.data.studentId, quranSubmissionId: submission.id, dueDate: due.toISOString().slice(0, 10), intervalDays, status: "terjadwal" as const };
    });
    await db.insert(murajaahSchedules).values(scheduleValues);
  }

  revalidatePath("/setoran");
  revalidatePath("/dashboard");
  revalidatePath("/murajaah");
  revalidatePath("/progress");
  revalidatePath(`/santri/${parsed.data.studentId}`);
  redirectWithSuccess("/setoran", "Setoran berhasil disimpan dan jadwal muraja'ah otomatis dibuat.");
}

export async function completeMurajaahAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user || !canInputSubmission(user.role)) redirectWithError("/murajaah", "Anda tidak memiliki akses untuk memperbarui muraja'ah.");
  const id = safeText(formData.get("id"));
  const resultNote = optionalText(formData.get("resultNote"));
  if (!id) redirectWithError("/murajaah", "Jadwal muraja'ah tidak ditemukan.");
  await db.update(murajaahSchedules).set({ status: "selesai", resultNote, completedAt: new Date(), updatedAt: new Date() }).where(eq(murajaahSchedules.id, id));
  revalidatePath("/murajaah");
  revalidatePath("/dashboard");
  redirectWithSuccess("/murajaah", "Muraja'ah ditandai selesai.");
}

export async function createProgramAction(formData: FormData) {
  await requireManager();
  const parsed = z.object({ name: z.string().min(3), type: z.enum(["quran", "murajaah", "hadits", "matan", "nazham", "kitab"]), unit: z.string().min(1), description: z.string().nullable() }).safeParse({ name: safeText(formData.get("name")), type: safeText(formData.get("type")), unit: safeText(formData.get("unit")), description: optionalText(formData.get("description")) });
  if (!parsed.success) redirectWithError("/pengaturan", "Data program belum valid.");
  try { await db.insert(programs).values({ ...parsed.data, isActive: true }); } catch { redirectWithError("/pengaturan", "Nama program sudah digunakan."); }
  revalidatePath("/pengaturan");
  revalidatePath("/setoran");
  redirectWithSuccess("/pengaturan", "Program hafalan berhasil ditambahkan.");
}

export async function createTargetAction(formData: FormData) {
  await requireManager();
  const parsed = z.object({ programId: z.string().uuid(), studentId: z.string().uuid().nullable(), halaqahId: z.string().uuid().nullable(), dailyTarget: z.coerce.number().min(0), weeklyTarget: z.coerce.number().min(0), monthlyTarget: z.coerce.number().min(0), notes: z.string().nullable() }).safeParse({ programId: safeText(formData.get("programId")), studentId: optionalText(formData.get("studentId")), halaqahId: optionalText(formData.get("halaqahId")), dailyTarget: safeText(formData.get("dailyTarget")), weeklyTarget: safeText(formData.get("weeklyTarget")), monthlyTarget: safeText(formData.get("monthlyTarget")), notes: optionalText(formData.get("notes")) });
  if (!parsed.success || (!parsed.data.studentId && !parsed.data.halaqahId)) redirectWithError("/pengaturan", "Pilih santri atau halaqah serta isi target yang valid.");
  await db.insert(targets).values({ ...parsed.data, dailyTarget: String(parsed.data.dailyTarget), weeklyTarget: String(parsed.data.weeklyTarget), monthlyTarget: String(parsed.data.monthlyTarget) });
  revalidatePath("/pengaturan");
  revalidatePath("/dashboard");
  redirectWithSuccess("/pengaturan", "Target berhasil disimpan.");
}

export async function markNotificationReadAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  const id = safeText(formData.get("id"));
  if (id) await db.update(notifications).set({ isRead: true, updatedAt: new Date() }).where(and(eq(notifications.id, id), eq(notifications.userId, user.id)));
  revalidatePath("/pengaturan");
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = safeText(formData.get("email")).toLowerCase();
  if (!email) redirectWithError("/lupa-kata-sandi", "Masukkan alamat email Anda.");
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (user) {
    await db.insert(notifications).values({ userId: user.id, title: "Permintaan pengaturan ulang kata sandi", message: "Permintaan Anda telah diterima. Hubungi Admin Pondok untuk pengaturan ulang kata sandi pada instalasi demo ini.", link: "/pengaturan" });
  }
  redirectWithSuccess("/masuk", "Jika email terdaftar, instruksi pengaturan ulang telah dikirimkan.");
}

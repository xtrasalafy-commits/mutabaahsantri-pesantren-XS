import { db } from "@/db";
import {
  academicYears,
  classes,
  dorms,
  halaqahs,
  kitabSubmissions,
  murajaahSchedules,
  notifications,
  parents,
  programs,
  quranSubmissions,
  students,
  targets,
  teachers,
} from "@/db/schema";
import { and, count, desc, eq, gte, inArray, isNotNull, lt, ne, or, sql } from "drizzle-orm";
import { tanggalHariIni } from "@/lib/utils";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin_pondok" | "ustadz" | "santri" | "wali" | "pimpinan";
  phone: string | null;
  isActive: boolean;
};

const buildProgress = (submissionRows: Array<{ status: string; surah: string; verseStart: number; verseEnd: number }>) => {
  const passed = submissionRows.filter((item) => item.status === "lulus");
  const verses = passed.reduce((sum, item) => sum + Math.max(0, item.verseEnd - item.verseStart + 1), 0);
  const percentage = Math.min(100, Number(((verses / 6236) * 100).toFixed(2)));
  const surahs = Array.from(new Set(passed.map((item) => item.surah)));
  return { verses, percentage, surahCount: surahs.length, surahs };
};

export async function getTeacherForUser(userId: string) {
  const [teacher] = await db.select().from(teachers).where(eq(teachers.userId, userId)).limit(1);
  return teacher ?? null;
}

export async function getParentForUser(userId: string) {
  const [parent] = await db.select().from(parents).where(eq(parents.userId, userId)).limit(1);
  return parent ?? null;
}

export async function getNotifications(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(5);
}

export async function getDashboardData(user: AppUser) {
  const today = tanggalHariIni();
  const teacher = user.role === "ustadz" ? await getTeacherForUser(user.id) : null;
  const scopeHalaqah = teacher
    ? await db.select({ id: halaqahs.id }).from(halaqahs).where(eq(halaqahs.teacherId, teacher.id))
    : [];
  const halaqahIds = scopeHalaqah.map((item) => item.id);

  const allStudents = await db
    .select({
      id: students.id,
      name: students.name,
      nis: students.nis,
      halaqahName: halaqahs.name,
      halaqahId: students.halaqahId,
      parentId: students.parentId,
      userId: students.userId,
      className: classes.name,
      isActive: students.isActive,
    })
    .from(students)
    .leftJoin(halaqahs, eq(students.halaqahId, halaqahs.id))
    .leftJoin(classes, eq(students.classId, classes.id))
    .where(eq(students.isActive, true));

  const parent = user.role === "wali" ? await getParentForUser(user.id) : null;
  const visibleStudents = user.role === "ustadz" && teacher
    ? allStudents.filter((student) => student.halaqahId && halaqahIds.includes(student.halaqahId))
    : user.role === "wali" && parent
      ? allStudents.filter((student) => student.parentId === parent.id)
      : user.role === "santri"
        ? allStudents.filter((student) => student.userId === user.id)
        : allStudents;
  const visibleIds = visibleStudents.map((student) => student.id);

  const currentSubmissions = visibleIds.length
    ? await db
        .select({
          id: quranSubmissions.id,
          studentId: quranSubmissions.studentId,
          date: quranSubmissions.submissionDate,
          status: quranSubmissions.status,
          surah: quranSubmissions.surah,
          verseStart: quranSubmissions.verseStart,
          verseEnd: quranSubmissions.verseEnd,
          fluency: quranSubmissions.fluencyScore,
          tajwid: quranSubmissions.tajwidScore,
          makhraj: quranSubmissions.makhrajScore,
          type: quranSubmissions.type,
          notes: quranSubmissions.notes,
          studentName: students.name,
          teacherName: teachers.name,
        })
        .from(quranSubmissions)
        .leftJoin(students, eq(quranSubmissions.studentId, students.id))
        .leftJoin(teachers, eq(quranSubmissions.teacherId, teachers.id))
        .where(inArray(quranSubmissions.studentId, visibleIds))
        .orderBy(desc(quranSubmissions.submissionDate), desc(quranSubmissions.createdAt))
    : [];

  const todaySubmissions = currentSubmissions.filter((item) => item.date === today);
  const submittedToday = new Set(todaySubmissions.map((item) => item.studentId));
  const attentionStudents = visibleStudents.filter((student) => {
    const latest = currentSubmissions.find((item) => item.studentId === student.id);
    return !latest || latest.status !== "lulus";
  });

  const schedules = visibleIds.length
    ? await db
        .select({
          id: murajaahSchedules.id,
          dueDate: murajaahSchedules.dueDate,
          status: murajaahSchedules.status,
          studentId: students.id,
          studentName: students.name,
          surah: quranSubmissions.surah,
          verseStart: quranSubmissions.verseStart,
          verseEnd: quranSubmissions.verseEnd,
        })
        .from(murajaahSchedules)
        .leftJoin(students, eq(murajaahSchedules.studentId, students.id))
        .leftJoin(quranSubmissions, eq(murajaahSchedules.quranSubmissionId, quranSubmissions.id))
        .where(and(inArray(murajaahSchedules.studentId, visibleIds), eq(murajaahSchedules.status, "terjadwal")))
        .orderBy(murajaahSchedules.dueDate)
    : [];

  const dueToday = schedules.filter((item) => item.dueDate <= today).slice(0, 7);
  const averageScore = currentSubmissions.length
    ? Math.round(currentSubmissions.reduce((sum, item) => sum + (item.fluency + item.tajwid + item.makhraj) / 3, 0) / currentSubmissions.length)
    : 0;

  return {
    students: visibleStudents,
    recentSubmissions: currentSubmissions.slice(0, 8),
    todaySubmissions,
    pendingStudents: visibleStudents.filter((student) => !submittedToday.has(student.id)),
    attentionStudents: attentionStudents.slice(0, 6),
    dueToday,
    stats: {
      studentCount: visibleStudents.length,
      todayCount: todaySubmissions.length,
      pendingCount: visibleStudents.length - submittedToday.size,
      averageScore,
      totalSubmissionCount: currentSubmissions.length,
    },
  };
}

export async function getMasterData() {
  const [studentRows, teacherRows, halaqahRows, classRows, dormRows, parentRows, yearRows, programRows] = await Promise.all([
    db.select({ id: students.id, nis: students.nis, name: students.name, gender: students.gender, isActive: students.isActive, halaqahId: students.halaqahId, className: classes.name, dormName: dorms.name, halaqahName: halaqahs.name, parentName: parents.name }).from(students).leftJoin(classes, eq(students.classId, classes.id)).leftJoin(dorms, eq(students.dormId, dorms.id)).leftJoin(halaqahs, eq(students.halaqahId, halaqahs.id)).leftJoin(parents, eq(students.parentId, parents.id)).orderBy(students.name),
    db.select().from(teachers).orderBy(teachers.name),
    db.select({ id: halaqahs.id, name: halaqahs.name, gender: halaqahs.gender, meetingPlace: halaqahs.meetingPlace, schedule: halaqahs.schedule, teacherId: halaqahs.teacherId, teacherName: teachers.name, isActive: halaqahs.isActive }).from(halaqahs).leftJoin(teachers, eq(halaqahs.teacherId, teachers.id)).orderBy(halaqahs.name),
    db.select().from(classes).orderBy(classes.name),
    db.select().from(dorms).orderBy(dorms.name),
    db.select().from(parents).orderBy(parents.name),
    db.select().from(academicYears).orderBy(desc(academicYears.startDate)),
    db.select().from(programs).orderBy(programs.name),
  ]);
  return { students: studentRows, teachers: teacherRows, halaqahs: halaqahRows, classes: classRows, dorms: dormRows, parents: parentRows, academicYears: yearRows, programs: programRows };
}

export async function getSubmissionFormData(user: AppUser) {
  const teacher = await getTeacherForUser(user.id);
  const data = await getMasterData();
  const visibleStudents = user.role === "ustadz" && teacher
    ? data.students.filter((student) => data.halaqahs.some((halaqah) => halaqah.id === student.halaqahId && halaqah.teacherId === teacher.id))
    : data.students;
  return { ...data, students: visibleStudents, currentTeacher: teacher };
}

export async function getStudentDetail(studentId: string) {
  const [student] = await db
    .select({
      id: students.id, nis: students.nis, name: students.name, gender: students.gender, isActive: students.isActive,
      className: classes.name, dormName: dorms.name, halaqahName: halaqahs.name, halaqahId: halaqahs.id,
      teacherName: teachers.name, parentName: parents.name, parentPhone: parents.phone,
    })
    .from(students)
    .leftJoin(classes, eq(students.classId, classes.id))
    .leftJoin(dorms, eq(students.dormId, dorms.id))
    .leftJoin(halaqahs, eq(students.halaqahId, halaqahs.id))
    .leftJoin(teachers, eq(halaqahs.teacherId, teachers.id))
    .leftJoin(parents, eq(students.parentId, parents.id))
    .where(eq(students.id, studentId))
    .limit(1);
  if (!student) return null;

  const [submissionRows, kitabRows, targetRows, murajaahRows] = await Promise.all([
    db.select({ id: quranSubmissions.id, submissionDate: quranSubmissions.submissionDate, type: quranSubmissions.type, surah: quranSubmissions.surah, verseStart: quranSubmissions.verseStart, verseEnd: quranSubmissions.verseEnd, fluencyScore: quranSubmissions.fluencyScore, tajwidScore: quranSubmissions.tajwidScore, makhrajScore: quranSubmissions.makhrajScore, status: quranSubmissions.status, notes: quranSubmissions.notes, characterNote: quranSubmissions.characterNote, teacherName: teachers.name }).from(quranSubmissions).leftJoin(teachers, eq(quranSubmissions.teacherId, teachers.id)).where(eq(quranSubmissions.studentId, studentId)).orderBy(desc(quranSubmissions.submissionDate), desc(quranSubmissions.createdAt)),
    db.select().from(kitabSubmissions).where(eq(kitabSubmissions.studentId, studentId)).orderBy(desc(kitabSubmissions.submissionDate)),
    db.select({ id: targets.id, programName: programs.name, dailyTarget: targets.dailyTarget, weeklyTarget: targets.weeklyTarget, monthlyTarget: targets.monthlyTarget }).from(targets).leftJoin(programs, eq(targets.programId, programs.id)).where(eq(targets.studentId, studentId)),
    db.select({ id: murajaahSchedules.id, dueDate: murajaahSchedules.dueDate, status: murajaahSchedules.status, surah: quranSubmissions.surah, verseStart: quranSubmissions.verseStart, verseEnd: quranSubmissions.verseEnd }).from(murajaahSchedules).leftJoin(quranSubmissions, eq(murajaahSchedules.quranSubmissionId, quranSubmissions.id)).where(eq(murajaahSchedules.studentId, studentId)).orderBy(murajaahSchedules.dueDate),
  ]);
  const progress = buildProgress(submissionRows);
  const score = submissionRows.length ? Math.round(submissionRows.reduce((sum, row) => sum + row.fluencyScore + row.tajwidScore + row.makhrajScore, 0) / (submissionRows.length * 3)) : 0;
  const weak = submissionRows.filter((row) => row.status !== "lulus").slice(0, 5);
  return { student, submissions: submissionRows, kitabSubmissions: kitabRows, targets: targetRows, murajaah: murajaahRows, progress, averageScore: score, weak };
}

export async function getMurajaahData(user: AppUser) {
  const teacher = user.role === "ustadz" ? await getTeacherForUser(user.id) : null;
  const data = await getDashboardData(user);
  const visibleIds = data.students.map((item) => item.id);
  const rows = visibleIds.length ? await db
    .select({ id: murajaahSchedules.id, dueDate: murajaahSchedules.dueDate, intervalDays: murajaahSchedules.intervalDays, status: murajaahSchedules.status, resultNote: murajaahSchedules.resultNote, studentName: students.name, studentId: students.id, surah: quranSubmissions.surah, verseStart: quranSubmissions.verseStart, verseEnd: quranSubmissions.verseEnd, submissionStatus: quranSubmissions.status })
    .from(murajaahSchedules)
    .leftJoin(students, eq(murajaahSchedules.studentId, students.id))
    .leftJoin(quranSubmissions, eq(murajaahSchedules.quranSubmissionId, quranSubmissions.id))
    .where(inArray(murajaahSchedules.studentId, visibleIds))
    .orderBy(murajaahSchedules.status, murajaahSchedules.dueDate) : [];
  return { rows, teacher };
}

export async function getProgressOverview(user: AppUser) {
  const dashboard = await getDashboardData(user);
  const summaries = await Promise.all(dashboard.students.map(async (student) => {
    const detail = await getStudentDetail(student.id);
    return detail ? { id: student.id, name: student.name, nis: student.nis, halaqahName: student.halaqahName, progress: detail.progress, averageScore: detail.averageScore, weakCount: detail.weak.length } : null;
  }));
  return summaries.filter(Boolean);
}

export async function getGuardianPortal(userId: string) {
  const parent = await getParentForUser(userId);
  if (!parent) return { parent: null, children: [] };
  const childRows = await db.select({ id: students.id, name: students.name, nis: students.nis, className: classes.name, halaqahName: halaqahs.name }).from(students).leftJoin(classes, eq(students.classId, classes.id)).leftJoin(halaqahs, eq(students.halaqahId, halaqahs.id)).where(eq(students.parentId, parent.id));
  const children = await Promise.all(childRows.map(async (child) => ({ ...child, detail: await getStudentDetail(child.id) })));
  return { parent, children };
}

export async function getReportData(user: AppUser) {
  const overview = await getProgressOverview(user);
  const dashboard = await getDashboardData(user);
  return { overview, dashboard };
}

export async function getSettingsData(user: AppUser) {
  const [years, programRows, targetRows, notificationRows] = await Promise.all([
    db.select().from(academicYears).orderBy(desc(academicYears.startDate)),
    db.select().from(programs).orderBy(programs.name),
    db.select({ id: targets.id, dailyTarget: targets.dailyTarget, weeklyTarget: targets.weeklyTarget, monthlyTarget: targets.monthlyTarget, programName: programs.name, studentName: students.name, halaqahName: halaqahs.name }).from(targets).leftJoin(programs, eq(targets.programId, programs.id)).leftJoin(students, eq(targets.studentId, students.id)).leftJoin(halaqahs, eq(targets.halaqahId, halaqahs.id)).orderBy(desc(targets.createdAt)),
    getNotifications(user.id),
  ]);
  return { years, programs: programRows, targets: targetRows, notifications: notificationRows };
}

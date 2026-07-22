"use client";

import { createQuranSubmissionAction } from "@/app/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import type { getSubmissionFormData } from "@/lib/data";
import { tanggalHariIni } from "@/lib/utils";
import { CheckCircle2, LoaderCircle, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { z } from "zod";

type SubmissionData = Awaited<ReturnType<typeof getSubmissionFormData>>;
const schema = z.object({
  studentId: z.string().min(1, "Pilih santri terlebih dahulu."),
  teacherId: z.string(),
  programId: z.string(),
  submissionDate: z.string().min(1, "Tanggal setoran wajib diisi."),
  type: z.enum(["hafalan_baru", "murajaah", "tasmi", "perbaikan", "ujian_juz_surah"]),
  surah: z.string().min(2, "Nama surah minimal 2 karakter."),
  verseStart: z.coerce.number().int().min(1, "Ayat awal minimal 1."),
  verseEnd: z.coerce.number().int().min(1, "Ayat akhir minimal 1."),
  fluencyScore: z.coerce.number().int().min(0).max(100),
  tajwidScore: z.coerce.number().int().min(0).max(100),
  makhrajScore: z.coerce.number().int().min(0).max(100),
  status: z.enum(["lulus", "mengulang", "perlu_murajaah", "belum_lancar"]),
  notes: z.string(),
  characterNote: z.string(),
}).refine((values) => values.verseEnd >= values.verseStart, { path: ["verseEnd"], message: "Ayat akhir tidak boleh lebih kecil dari ayat awal." });
type FormValues = z.input<typeof schema>;
const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>{children}{error && <span className="mt-1 block text-[11px] font-medium text-rose-600">{error}</span>}</label>; }

export function SubmissionForm({ data, isManager }: { data: SubmissionData; isManager: boolean }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { studentId: "", teacherId: data.currentTeacher?.id ?? "", programId: data.programs.find((item) => item.type === "quran")?.id ?? "", submissionDate: tanggalHariIni(), type: "hafalan_baru", surah: "", verseStart: 1, verseEnd: 1, fluencyScore: 90, tajwidScore: 90, makhrajScore: 90, status: "lulus", notes: "", characterNote: "" } });
  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.set(key, String(value)));
    startTransition(() => { void createQuranSubmissionAction(formData); });
  };
  const errors = form.formState.errors;
  return <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_315px]"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-6 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><CheckCircle2 size={22}/></span><div><h2 className="font-display text-xl font-bold text-slate-900">Detail Setoran</h2><p className="text-xs text-slate-500">Catat setoran dengan teliti untuk progress yang akurat.</p></div></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Santri" error={errors.studentId?.message}><select className={inputClass} {...form.register("studentId")}><option value="">Pilih santri binaan</option>{data.students.map((student) => <option value={student.id} key={student.id}>{student.name} · {student.nis}</option>)}</select></Field><Field label="Tanggal setoran" error={errors.submissionDate?.message}><input className={inputClass} type="date" {...form.register("submissionDate")}/></Field><Field label="Program" error={errors.programId?.message}><select className={inputClass} {...form.register("programId")}><option value="">Pilih program</option>{data.programs.map((program) => <option value={program.id} key={program.id}>{program.name}</option>)}</select></Field><Field label="Jenis setoran" error={errors.type?.message}><select className={inputClass} {...form.register("type")}><option value="hafalan_baru">Hafalan Baru</option><option value="murajaah">Muraja'ah</option><option value="tasmi">Tasmi'</option><option value="perbaikan">Perbaikan</option><option value="ujian_juz_surah">Ujian Juz/Surah</option></select></Field>{isManager ? <Field label="Penilai / ustadz"><select className={inputClass} {...form.register("teacherId")}><option value="">Pilih ustadz</option>{data.teachers.map((teacher) => <option value={teacher.id} key={teacher.id}>{teacher.name}</option>)}</select></Field> : <input type="hidden" {...form.register("teacherId")}/>}<Field label="Nama surah" error={errors.surah?.message}><input className={inputClass} placeholder="Contoh: Al-Mulk" {...form.register("surah")}/></Field><div className="grid grid-cols-2 gap-3 sm:col-span-2"><Field label="Ayat awal" error={errors.verseStart?.message}><input className={inputClass} type="number" min="1" {...form.register("verseStart")}/></Field><Field label="Ayat akhir" error={errors.verseEnd?.message}><input className={inputClass} type="number" min="1" {...form.register("verseEnd")}/></Field></div></div><div className="mt-6 border-t border-slate-100 pt-5"><h3 className="font-display text-base font-bold text-slate-900">Penilaian Setoran</h3><div className="mt-4 grid gap-4 sm:grid-cols-3"><Field label="Kelancaran (0–100)" error={errors.fluencyScore?.message}><input className={inputClass} type="number" min="0" max="100" {...form.register("fluencyScore")}/></Field><Field label="Tajwid (0–100)" error={errors.tajwidScore?.message}><input className={inputClass} type="number" min="0" max="100" {...form.register("tajwidScore")}/></Field><Field label="Makhraj (0–100)" error={errors.makhrajScore?.message}><input className={inputClass} type="number" min="0" max="100" {...form.register("makhrajScore")}/></Field></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Status hasil"><select className={inputClass} {...form.register("status")}><option value="lulus">Lulus</option><option value="mengulang">Mengulang</option><option value="perlu_murajaah">Perlu Muraja'ah</option><option value="belum_lancar">Belum Lancar</option></select></Field><Field label="Catatan akhlak ringan"><input className={inputClass} placeholder="Contoh: hadir tepat waktu" {...form.register("characterNote")}/></Field></div><Field label="Catatan ustadz"><textarea className={`${inputClass} mt-4 min-h-24 resize-y`} placeholder="Berikan arahan yang membangun..." {...form.register("notes")}/></Field></div></section><aside className="h-fit rounded-2xl border border-emerald-100 bg-emerald-950 p-5 text-white shadow-lg shadow-emerald-950/10"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">Sistem Cerdas</span><h2 className="mt-2 font-display text-xl font-bold">Muraja'ah otomatis</h2><p className="mt-2 text-sm leading-6 text-emerald-100/80">Setelah disimpan, sistem akan membuat agenda pengulangan pada H+1, H+3, H+7, dan H+30.</p><div className="my-5 h-px bg-white/10"/><ul className="space-y-3 text-sm text-emerald-100"><li className="flex gap-2"><span className="text-amber-300">✓</span> Riwayat tersimpan per santri</li><li className="flex gap-2"><span className="text-amber-300">✓</span> Peta hafalan ikut diperbarui</li><li className="flex gap-2"><span className="text-amber-300">✓</span> Wali dapat melihat perkembangan</li></ul><button disabled={isPending} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-bold text-emerald-950 transition hover:bg-amber-300 disabled:cursor-wait disabled:opacity-70">{isPending ? <><LoaderCircle size={18} className="animate-spin"/> Menyimpan...</> : <><Save size={18}/> Simpan Setoran</>}</button></aside></form>;
}

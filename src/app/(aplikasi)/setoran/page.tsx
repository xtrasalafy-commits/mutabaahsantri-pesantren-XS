import { SubmissionForm } from "@/components/submission-form";
import { MessageBanner, PageHeading } from "@/components/shared";
import { canInputSubmission, canManageData, requireUser } from "@/lib/auth";
import { getSubmissionFormData } from "@/lib/data";
import { ClipboardPenLine } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SubmissionPage({ searchParams }: { searchParams: Promise<{ pesan?: string; galat?: string }> }) {
  const user = await requireUser();
  if (!canInputSubmission(user.role)) redirect("/dashboard?galat=Halaman%20input%20setoran%20khusus%20ustadz%20dan%20admin.");
  const [data, params] = await Promise.all([getSubmissionFormData(user), searchParams]);
  return <><PageHeading eyebrow="Pencatatan Harian" title="Input Setoran Al-Qur'an" description="Masukkan hasil setoran hafalan, muraja'ah, tasmi', perbaikan, atau ujian juz/surah. Progress dan jadwal muraja'ah akan diperbarui otomatis." action={<span className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800"><ClipboardPenLine size={16}/>Input oleh {user.role === "ustadz" ? "Musyrif" : "Admin"}</span>}/><MessageBanner message={params.galat} type="error"/><MessageBanner message={params.pesan}/>{!data.students.length ? <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900"><b>Belum ada santri binaan.</b> Hubungi Admin Pondok untuk menempatkan santri ke halaqah Anda terlebih dahulu.</div> : <SubmissionForm data={data} isManager={canManageData(user.role)}/>}</>;
}

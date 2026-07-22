import { MasterDataManager } from "@/components/master-data-manager";
import { MessageBanner, PageHeading } from "@/components/shared";
import { canManageData, requireUser } from "@/lib/auth";
import { getMasterData } from "@/lib/data";
import { Database, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

export default async function MasterDataPage({ searchParams }: { searchParams: Promise<{ pesan?: string; galat?: string }> }) {
  const user = await requireUser();
  if (!canManageData(user.role)) redirect("/dashboard?galat=Akses%20master%20data%20khusus%20Admin%20Pondok.");
  const [data, params] = await Promise.all([getMasterData(), searchParams]);
  return <><PageHeading eyebrow="Administrasi Pondok" title="Master Data" description="Kelola fondasi data pondok: santri, ustadz, halaqah, kelas, asrama, wali, dan referensi program." action={<div className="hidden items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 sm:flex"><ShieldCheck size={16}/>Akses Admin Pondok</div>}/><MessageBanner message={params.galat} type="error"/><MessageBanner message={params.pesan}/><div className="mb-5 flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-800"><Database size={18} className="shrink-0"/><p><b>Alur rekomendasi:</b> siapkan tahun ajaran → ustadz → halaqah → tempatkan santri → mulai setoran.</p></div><MasterDataManager data={data}/></>;
}

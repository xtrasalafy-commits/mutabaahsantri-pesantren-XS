import { SettingsManager } from "@/components/settings-manager";
import { MessageBanner, PageHeading } from "@/components/shared";
import { canManageData, requireUser } from "@/lib/auth";
import { getMasterData, getSettingsData } from "@/lib/data";
import { Settings2 } from "lucide-react";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ pesan?: string; galat?: string }> }) {
  const user = await requireUser();
  const isManager = canManageData(user.role);
  const [data, master, params] = await Promise.all([getSettingsData(user), isManager ? getMasterData() : Promise.resolve(null), searchParams]);
  return <><PageHeading eyebrow="Preferensi Sistem" title="Pengaturan" description={isManager ? "Kelola program hafalan, target pembinaan, dan notifikasi sistem." : "Kelola informasi akun dan lihat notifikasi pendampingan yang ditujukan kepada Anda."} action={<span className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600"><Settings2 size={16}/>{isManager ? "Pengaturan pondok" : "Pengaturan akun"}</span>}/><MessageBanner message={params.galat} type="error"/><MessageBanner message={params.pesan}/><section className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">{user.name.split(" ").slice(0, 2).map((part) => part[0]).join("")}</span><div><h2 className="font-display text-lg font-bold text-slate-900">{user.name}</h2><p className="text-xs text-slate-500">{user.email}{user.phone ? ` · ${user.phone}` : ""}</p></div></div><p className="mt-4 text-xs leading-5 text-slate-500">Untuk perubahan profil, aktivasi akun, atau pengaturan ulang kata sandi pada versi MVP ini, silakan hubungi Admin Pondok.</p></section><SettingsManager data={data} master={master} isManager={isManager}/></>;
}

import { cn, initials, STATUS_LABEL } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{eyebrow ?? "MutabaahSantri"}</p><h1 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p></div>{action}</div>;
}

export function MetricCard({ label, value, note, icon: Icon, tone = "emerald" }: { label: string; value: string | number; note: string; icon: LucideIcon; tone?: "emerald" | "gold" | "sky" | "rose" }) {
  const tones = { emerald: "bg-emerald-50 text-emerald-700", gold: "bg-amber-50 text-amber-700", sky: "bg-sky-50 text-sky-700", rose: "bg-rose-50 text-rose-700" };
  return <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950">{value}</p></div><span className={cn("grid size-11 place-items-center rounded-xl", tones[tone])}><Icon size={21} strokeWidth={2}/></span></div><p className="mt-4 text-xs font-medium text-slate-400">{note}</p></section>;
}

export function StatusBadge({ value }: { value: string }) {
  const tone: Record<string, string> = { lulus: "bg-emerald-100 text-emerald-800", selesai: "bg-emerald-100 text-emerald-800", mengulang: "bg-amber-100 text-amber-800", perlu_murajaah: "bg-orange-100 text-orange-800", belum_lancar: "bg-rose-100 text-rose-800", terjadwal: "bg-sky-100 text-sky-800", terlewat: "bg-slate-200 text-slate-700", hafalan_baru: "bg-emerald-100 text-emerald-800", murajaah: "bg-teal-100 text-teal-800", tasmi: "bg-violet-100 text-violet-800", perbaikan: "bg-amber-100 text-amber-800", ujian_juz_surah: "bg-indigo-100 text-indigo-800" };
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold", tone[value] ?? "bg-slate-100 text-slate-700")}>{STATUS_LABEL[value] ?? value}</span>;
}

export function ProgressBar({ value, size = "md", showValue = true }: { value: number; size?: "sm" | "md"; showValue?: boolean }) {
  const width = Math.max(0, Math.min(100, value));
  return <div className="flex items-center gap-3"><div className={cn("min-w-0 flex-1 overflow-hidden rounded-full bg-emerald-50", size === "sm" ? "h-1.5" : "h-2.5")}><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${width}%` }}/></div>{showValue && <span className="w-10 text-right text-xs font-bold text-emerald-700">{width}%</span>}</div>;
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  return <span className={cn("grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-500 text-xs font-bold text-white", className)}>{initials(name)}</span>;
}

export function SectionCard({ title, subtitle, children, action, className }: { title: string; subtitle?: string; children: ReactNode; action?: ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl border border-slate-200/80 bg-white shadow-sm", className)}><header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4"><div><h2 className="font-display text-lg font-bold text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>}</div>{action}</header>{children}</section>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center"><div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-xl">✦</div><h3 className="mt-4 font-display text-lg font-bold text-slate-900">{title}</h3><p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

export function DetailLink({ href, children = "Lihat detail" }: { href: string; children?: ReactNode }) {
  return <Link href={href} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 transition hover:text-emerald-900">{children}<ArrowUpRight size={14}/></Link>;
}

export function MessageBanner({ message, type = "success" }: { message?: string; type?: "success" | "error" }) {
  if (!message) return null;
  return <div role="status" className={cn("mb-5 rounded-xl border px-4 py-3 text-sm font-medium", type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800")}>{message}</div>;
}

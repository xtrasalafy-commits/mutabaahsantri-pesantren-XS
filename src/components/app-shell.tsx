import { logoutAction } from "@/app/actions";
import { Avatar } from "@/components/shared";
import { ROLE_LABEL } from "@/lib/utils";
import type { AppUser } from "@/lib/data";
import { BookOpenCheck, ClipboardPenLine, Coffee, FileText, Landmark, LayoutDashboard, LogOut, Map, Settings, UsersRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const baseItems = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
  { href: "/setoran", label: "Input Setoran", icon: ClipboardPenLine, inputOnly: true },
  { href: "/murajaah", label: "Muraja'ah", icon: BookOpenCheck, inputOnly: true },
  { href: "/progress", label: "Progress Hafalan", icon: Map },
  { href: "/laporan", label: "Laporan", icon: FileText },
];

export function AppShell({ user, children }: { user: AppUser; children: ReactNode }) {
  const isManager = ["super_admin", "admin_pondok"].includes(user.role);
  const isInputUser = ["super_admin", "admin_pondok", "ustadz"].includes(user.role);
  const items = [
    ...baseItems.filter((item) => !item.inputOnly || isInputUser),
    ...(isManager ? [{ href: "/master-data", label: "Master Data", icon: UsersRound }] : []),
    ...(user.role === "wali" ? [{ href: "/portal-wali", label: "Portal Wali", icon: Landmark }] : []),
  ];
  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[258px] flex-col border-r border-emerald-950/10 bg-emerald-950 px-4 py-5 text-emerald-50 lg:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 font-display text-lg font-black text-emerald-950 shadow-lg shadow-emerald-900/30">م</span>
          <span>
            <span className="block font-display text-xl font-bold tracking-tight">Mutabaah</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Santri</span>
          </span>
        </Link>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">Menu Utama</p>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-white/10 hover:text-white">
                <Icon size={19} className="text-emerald-300 group-hover:text-amber-300" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <nav className="mt-4 space-y-1">
          <Link href="/donasi" className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-amber-300 transition hover:bg-white/10 hover:text-white">
            <Coffee size={19} className="text-amber-200 group-hover:text-amber-300" />
            Donasi
          </Link>
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-3">
            <Avatar name={user.name} className="size-9 bg-amber-400 text-emerald-950" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user.name}</p>
              <p className="truncate text-[11px] text-emerald-300">{ROLE_LABEL[user.role]}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Link href="/pengaturan" className="grid flex-1 place-items-center rounded-lg bg-white/10 py-2 text-emerald-100 transition hover:bg-white/15" aria-label="Pengaturan">
              <Settings size={16} />
            </Link>
            <form action={logoutAction} className="flex-1">
              <button className="grid w-full place-items-center rounded-lg bg-white/10 py-2 text-emerald-100 transition hover:bg-rose-500/30 hover:text-white" aria-label="Keluar">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </div>
  );
}

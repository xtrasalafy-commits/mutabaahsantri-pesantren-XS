import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#f6f8f7] px-5"><section className="max-w-md text-center"><span className="font-display text-7xl font-bold text-emerald-200">404</span><h1 className="mt-3 font-display text-3xl font-bold text-slate-900">Halaman tidak ditemukan</h1><p className="mt-3 text-sm leading-6 text-slate-500">Alamat yang Anda buka tidak tersedia atau Anda tidak memiliki akses ke data tersebut.</p><Link href="/dashboard" className="mt-6 inline-flex rounded-xl bg-emerald-900 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Kembali ke dashboard</Link></section></main>;
}

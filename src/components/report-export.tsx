"use client";

import { Download, Printer } from "lucide-react";

type ReportRow = { nama: string; nis: string; halaqah: string; capaian: number; nilai: number; perluPenguatan: number };

export function ReportExport({ rows }: { rows: ReportRow[] }) {
  const downloadCsv = () => {
    const header = ["Nama Santri", "NIS", "Halaqah", "Capaian Hafalan (%)", "Nilai Rata-rata", "Hafalan Perlu Penguatan"];
    const content = [header, ...rows.map((row) => [row.nama, row.nis, row.halaqah, row.capaian, row.nilai, row.perluPenguatan])]
      .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "laporan-mutabaah-santri.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <div className="no-print flex flex-wrap gap-2"><button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"><Printer size={16}/>Cetak / Simpan PDF</button><button onClick={downloadCsv} className="inline-flex items-center gap-2 rounded-xl bg-emerald-900 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-800"><Download size={16}/>Unduh Excel (CSV)</button></div>;
}

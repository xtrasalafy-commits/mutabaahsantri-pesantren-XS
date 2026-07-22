export const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin_pondok: "Admin Pondok",
  ustadz: "Ustadz / Musyrif",
  santri: "Santri",
  wali: "Wali Santri",
  pimpinan: "Pimpinan Pondok",
};

export const STATUS_LABEL: Record<string, string> = {
  lulus: "Lulus",
  mengulang: "Mengulang",
  perlu_murajaah: "Perlu Muraja'ah",
  belum_lancar: "Belum Lancar",
  terjadwal: "Terjadwal",
  selesai: "Selesai",
  terlewat: "Terlewat",
  hafalan_baru: "Hafalan Baru",
  murajaah: "Muraja'ah",
  tasmi: "Tasmi'",
  perbaikan: "Perbaikan",
  ujian_juz_surah: "Ujian Juz/Surah",
};

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export function formatTanggal(value: string | Date | null | undefined) {
  if (!value) return "—";
  const dateValue = typeof value === "string" && value.length === 10 ? `${value}T12:00:00` : value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

export function formatTanggalPanjang(value: string | Date | null | undefined) {
  if (!value) return "—";
  const dateValue = typeof value === "string" && value.length === 10 ? `${value}T12:00:00` : value;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

export function rataNilai(...scores: number[]) {
  if (!scores.length) return 0;
  return Math.round(scores.reduce((total, score) => total + score, 0) / scores.length);
}

export function tanggalHariIni() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((item) => item.charAt(0))
    .join("")
    .toUpperCase();
}

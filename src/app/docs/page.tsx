'use client';

import { useState } from 'react';
import { Download, Check, BookOpen, Users, GraduationCap, BarChart3, FileText, Shield, Settings2 } from 'lucide-react';

export default function DocsPage() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadAll = async () => {
    try {
      const res = await fetch('/api/download-source');
      if (!res.ok) throw new Error('Gagal mengunduh');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mutabaahsantri-source-code.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      alert('Gagal mengunduh source code. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-emerald-100 mb-6">
            <BookOpen size={40} className="text-emerald-700" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MutabaahSantri</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Aplikasi open source untuk pencatatan setoran hafalan, monitoring progress, muraja&apos;ah otomatis, dan portal wali santri di pondok pesantren.
          </p>
          <div className="mt-6">
            <button
              onClick={handleDownloadAll}
              className="inline-flex items-center gap-2 bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {downloaded ? (
                <>
                  <Check size={20} />
                  <span>Berhasil diunduh!</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Download Semua Source Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Aplikasi</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MutabaahSantri adalah sistem informasi pesantren yang mencakup pencatatan setoran hafalan, monitoring progress santri, penjadwalan muraja&apos;ah otomatis, dan portal wali santri. Aplikasi ini dibangun menggunakan Next.js, TypeScript, Tailwind CSS, PostgreSQL, dan Drizzle ORM.
            </p>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fitur Utama</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                <Users className="text-emerald-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Multi-Role Access</h3>
                  <p className="text-sm text-gray-600">Super Admin, Admin Pondok, Ustadz, Wali, Pimpinan</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                <GraduationCap className="text-emerald-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Input Setoran</h3>
                  <p className="text-sm text-gray-600">Hafalan baru, muraja&apos;ah, tasmi&apos;, perbaikan, ujian</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                <BarChart3 className="text-emerald-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Dashboard & Progress</h3>
                  <p className="text-sm text-gray-600">Grafik nilai, progress hafalan, peta Juz</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                <Settings2 className="text-emerald-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Master Data</h3>
                  <p className="text-sm text-gray-600">Santri, ustadz, halaqah, kelas, asrama, program</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                <FileText className="text-emerald-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Laporan</h3>
                  <p className="text-sm text-gray-600">Export PDF/CSV, rekap per santri</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                <Shield className="text-emerald-600 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Portal Wali</h3>
                  <p className="text-sm text-gray-600">Pantau perkembangan hafalan anak</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instalasi & Menjalankan Lokal</h2>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-gray-100 font-mono">
{`# 1. Clone repository
git clone <repository-url>
cd mutabaahsantri-pesantren-XS

# 2. Install dependensi
bun install
# atau npm install

# 3. Setup environment
cp .env.example .env
# Isi DATABASE_URL dengan koneksi PostgreSQL kamu

# 4. Jalankan migrasi database
bunx drizzle-kit generate
bunx drizzle-kit migrate
bun src/db/seed.ts

# 5. Jalankan aplikasi
bun run dev

# 6. Buka http://localhost:3000`}
              </pre>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Akun Demo</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Semua akun demo menggunakan kata sandi: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">mutabaah123</code>
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 pr-4 font-semibold text-gray-700">Peran</th>
                    <th className="py-2 pr-4 font-semibold text-gray-700">Email</th>
                    <th className="py-2 font-semibold text-gray-700">Password</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-50"><td className="py-2 pr-4">Super Admin</td><td className="py-2 pr-4 font-mono text-xs">admin@mutabaah.test</td><td className="py-2 font-mono text-xs">mutabaah123</td></tr>
                  <tr className="border-b border-gray-50"><td className="py-2 pr-4">Admin Pondok</td><td className="py-2 pr-4 font-mono text-xs">pondok@mutabaah.test</td><td className="py-2 font-mono text-xs">mutabaah123</td></tr>
                  <tr className="border-b border-gray-50"><td className="py-2 pr-4">Ustadz Putra</td><td className="py-2 pr-4 font-mono text-xs">ahmad@mutabaah.test</td><td className="py-2 font-mono text-xs">mutabaah123</td></tr>
                  <tr className="border-b border-gray-50"><td className="py-2 pr-4">Ustadzah Putri</td><td className="py-2 pr-4 font-mono text-xs">fatimah@mutabaah.test</td><td className="py-2 font-mono text-xs">mutabaah123</td></tr>
                  <tr className="border-b border-gray-50"><td className="py-2 pr-4">Wali (Aisyah)</td><td className="py-2 pr-4 font-mono text-xs">wali.aisyah@mutabaah.test</td><td className="py-2 font-mono text-xs">mutabaah123</td></tr>
                  <tr className="border-b border-gray-50"><td className="py-2 pr-4">Wali (Zaid)</td><td className="py-2 pr-4 font-mono text-xs">wali.zaid@mutabaah.test</td><td className="py-2 font-mono text-xs">mutabaah123</td></tr>
                  <tr><td className="py-2 pr-4">Pimpinan</td><td className="py-2 pr-4 font-mono text-xs">pimpinan@mutabaah.test</td><td className="py-2 font-mono text-xs">mutabaah123</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Download Source Code</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Download seluruh source code aplikasi MutabaahSantri untuk dikembangkan sesuai kebutuhan pondok Anda.
            </p>
            <button
              onClick={handleDownloadAll}
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {downloaded ? (
                <>
                  <Check size={20} />
                  <span>Berhasil diunduh!</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Download Semua Source Code</span>
                </>
              )}
            </button>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lisensi</h2>
            <p className="text-gray-700 leading-relaxed">
              Proyek ini bersifat open source. Anda bebas menggunakan, memodifikasi, dan mendistribusikan ulang aplikasi ini untuk keperluan non-komersial maupun komersial. Namun, kami menghargai jika credit &quot;Open Source oleh MZF - 2026&quot; tetap disisipkan di dalam aplikasi.
            </p>
          </section>

          <footer className="text-center pt-8 pb-4">
            <p className="text-sm text-gray-500">
              Open Source oleh <span className="font-semibold text-gray-700">MZF</span> - 2026
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Download, Check } from 'lucide-react';
import TrakteerDonationWidget from '@/components/trakteer-donation-widget';

export default function DonasiPage() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([WIDGET_SOURCE], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trakteer-donation-widget.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-16 rounded-full bg-amber-100 mb-6">
            <span className="text-4xl">☕</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Widget Donasi Trakteer</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Floating widget donasi khas Trakteer yang bisa dipindah-pindah, dengan QR Code inline dan tanpa redirect.
            Gratis, open source, dan siap pakai.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Tentang Widget</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Widget ini menampilkan tombol melayang (floating button) di sudut kanan bawah layar.
              Tombol ini bisa <strong>digeser/ dipindah-pindah</strong> sesuai keinginan pengguna.
              Saat diklik, widget akan menampilkan:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
              <li>Pilihan nominal traktiran mulai dari <strong>Rp6.000</strong> dan kelipatannya</li>
              <li>QR Code untuk donasi yang tampil <strong>langsung di dalam web app</strong> (tanpa pindah halaman)</li>
              <li>Tombol &quot;Traktir Sekarang&quot; yang terhubung ke akun Trakteer Anda</li>
              <li>Tulisan pengingat bahwa web app ini gratis &amp; bebas iklan</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚡ Instalasi Cepat</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Widget ini dibuat khusus untuk Next.js App Router dengan Tailwind CSS v4. Berikut cara memasukkannya ke proyek Anda:
            </p>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm text-gray-100 font-mono">
{`1. Salin file \`trakteer-donation-widget.tsx\` ke direktori \`src/components/\` proyek Anda.

2. Import dan pasang widget di \`src/app/layout.tsx\`:

   import TrakteerDonationWidget from '@/components/trakteer-donation-widget';

   export default function RootLayout({ children }: { children: ReactNode }) {
     return (
       <html lang="id">
         <body>
           {children}
           <TrakteerDonationWidget />
         </body>
       </html>
     );
   }

3. Ganti URL Trakteer di dalam komponen dengan URL profil Anda.`}
              </pre>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎨 Kustomisasi</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Anda bisa menyesuaikan widget sesuai kebutuhan:
            </p>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>Ubah URL Trakteer</strong> — Ganti konstanta <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">TRACKTEER_URL</code> dengan URL profil Trakteer Anda.
              </li>
              <li>
                <strong>Ubah nominal donasi</strong> — Edit array <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm">AMOUNTS</code> dengan nominal yang Anda inginkan.
              </li>
              <li>
                <strong>Ubah warna</strong> — Ganti class Tailwind warna amber/orange sesuai brand Anda.
              </li>
              <li>
                <strong>Ubah teks</strong> — Sesuaikan teks pengingat &quot;gratis &amp; bebas iklan&quot; sesuai kebutuhan.
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Download Source Code</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Download file komponen lengkap untuk digunakan di proyek Anda.
            </p>
            <button
              onClick={handleDownload}
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
                  <span>Download Source Code</span>
                </>
              )}
            </button>
          </section>

          <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📄 Lisensi</h2>
            <p className="text-gray-700 leading-relaxed">
              Proyek ini bersifat open source. Anda bebas menggunakan, memodifikasi, dan mendistribusikan ulang widget ini
              untuk keperluan non-komersial maupun komersial. Namun, kami menghargai jika credit &quot;Open Source oleh MZF - 2026&quot;
              tetap disisipkan di dalam widget.
            </p>
          </section>

          <footer className="text-center pt-8 pb-4">
            <p className="text-sm text-gray-500">
              Open Source oleh <span className="font-semibold text-gray-700">MZF</span> - 2026
            </p>
          </footer>
        </div>
      </div>

      <TrakteerDonationWidget />
    </div>
  );
}

const WIDGET_SOURCE = `'use client';

import { useState } from 'react';
import { Coffee, X } from 'lucide-react';

const TRACKTEER_URL = 'https://trakteer.id/perpus_opera/';
const AMOUNTS = [6000, 12000, 18000, 25000, 50000, 100000];

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);
}

export default function TrakteerDonationWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const qrUrl = selectedAmount
    ? \`\${TRACKTEER_URL}?amount=\${selectedAmount}\`
    : TRACKTEER_URL;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[45] bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-[50]">
        {isOpen && (
          <div className="mb-3 w-80 rounded-2xl border border-amber-200 bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-amber-900 text-sm">Traktir Kopi ☕</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1"
                type="button"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Web app ini <span className="font-semibold text-emerald-700">gratis & bebas iklan</span>.
              Traktir kopi untuk bantu biaya server?
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmount(amt)}
                  className=\`rounded-xl py-2 text-xs font-semibold transition-all border \${selectedAmount === amt ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400'}\`
                  type="button"
                >
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center mb-3">
              <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm inline-block">
                <img
                  src={\`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent(qrUrl)}&bgcolor=ffffff\`}
                  alt="QR Code Donasi"
                  width={180}
                  height={180}
                  className="w-36 h-36"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2">Scan QR di atas atau klik tombol di bawah</p>
            </div>

            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-xl py-2.5 text-sm font-bold shadow-lg shadow-amber-500/30 transition-all"
            >
              <Coffee size={16} />
              Traktir Sekarang
            </a>

            <div className="mt-3 pt-3 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400">
                Open Source oleh <span className="font-semibold text-gray-600">MZF</span> - 2026
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white pl-5 pr-4 py-3.5 rounded-full shadow-2xl shadow-orange-500/40 transition-all hover:scale-105 active:scale-95 border-2 border-white/20 whitespace-nowrap"
          type="button"
          aria-label="Widget donasi Trakteer"
        >
          <Coffee size={20} className="shrink-0" />
          <span className="text-sm font-bold">Web app ini gratis & bebas iklan.</span>
        </button>
      </div>
    </>
  );
}`;

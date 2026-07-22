(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,62368,e=>{"use strict";let t=(0,e.i(56420).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);e.s(["Download",0,t],62368)},30628,e=>{"use strict";var t=e.i(43476),a=e.i(71645),n=e.i(62368);let s=(0,e.i(56420).default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);var r=e.i(53217);let i=`'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [didDrag, setDidDrag] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const posStart = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const padding = 20;
    setPosition({
      x: typeof window !== 'undefined' ? window.innerWidth - 320 : padding,
      y: typeof window !== 'undefined' ? window.innerHeight - 120 : padding,
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
    setDidDrag(false);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = position;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!('button' in e) || e.button !== 0) return;
      setDidDrag(true);
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 280, posStart.current.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 100, posStart.current.y + dy)),
      });
    };
    const handleMouseUp = () => {
      setTimeout(() => setDidDrag(false), 0);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [position]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) return;
    const touch = e.touches[0];
    setDidDrag(false);
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    posStart.current = position;
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      setDidDrag(true);
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 280, posStart.current.x + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 100, posStart.current.y + dy)),
      });
    };
    const handleTouchEnd = () => {
      setTimeout(() => setDidDrag(false), 0);
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [position]);

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

      <div
        ref={widgetRef}
        style={{ left: position.x, top: position.y }}
        className=\`fixed z-[50] transition-all duration-300 \${isOpen ? 'w-80' : 'w-auto'}\`
      >
        {isOpen && (
          <div
            className="mb-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
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

        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={() => !didDrag && setIsOpen(!isOpen)}
          className="cursor-grab active:cursor-grabbing select-none inline-flex"
          role="button"
          tabIndex={0}
          aria-label="Widget donasi Trakteer"
        >
          {!isOpen && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white pl-5 pr-4 py-3.5 rounded-full shadow-2xl shadow-orange-500/40 transition-all hover:scale-105 active:scale-95 border-2 border-white/20 whitespace-nowrap">
              <Coffee size={20} className="shrink-0" />
              <span className="text-sm font-bold">
                Web app ini gratis & bebas iklan.
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}`;e.s(["default",0,function(){let[e,o]=(0,a.useState)(!1);return(0,t.jsxs)("div",{className:"min-h-screen bg-gradient-to-b from-amber-50 to-white",children:[(0,t.jsxs)("div",{className:"mx-auto max-w-3xl px-4 py-16",children:[(0,t.jsxs)("div",{className:"text-center mb-12",children:[(0,t.jsx)("div",{className:"inline-flex items-center justify-center size-16 rounded-full bg-amber-100 mb-6",children:(0,t.jsx)("span",{className:"text-4xl",children:"☕"})}),(0,t.jsx)("h1",{className:"text-4xl font-bold text-gray-900 mb-4",children:"Widget Donasi Trakteer"}),(0,t.jsx)("p",{className:"text-lg text-gray-600 max-w-2xl mx-auto",children:"Floating widget donasi khas Trakteer yang bisa dipindah-pindah, dengan QR Code inline dan tanpa redirect. Gratis, open source, dan siap pakai."})]}),(0,t.jsxs)("div",{className:"space-y-8",children:[(0,t.jsxs)("section",{className:"bg-white rounded-2xl border border-gray-200 p-6 shadow-sm",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-4",children:"📋 Tentang Widget"}),(0,t.jsxs)("p",{className:"text-gray-700 leading-relaxed mb-4",children:["Widget ini menampilkan tombol melayang (floating button) di sudut kanan bawah layar. Tombol ini bisa ",(0,t.jsx)("strong",{children:"digeser/ dipindah-pindah"})," sesuai keinginan pengguna. Saat diklik, widget akan menampilkan:"]}),(0,t.jsxs)("ul",{className:"list-disc list-inside text-gray-700 space-y-2 ml-2",children:[(0,t.jsxs)("li",{children:["Pilihan nominal traktiran mulai dari ",(0,t.jsx)("strong",{children:"Rp6.000"})," dan kelipatannya"]}),(0,t.jsxs)("li",{children:["QR Code untuk donasi yang tampil ",(0,t.jsx)("strong",{children:"langsung di dalam web app"})," (tanpa pindah halaman)"]}),(0,t.jsx)("li",{children:'Tombol "Traktir Sekarang" yang terhubung ke akun Trakteer Anda'}),(0,t.jsx)("li",{children:"Tulisan pengingat bahwa web app ini gratis & bebas iklan"})]})]}),(0,t.jsxs)("section",{className:"bg-white rounded-2xl border border-gray-200 p-6 shadow-sm",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-4",children:"⚡ Instalasi Cepat"}),(0,t.jsx)("p",{className:"text-gray-700 leading-relaxed mb-4",children:"Widget ini dibuat khusus untuk Next.js App Router dengan Tailwind CSS v4. Berikut cara memasukkannya ke proyek Anda:"}),(0,t.jsx)("div",{className:"bg-gray-900 rounded-xl p-4 overflow-x-auto",children:(0,t.jsx)("pre",{className:"text-sm text-gray-100 font-mono",children:`1. Salin file \`trakteer-donation-widget.tsx\` ke direktori \`src/components/\` proyek Anda.

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

3. Ganti URL Trakteer di dalam komponen dengan URL profil Anda.`})})]}),(0,t.jsxs)("section",{className:"bg-white rounded-2xl border border-gray-200 p-6 shadow-sm",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-4",children:"🎨 Kustomisasi"}),(0,t.jsx)("p",{className:"text-gray-700 leading-relaxed mb-4",children:"Anda bisa menyesuaikan widget sesuai kebutuhan:"}),(0,t.jsxs)("ul",{className:"space-y-3 text-gray-700",children:[(0,t.jsxs)("li",{children:[(0,t.jsx)("strong",{children:"Ubah URL Trakteer"})," — Ganti konstanta ",(0,t.jsx)("code",{className:"bg-gray-100 px-1.5 py-0.5 rounded text-sm",children:"TRACKTEER_URL"})," dengan URL profil Trakteer Anda."]}),(0,t.jsxs)("li",{children:[(0,t.jsx)("strong",{children:"Ubah nominal donasi"})," — Edit array ",(0,t.jsx)("code",{className:"bg-gray-100 px-1.5 py-0.5 rounded text-sm",children:"AMOUNTS"})," dengan nominal yang Anda inginkan."]}),(0,t.jsxs)("li",{children:[(0,t.jsx)("strong",{children:"Ubah warna"})," — Ganti class Tailwind warna amber/orange sesuai brand Anda."]}),(0,t.jsxs)("li",{children:[(0,t.jsx)("strong",{children:"Ubah teks"}),'— Sesuaikan teks pengingat "gratis & bebas iklan" sesuai kebutuhan.']})]})]}),(0,t.jsxs)("section",{className:"bg-white rounded-2xl border border-gray-200 p-6 shadow-sm",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-4",children:"📦 Download Source Code"}),(0,t.jsx)("p",{className:"text-gray-700 leading-relaxed mb-6",children:"Download file komponen lengkap untuk digunakan di proyek Anda."}),(0,t.jsx)("button",{onClick:()=>{let e=new Blob([i],{type:"text/typescript"}),t=URL.createObjectURL(e),a=document.createElement("a");a.href=t,a.download="trakteer-donation-widget.tsx",document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(t),o(!0),setTimeout(()=>o(!1),2e3)},className:"inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl",children:e?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s,{size:20}),(0,t.jsx)("span",{children:"Berhasil diunduh!"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.Download,{size:20}),(0,t.jsx)("span",{children:"Download Source Code"})]})})]}),(0,t.jsxs)("section",{className:"bg-white rounded-2xl border border-gray-200 p-6 shadow-sm",children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-gray-900 mb-4",children:"📄 Lisensi"}),(0,t.jsx)("p",{className:"text-gray-700 leading-relaxed",children:'Proyek ini bersifat open source. Anda bebas menggunakan, memodifikasi, dan mendistribusikan ulang widget ini untuk keperluan non-komersial maupun komersial. Namun, kami menghargai jika credit "Open Source oleh MZF - 2026" tetap disisipkan di dalam widget.'})]}),(0,t.jsx)("footer",{className:"text-center pt-8 pb-4",children:(0,t.jsxs)("p",{className:"text-sm text-gray-500",children:["Open Source oleh ",(0,t.jsx)("span",{className:"font-semibold text-gray-700",children:"MZF"})," - 2026"]})})]})]}),(0,t.jsx)(r.default,{})]})}],30628)}]);
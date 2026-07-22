'use client';

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
    ? `${TRACKTEER_URL}?amount=${selectedAmount}`
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
                  className={`rounded-xl py-2 text-xs font-semibold transition-all border ${
                    selectedAmount === amt
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400'
                  }`}
                  type="button"
                >
                  {formatRupiah(amt)}
                </button>
              ))}
            </div>

            <div className="flex flex-col items-center mb-3">
              <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}&bgcolor=ffffff`}
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
}

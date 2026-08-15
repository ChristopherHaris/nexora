"use client";

import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto pb-12">
      <div className="bg-[#ECA823] p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-between items-start">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            <FileText className="w-4 h-4" /> Tentang Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            Tentang Nexora
          </h1>
          <p className="text-lg font-bold text-slate-900/80">
            Platform ekosistem mahasiswa all-in-one terdepan.
          </p>
        </div>
      </div>

      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6 text-lg font-medium text-slate-700">
        <h2 className="text-2xl font-black text-slate-900 uppercase">Misi Kami</h2>
        <p className="font-bold border-l-4 border-[#ECA823] pl-4">
          Nexora dibangun dengan visi untuk menyatukan seluruh kebutuhan mahasiswa dalam satu platform digital yang terintegrasi, interaktif, dan mendukung penuh produktivitas perkuliahan.
        </p>

        <h2 className="text-2xl font-black text-slate-900 uppercase mt-8">Kenapa Nexora?</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <ChevronRight className="w-6 h-6 text-[#ECA823] shrink-0 mt-0.5" />
            <span><strong className="text-black">Smart Canteen:</strong> Memudahkan mahasiswa memesan makanan tanpa antre panjang.</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-6 h-6 text-[#ECA823] shrink-0 mt-0.5" />
            <span><strong className="text-black">Teammate Matcher:</strong> Mencari rekan lomba kini semudah mencari teman baru.</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-6 h-6 text-[#ECA823] shrink-0 mt-0.5" />
            <span><strong className="text-black">Campus Gigs:</strong> Marketplace freelance khusus untuk menambah penghasilan di sela waktu luang.</span>
          </li>
          <li className="flex items-start gap-3">
            <ChevronRight className="w-6 h-6 text-[#ECA823] shrink-0 mt-0.5" />
            <span><strong className="text-black">Gamification:</strong> Sistem Nexora Wallet dan poin XP yang membuat kehidupan kampus terasa seperti game seru!</span>
          </li>
        </ul>

        <div className="mt-8 pt-8 border-t-4 border-dashed border-slate-300">
          <p className="text-center font-bold">© 2026 Nexora Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

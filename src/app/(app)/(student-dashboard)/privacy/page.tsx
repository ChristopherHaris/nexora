"use client";

import { Shield, Check } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto pb-12">
      <div className="bg-[#BBE2EC] p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-between items-start">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            <Shield className="w-4 h-4" /> Kebijakan Privasi
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            Privacy Policy
          </h1>
          <p className="text-lg font-bold text-slate-900/80">
            Kami menjaga data Anda dengan sangat serius.
          </p>
        </div>
      </div>

      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6 text-lg font-medium text-slate-700">
        
        <h2 className="text-2xl font-black text-slate-900 uppercase">Pengumpulan Data</h2>
        <p className="font-bold border-l-4 border-[#00FFFF] pl-4">
          Data yang kami kumpulkan hanyalah data yang Anda setujui secara eksplisit saat pendaftaran dan penggunaan platform Nexora (seperti nama, email, nim, dan portofolio).
        </p>

        <h2 className="text-2xl font-black text-slate-900 uppercase mt-8">Penggunaan Data</h2>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Check className="w-6 h-6 text-[#00FF41] shrink-0 mt-0.5" />
            <span><strong className="text-black">Personalisasi:</strong> Menyesuaikan kalender dan rekomendasi tugas sesuai dengan profil Anda.</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-6 h-6 text-[#00FF41] shrink-0 mt-0.5" />
            <span><strong className="text-black">Matching:</strong> Membantu sistem "Teammate Matcher" menemukan tim yang relevan dengan keahlian (Skill) Anda.</span>
          </li>
          <li className="flex items-start gap-3">
            <Check className="w-6 h-6 text-[#00FF41] shrink-0 mt-0.5" />
            <span><strong className="text-black">Keamanan Transaksi:</strong> Mencatat riwayat penggunaan Nexora Coins untuk audit dan validasi.</span>
          </li>
        </ul>

        <h2 className="text-2xl font-black text-slate-900 uppercase mt-8">Hak Anda</h2>
        <p className="font-bold">
          Anda berhak kapan saja meminta salinan data Anda atau meminta penghapusan akun Anda secara permanen dari server kami dengan menghubungi dukungan kami.
        </p>
      </div>
    </div>
  );
}

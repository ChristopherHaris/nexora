"use client";

import { LifeBuoy, Mail, MessageSquare, Phone } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="w-full space-y-8 max-w-4xl mx-auto pb-12">
      <div className="bg-[#00FF41] p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-between items-start">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4 text-black">
            <LifeBuoy className="w-4 h-4" /> Bantuan
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            Support Center
          </h1>
          <p className="text-lg font-bold text-slate-900/80">
            Ada kendala? Tim Nexora siap membantu Anda 24/7!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-16 h-16 bg-[#BBE2EC] rounded-full border-4 border-black flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Mail className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase mb-2">Email Kami</h2>
          <p className="font-bold text-slate-600 mb-4">Balasan rata-rata dalam 1 jam.</p>
          <p className="text-lg font-black bg-slate-100 px-4 py-2 border-2 border-black rounded-lg">
            support@nexora.id
          </p>
        </div>

        <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer">
          <div className="w-16 h-16 bg-[#ECA823] rounded-full border-4 border-black flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <MessageSquare className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-black text-black uppercase mb-2">Live Chat</h2>
          <p className="font-bold text-slate-600 mb-4">Ngobrol langsung dengan agen CS.</p>
          <p className="text-lg font-black bg-slate-100 px-4 py-2 border-2 border-black rounded-lg text-slate-400">
            (Sedang offline)
          </p>
        </div>
      </div>

      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
        <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">Butuh Bantuan Darurat?</h2>
        <p className="font-bold text-slate-600 mb-6">
          Jika Anda mengalami masalah keamanan akun atau bug krusial, silakan hubungi hotline kami.
        </p>
        <div className="inline-flex items-center gap-3 bg-red-100 border-4 border-black px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xl font-black">
          <Phone className="w-6 h-6 text-black" />
          <span>0800-1-NEXORA</span>
        </div>
      </div>
    </div>
  );
}

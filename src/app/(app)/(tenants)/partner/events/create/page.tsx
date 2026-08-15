"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Calendar, MapPin, Tag, Type, Users, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      window.history.back();
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#ECA823] p-6 border-4 border-border shadow-shadow rounded-base">
        <div className="flex items-center gap-6">
          <Link href="/partner/events">
            <Button variant="outline" size="icon" className="rounded-base w-12 h-12 border-2 border-border shadow-shadow hover:bg-yellow-300 transition-all hover:-translate-y-1">
              <ArrowLeft className="w-6 h-6 text-slate-900" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase">Buat Event Baru</h1>
            <p className="text-slate-800 font-bold mt-1">Isi detail lengkap untuk perlombaan atau acara baru.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-base border-4 border-border shadow-shadow font-black uppercase bg-white hover:bg-slate-100 h-12 px-6 transition-all hover:-translate-y-1" onClick={() => window.history.back()}>
            BATAL
          </Button>
          <Button 
            className="bg-primary text-white hover:bg-green-700 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all flex items-center gap-2 font-black uppercase h-12 px-8"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? "MENYIMPAN..." : "SIMPAN & PUBLIKASI"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10 mt-4">
        
        {/* Section 1: Detail Dasar */}
        <div className="bg-white p-8 rounded-base border-4 border-border shadow-shadow flex flex-col gap-8 relative">
          <div className="absolute -top-5 left-8 bg-yellow-300 border-4 border-border shadow-shadow px-4 py-1 rounded-base font-black uppercase text-lg">
            1. DETAIL DASAR
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="flex flex-col gap-3 md:col-span-2">
              <label className="text-base font-black text-slate-900 uppercase">Nama Event / Lomba <span className="text-red-500">*</span></label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <Input required placeholder="Contoh: Hackathon Nasional NEXORA 2026" className="pl-12 h-14 bg-[#F4F4F0] border-4 border-border rounded-base font-bold text-lg focus-visible:ring-0 focus-visible:bg-yellow-100 transition-colors shadow-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-3 md:col-span-2">
              <label className="text-base font-black text-slate-900 uppercase">Deskripsi Lengkap <span className="text-red-500">*</span></label>
              <Textarea required placeholder="Tuliskan deskripsi lengkap mengenai acara, syarat pendaftaran, dan informasi penting lainnya..." className="min-h-[200px] bg-[#F4F4F0] border-4 border-border rounded-base font-bold text-lg focus-visible:ring-0 focus-visible:bg-yellow-100 transition-colors p-6 resize-y shadow-sm" />
            </div>
          </div>
        </div>

        {/* Section 2: Kategori & Cakupan */}
        <div className="bg-white p-8 rounded-base border-4 border-border shadow-shadow flex flex-col gap-8 relative mt-4">
          <div className="absolute -top-5 left-8 bg-[#87CEEB] border-4 border-border shadow-shadow px-4 py-1 rounded-base font-black uppercase text-lg">
            2. KATEGORI & TIPE
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <div className="flex flex-col gap-3">
              <label className="text-base font-black text-slate-900 uppercase">Tipe Event <span className="text-red-500">*</span></label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <select required className="w-full pl-12 h-14 bg-[#F4F4F0] border-4 border-border rounded-base font-bold text-lg focus:outline-none focus:bg-yellow-100 appearance-none shadow-sm cursor-pointer">
                  <option value="">PILIH TIPE EVENT</option>
                  <option value="Lomba Akademik">LOMBA AKADEMIK</option>
                  <option value="Lomba Non-Akademik">LOMBA NON-AKADEMIK</option>
                  <option value="Seminar">SEMINAR</option>
                  <option value="Workshop">WORKSHOP</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-black text-slate-900 uppercase">Cakupan Partisipan <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <select required className="w-full pl-12 h-14 bg-[#F4F4F0] border-4 border-border rounded-base font-bold text-lg focus:outline-none focus:bg-yellow-100 appearance-none shadow-sm cursor-pointer">
                  <option value="">PILIH CAKUPAN</option>
                  <option value="internal">INTERNAL (MAHASISWA UBM SAJA)</option>
                  <option value="external">EKSTERNAL (UMUM / KAMPUS LAIN)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Waktu & Tiket */}
        <div className="bg-white p-8 rounded-base border-4 border-border shadow-shadow flex flex-col gap-8 relative mt-4">
          <div className="absolute -top-5 left-8 bg-green-400 border-4 border-border shadow-shadow px-4 py-1 rounded-base font-black uppercase text-lg">
            3. WAKTU & TIKET
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <div className="flex flex-col gap-3">
              <label className="text-base font-black text-slate-900 uppercase">Tanggal Pelaksanaan <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <Input type="date" required className="pl-12 h-14 bg-[#F4F4F0] border-4 border-border rounded-base font-bold text-lg focus-visible:ring-0 focus-visible:bg-yellow-100 shadow-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-black text-slate-900 uppercase">Harga Tiket (Rp)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <Input type="number" min="0" placeholder="0 UNTUK GRATIS" className="pl-12 h-14 bg-[#F4F4F0] border-4 border-border rounded-base font-bold text-lg focus-visible:ring-0 focus-visible:bg-yellow-100 shadow-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-base font-black text-slate-900 uppercase">Maks. Partisipan</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <Input type="number" min="1" placeholder="KOSONGKAN JIKA TAK TERBATAS" className="pl-12 h-14 bg-[#F4F4F0] border-4 border-border rounded-base font-bold text-lg focus-visible:ring-0 focus-visible:bg-yellow-100 shadow-sm" />
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

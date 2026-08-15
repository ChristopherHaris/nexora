"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { GraduationCap, Store, Building2, ShieldAlert, ArrowRight, Loader2 } from "lucide-react";

export const PortalSelectorView = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by middleware/layout
  }

  const roles = (user.unsafeMetadata?.roles as string[]) || [];
  const displayName = user.firstName || user.username || "Pengguna";

  return (
    <div className="min-h-screen bg-[#F4F4F0] p-6 lg:p-12 font-sans relative overflow-hidden">
      {/* Neo-brutalist decorations */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-300 border-4 border-border rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] opacity-50 z-0" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary border-4 border-border rounded-base shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] opacity-20 z-0 transform rotate-12" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col min-h-[85vh]">
        {/* Header */}
        <header className="flex items-center justify-between mb-16 bg-white p-4 border-4 border-border rounded-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Link href="/">
            <span className="text-3xl font-black uppercase tracking-tight text-slate-900 ml-2">NEXORA</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-bold text-sm hidden sm:inline-block">Halo, {displayName}!</span>
            <div className="w-10 h-10 rounded-base border-2 border-border overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white">
              <UserButton 
                appearance={{
                  elements: { avatarBox: "w-full h-full" }
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ECA823] border-2 border-border rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-sm mb-6">
              Akses Ganda Terdeteksi
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tight mb-4 drop-shadow-sm">
              Pilih Identitas Anda
            </h1>
            <p className="text-lg md:text-xl font-bold text-slate-600 max-w-2xl mx-auto">
              Anda memiliki akses ke beberapa portal di Nexora. Pilih topi mana yang ingin Anda pakai hari ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
            
            {/* Student Portal Card */}
            {roles.includes("student") && (
              <Link href="/dashboard" className="group">
                <div className="h-full bg-white border-4 border-border rounded-base p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500" />
                  
                  <div className="w-16 h-16 bg-primary border-4 border-border rounded-base flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 z-10 text-white group-hover:bg-green-600 transition-colors">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase text-slate-900 mb-2 z-10">Portal Mahasiswa</h2>
                  <p className="text-sm font-bold text-slate-500 mb-8 z-10 flex-1">Akses layanan kampus, pesan makanan, cari teman lomba, dan info event.</p>
                  
                  <div className="flex items-center text-primary font-black uppercase text-sm z-10 mt-auto">
                    Masuk Sekarang <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            )}

            {/* Partner Portal Card */}
            {roles.includes("partner_tenant") && (
              <Link href="/partner" className="group">
                <div className="h-full bg-white border-4 border-border rounded-base p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ECA823]/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500" />
                  
                  <div className="w-16 h-16 bg-[#ECA823] border-4 border-border rounded-base flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 z-10 text-slate-900 group-hover:bg-yellow-400 transition-colors">
                    <Store className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase text-slate-900 mb-2 z-10">Portal Kantin</h2>
                  <p className="text-sm font-bold text-slate-500 mb-8 z-10 flex-1">Kelola pesanan kantin, pantau omzet, dan atur menu jualan Anda hari ini.</p>
                  
                  <div className="flex items-center text-[#ECA823] font-black uppercase text-sm z-10 mt-auto">
                    Masuk Sekarang <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            )}

            {/* Campus Admin Card */}
            {roles.includes("campus_admin") && (
              <Link href="/campus-admin" className="group">
                <div className="h-full bg-slate-900 border-4 border-border rounded-base p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500" />
                  
                  <div className="w-16 h-16 bg-slate-700 border-4 border-border rounded-base flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 z-10 text-white group-hover:bg-slate-600 transition-colors">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase mb-2 z-10 text-white">Otoritas Kampus</h2>
                  <p className="text-sm font-bold text-slate-400 mb-8 z-10 flex-1">Setujui event mahasiswa, tinjau laporan Lost & Found, dan kelola kantin.</p>
                  
                  <div className="flex items-center text-white font-black uppercase text-sm z-10 mt-auto">
                    Buka Dashboard <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            )}

            {/* Super Admin Card */}
            {roles.includes("super-admin") && (
              <Link href="/nexora-admin" className="group">
                <div className="h-full bg-red-600 border-4 border-border rounded-base p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-black/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500" />
                  
                  <div className="w-16 h-16 bg-black border-4 border-border rounded-base flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 z-10 text-white group-hover:bg-slate-900 transition-colors">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase mb-2 z-10 text-white">Super Admin</h2>
                  <p className="text-sm font-bold text-red-100 mb-8 z-10 flex-1">God-Mode Nexora. Kelola semua kampus, keuangan, dan otorisasi platform global.</p>
                  
                  <div className="flex items-center text-white font-black uppercase text-sm z-10 mt-auto">
                    Buka God-Mode <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

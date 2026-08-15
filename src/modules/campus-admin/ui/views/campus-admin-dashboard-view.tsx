"use client";

import { useUser } from "@clerk/nextjs";
import { Building2, CalendarCheck, Store, Search } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const CampusAdminDashboardView = () => {
  const { user } = useUser();
  const trpc = useTRPC();
  const { data: stats, isLoading } = useQuery(trpc.campusAdmin.getDashboardStats.queryOptions());

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="mb-10 bg-slate-900 p-8 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden text-white">
        {/* Decorative accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-full border-b-4 border-l-4 border-slate-700 -mr-4 -mt-4 opacity-50" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 border-2 border-slate-700 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4 text-white">
            Campus Administrator
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight uppercase">
            Ringkasan Kampus
          </h1>
          <p className="text-lg font-bold text-slate-400 max-w-2xl">
            Selamat datang, {user?.firstName || "Admin"}. Anda sedang memantau aktivitas Nexora untuk wilayah kampus Anda.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-base border-4 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-base border-2 border-border bg-slate-200 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <CalendarCheck className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-red-100 text-red-700 border-2 border-red-200 rounded-base">Pending</span>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Total Event Kampus</span>
          <p className="text-4xl font-black text-slate-900">
            {isLoading ? "..." : stats?.events || 0}
          </p>
        </div>

        <div className="bg-white rounded-base border-4 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-base border-2 border-border bg-slate-200 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Store className="w-6 h-6 text-slate-900" />
            </div>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Total Kantin Aktif</span>
          <p className="text-4xl font-black text-slate-900">
            {isLoading ? "..." : stats?.tenants || 0}
          </p>
        </div>

        <div className="bg-white rounded-base border-4 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-base border-2 border-border bg-slate-200 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Search className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-yellow-100 text-yellow-800 border-2 border-yellow-200 rounded-base">Baru</span>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Laporan L&F</span>
          <p className="text-4xl font-black text-slate-900">0</p>
        </div>

        <div className="bg-white rounded-base border-4 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-base border-2 border-border bg-slate-200 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Building2 className="w-6 h-6 text-slate-900" />
            </div>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Mahasiswa Terdaftar</span>
          <p className="text-4xl font-black text-slate-900">0</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-dashed text-center">
        <h2 className="text-xl font-black text-slate-900 uppercase mb-2">Campus Analytics Engine (Live)</h2>
        <p className="text-slate-500 font-bold">Data tabel persetujuan ditarik dari database secara real-time menggunakan TRPC.</p>
      </div>
    </div>
  );
};

"use client";

import { useUser } from "@clerk/nextjs";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ShieldAlert, Globe, Users, Wallet, TrendingUp } from "lucide-react";

export const SuperAdminDashboardView = () => {
  const { user } = useUser();
  const trpc = useTRPC();
  const { data: stats, isLoading } = useQuery(trpc.superAdmin.getDashboardStats.queryOptions());

  return (
    <div className="w-full">
      {/* Welcome Header */}
      <div className="mb-10 bg-black p-8 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(220,38,38,0.5)] relative overflow-hidden text-white">
        {/* Decorative accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600 rounded-bl-full border-b-4 border-l-4 border-border -mr-10 -mt-10 opacity-20" />
        <div className="absolute bottom-4 right-16 w-16 h-16 bg-white rounded-full border-4 border-border opacity-10" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950 border-2 border-red-900 rounded-base shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] text-xs font-black uppercase mb-4 text-red-500">
            God-Mode Activated
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight uppercase flex items-center gap-4">
            Global Analytics <ShieldAlert className="w-10 h-10 text-red-500" />
          </h1>
          <p className="text-lg font-bold text-slate-400 max-w-2xl">
            Selamat datang, Owner. Anda memiliki akses penuh ke seluruh jaringan kampus dan metrik finansial Nexora.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900 rounded-base border-4 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-base border-2 border-border bg-slate-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-green-950 text-green-500 border-2 border-green-900 rounded-base">Aktif</span>
          </div>
          <span className="block text-sm font-black text-slate-400 uppercase mb-1">Kampus Terhubung</span>
          <p className="text-4xl font-black text-white">
            {isLoading ? "..." : stats?.campuses || 0}
          </p>
        </div>

        <div className="bg-slate-900 rounded-base border-4 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-base border-2 border-border bg-slate-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="block text-sm font-black text-slate-400 uppercase mb-1">Total Pengguna</span>
          <p className="text-4xl font-black text-white">
            {isLoading ? "..." : stats?.users || 0}
          </p>
        </div>

        <div className="bg-slate-900 rounded-base border-4 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-base border-2 border-border bg-slate-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="block text-sm font-black text-slate-400 uppercase mb-1">Total Transaksi</span>
          <p className="text-4xl font-black text-white flex items-center gap-2">
            {isLoading ? "..." : stats?.transactions || 0}
          </p>
        </div>

        <div className="bg-slate-900 rounded-base border-4 border-border p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-base border-2 border-border bg-slate-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-green-950 text-green-500 border-2 border-green-900 rounded-base">Aktif</span>
          </div>
          <span className="block text-sm font-black text-slate-400 uppercase mb-1">Total Tenant</span>
          <p className="text-4xl font-black text-white">
            {isLoading ? "..." : stats?.tenants || 0}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 p-8 rounded-base border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-dashed text-center">
        <h2 className="text-xl font-black text-white uppercase mb-2">Global Analytics Engine (Live)</h2>
        <p className="text-slate-400 font-bold">Data agregat di atas ditarik langsung dari PostgreSQL secara realtime menggunakan TRPC.</p>
      </div>
    </div>
  );
};

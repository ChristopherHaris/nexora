"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Trophy,
  Users,
  Coffee,
  Search,
  Briefcase,
  ArrowRight,
  Calendar,
  UserCheck,
  ClipboardList,
  Clock,
  ChefHat,
  CheckCircle2,
  Sparkles,
  Store,
  QrCode,
} from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const quickLinks = [
  {
    title: "Event & Lomba",
    description: "Jelajahi event kampus dan kompetisi terbaru",
    href: "/events",
    icon: Trophy,
    color: "bg-primary/10 text-primary",
    borderColor: "hover:border-primary/30",
  },
  {
    title: "Teammate Matcher",
    description: "Cari atau bergabung dengan tim lomba",
    href: "/teams",
    icon: Users,
    color: "bg-[#ECA823]/10 text-[#ECA823]",
    borderColor: "hover:border-[#ECA823]/30",
  },
  {
    title: "Smart Kantin",
    description: "Pesan makanan tanpa antrean panjang",
    href: "/canteen",
    icon: Coffee,
    color: "bg-primary/10 text-primary",
    borderColor: "hover:border-primary/30",
  },
  {
    title: "Lost & Found",
    description: "Laporkan atau cari barang hilang",
    href: "/lost-found",
    icon: Search,
    color: "bg-[#ECA823]/10 text-[#ECA823]",
    borderColor: "hover:border-[#ECA823]/30",
    comingSoon: false,
  },
  {
    title: "Career Compass",
    description: "Jelajahi jalur karir sesuai jurusanmu",
    href: "/career",
    icon: Briefcase,
    color: "bg-primary/10 text-primary",
    borderColor: "hover:border-primary/30",
    comingSoon: false,
  },
  {
    title: "Nexora Wallet",
    description: "Dompet digital, tukar koin jadi diskon kantin",
    href: "/wallet",
    icon: Coffee,
    color: "bg-[#ECA823]/10 text-[#ECA823]",
    borderColor: "hover:border-[#ECA823]/30",
  },
  {
    title: "Quests & XP",
    description: "Selesaikan misi harian, naik level!",
    href: "/quests",
    icon: Sparkles,
    color: "bg-primary/10 text-primary",
    borderColor: "hover:border-primary/30",
  },
  {
    title: "Peer Learning",
    description: "Belajar bareng tutor sebaya",
    href: "/peer-learning",
    icon: UserCheck,
    color: "bg-[#ECA823]/10 text-[#ECA823]",
    borderColor: "hover:border-[#ECA823]/30",
  },
  {
    title: "Mini-Cases",
    description: "Studi kasus industri + sertifikat",
    href: "/mini-cases",
    icon: ClipboardList,
    color: "bg-primary/10 text-primary",
    borderColor: "hover:border-primary/30",
  },
];

function getStatusStep(status: string) {
  switch (status) {
    case "PAID":
    case "CONFIRMED":
      return 1;
    case "COOKING":
      return 2;
    case "READY_FOR_PICKUP":
      return 3;
    case "COMPLETED":
      return 4;
    default:
      return 1;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "PAID":
      return { text: "Terbayar (Masuk Antrean)", bg: "bg-blue-100 text-blue-800 border-blue-300" };
    case "CONFIRMED":
      return { text: "Dikonfirmasi Stall", bg: "bg-indigo-100 text-indigo-800 border-indigo-300" };
    case "COOKING":
      return { text: "Sedang Dimasak 🍳", bg: "bg-amber-100 text-amber-800 border-amber-300" };
    case "READY_FOR_PICKUP":
      return { text: "Siap Diambil di Konter! 🍱", bg: "bg-emerald-100 text-emerald-800 border-emerald-400" };
    case "COMPLETED":
      return { text: "Pesanan Selesai", bg: "bg-slate-100 text-slate-700 border-slate-300" };
    default:
      return { text: status, bg: "bg-slate-100 text-slate-800 border-slate-300" };
  }
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const trpc = useTRPC();

  const { data: myOrders, isLoading: loadingOrders } = useQuery({
    ...trpc.canteen.getMyOrders.queryOptions(),
    refetchInterval: 5000,
  });

  const { data: gamStats } = useQuery(
    trpc.gamification.getMyStats.queryOptions()
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const displayName = user.firstName || user.username || user.primaryEmailAddress?.emailAddress || "Mahasiswa";

  const ordersList = myOrders || [];
  const activeOrders = ordersList.filter((o) =>
    ["PAID", "CONFIRMED", "COOKING", "READY_FOR_PICKUP"].includes(o.status)
  );

  return (
    <div className="w-full space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Decorative accents */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-bl-full border-b-4 border-l-4 border-black -mr-4 -mt-4 opacity-50" />
        <div className="absolute bottom-4 right-16 w-12 h-12 bg-primary rounded-full border-4 border-black" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase mb-4">
            Student Portal
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight uppercase">
            Halo, {displayName}! 👋
          </h1>
          <p className="text-base sm:text-lg font-bold text-slate-600 max-w-2xl">
            Selamat datang di Student Portal NEXORA. Pantau pesanan kantin, ikuti event kampus, dan optimalkan aktivitas harianmu.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white rounded-2xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl border-2 border-black bg-yellow-300 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Calendar className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-slate-100 border-2 border-black rounded-lg">Aktif</span>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Event Diikuti</span>
          <p className="text-4xl font-black text-slate-900">0</p>
        </div>

        <div className="bg-white rounded-2xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl border-2 border-black bg-[#0F4C3A] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-slate-100 border-2 border-black rounded-lg">Aktif</span>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Tim Aktif</span>
          <p className="text-4xl font-black text-slate-900">0</p>
        </div>

        <div className="bg-white rounded-2xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl border-2 border-black bg-[#ECA823] flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ClipboardList className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-yellow-100 text-yellow-900 border-2 border-black rounded-lg">
              {activeOrders.length > 0 ? "Live Aktif" : "Riwayat"}
            </span>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Pesanan Kantin</span>
          <p className="text-4xl font-black text-slate-900">
            {ordersList.length}
          </p>
        </div>

        {/* Nexora Coins Card */}
        <div className="bg-white rounded-2xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl border-2 border-black bg-amber-400 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <QrCode className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-amber-100 text-amber-900 border-2 border-black rounded-lg">Koin</span>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Nexora Coins</span>
          <p className="text-4xl font-black text-amber-600">{gamStats?.coins ?? 0}</p>
        </div>

        {/* XP Level Card */}
        <div className="bg-white rounded-2xl border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl border-2 border-black bg-purple-400 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-black uppercase px-2 py-1 bg-purple-100 text-purple-900 border-2 border-black rounded-lg">Level {gamStats?.level ?? 1}</span>
          </div>
          <span className="block text-sm font-black text-slate-500 uppercase mb-1">Experience</span>
          <p className="text-4xl font-black text-purple-700">{gamStats?.xp ?? 0} <span className="text-lg">XP</span></p>
          <Progress value={gamStats?.xpProgressPercent ?? 0} className="h-2 mt-2 bg-slate-200" />
        </div>
      </div>

      {/* Active Canteen Orders Tracking Section */}
      {activeOrders.length > 0 && (
        <div className="bg-white rounded-2xl border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-4 border-black pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ECA823] border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <ChefHat className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tight">
                  Status Pesanan Kantin Aktif
                </h2>
                <p className="text-xs font-bold text-slate-500">
                  Pantau proses pesanan makananmu secara real-time
                </p>
              </div>
            </div>
            <Link href="/canteen">
              <Button className="h-10 px-4 bg-[#0F4C3A] hover:bg-emerald-900 text-white font-black uppercase text-xs rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Pesan Lagi di Kantin
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            {activeOrders.map((order: any) => {
              const currentStep = getStatusStep(order.status);
              const badge = getStatusBadge(order.status);
              const tenant = typeof order.tenant === "object" ? order.tenant : null;
              const items = order.items || [];

              return (
                <div
                  key={order.id}
                  className="bg-[#F4F4F0] border-3 sm:border-4 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5"
                >
                  {/* Top Bar: Order ID, Stall, Code */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase text-slate-500">
                          {order.orderNumber || `#${order.id}`}
                        </span>
                        <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg border-2 border-black ${badge.bg}`}>
                          {badge.text}
                        </span>
                      </div>
                      <h3 className="text-lg font-black uppercase text-slate-900 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-[#0F4C3A]" />
                        {tenant?.name || "Kantin Nexora"}
                      </h3>
                    </div>

                    {/* Meal Pickup Code */}
                    <div className="bg-yellow-200 border-3 border-black p-3 rounded-xl text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
                      <span className="text-[10px] font-black uppercase text-slate-600 block">
                        Kode Ambil Makanan
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
                        {order.pickupCode || "NX-8291"}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Steps Bar */}
                  <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-black uppercase">
                      <div className={`p-2 rounded-lg border-2 ${currentStep >= 1 ? "bg-emerald-100 border-emerald-600 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                        <span className="block text-[10px] text-slate-500">Langkah 1</span>
                        Terbayar
                      </div>
                      <div className={`p-2 rounded-lg border-2 ${currentStep >= 2 ? "bg-amber-100 border-amber-600 text-amber-900 animate-pulse" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                        <span className="block text-[10px] text-slate-500">Langkah 2</span>
                        Sedang Dimasak
                      </div>
                      <div className={`p-2 rounded-lg border-2 ${currentStep >= 3 ? "bg-emerald-500 border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                        <span className="block text-[10px] text-emerald-100">Langkah 3</span>
                        Siap Diambil!
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-white border-2 border-black rounded-xl p-3 sm:p-4 space-y-2">
                    <span className="text-xs font-black uppercase text-slate-500 block border-b pb-1">
                      Detail Menu ({items.length} Menu):
                    </span>
                    <div className="space-y-1 text-xs sm:text-sm font-bold text-slate-800">
                      {items.map((it: any, idx: number) => {
                        const m = typeof it.menuItem === "object" ? it.menuItem : null;
                        return (
                          <div key={it.id || idx} className="flex justify-between">
                            <span>{it.quantity}× {m?.name || "Menu Makanan"}</span>
                            <span className="font-black text-slate-900">{formatCurrency((m?.basePrice || 0) * it.quantity)}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t pt-2 flex justify-between text-xs sm:text-sm font-black text-slate-900">
                      <span>Total Pembayaran</span>
                      <span className="text-[#0F4C3A]">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Access Grid */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase mb-6 flex items-center gap-3">
          Akses Cepat <div className="h-1 flex-1 bg-black rounded-full hidden sm:block" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.comingSoon ? "#" : link.href}
              className={`group relative block p-6 rounded-2xl bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${
                link.comingSoon 
                  ? "cursor-not-allowed opacity-70 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0" 
                  : "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
              }`}
            >
              {link.comingSoon && (
                <span className="absolute top-4 right-4 text-xs font-black uppercase text-slate-900 bg-yellow-300 border-2 border-black px-2 py-1 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Segera Hadir
                </span>
              )}
              <div className={`w-14 h-14 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6 bg-white transition-colors group-hover:bg-slate-50`}>
                <link.icon className="w-7 h-7 text-slate-900" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">{link.title}</h3>
              <p className="text-sm font-bold text-slate-500">{link.description}</p>
              {!link.comingSoon && (
                <ArrowRight className="absolute bottom-6 right-6 w-6 h-6 text-slate-900 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Building2, Users, Settings, Sparkles } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/super-admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manajemen Kampus",
    href: "/super-admin/campuses",
    icon: Building2,
  },
  {
    title: "Pengguna",
    href: "/super-admin/users",
    icon: Users,
  },
  {
    title: "Pengaturan",
    href: "/super-admin/settings",
    icon: Settings,
  },
];

export const SuperAdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 min-h-screen border-r-4 border-black flex flex-col hidden lg:flex sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 border-b-4 border-black bg-[#ECA823]">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-black tracking-tight text-slate-900 uppercase bg-white px-2 py-1 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex items-center gap-1">
            <Sparkles className="w-5 h-5 text-primary" /> NEXORA
          </span>
        </Link>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-xs font-black uppercase rounded-base border-2 border-white/20">
          <ShieldIcon className="w-3 h-3" /> Super Admin
        </div>
      </div>

      <div className="p-4 flex-1">
        <p className="text-slate-400 font-bold text-xs uppercase mb-4 px-2">Menu Utama</p>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-base font-bold transition-all border-2 ${
                  isActive
                    ? "bg-[#ECA823] text-black border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                    : "text-slate-300 border-transparent hover:border-slate-700 hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-black" : "text-slate-400"}`} />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t-4 border-black bg-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-base border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="h-10 w-10 bg-white border-2 border-black rounded-full flex items-center justify-center overflow-hidden">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-full h-full",
                  userButtonPopoverCard: "shadow-shadow border-4 border-black rounded-base",
                }
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate">Administrator</p>
            <p className="text-xs text-slate-400 truncate">Sistem Inti</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2c3 0 5 1 7 2a1 1 0 0 1 1 1v7z"/>
  </svg>
);

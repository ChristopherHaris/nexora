"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Store, 
  Coffee, 
  CalendarCheck, 
  SearchCode, 
  UsersRound, 
  Briefcase,
  Settings,
  LogOut,
  X,
  ChevronLeft
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: React.ReactNode;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

type AdminSidebarProps = {
  collapsed?: boolean;
  mobileOpen?: boolean;
  isMobile?: boolean;
  onToggle?: () => void;
  onMobileClose?: () => void;
};

const navGroups: NavGroup[] = [
  {
    label: "Utama",
    items: [
      { label: "Dashboard", path: "/partner", icon: <LayoutDashboard className="w-5 h-5" /> },
    ],
  },
  {
    label: "Operasional",
    items: [
      { label: "Smart canteen", path: "/partner/canteen", icon: <Store className="w-5 h-5" /> },
      { label: "Kelola Menu", path: "/partner/canteen/menu", icon: <Coffee className="w-5 h-5" /> },
      { label: "Event & Lomba", path: "/partner/events", icon: <CalendarCheck className="w-5 h-5" /> },
      { label: "Lost & Found", path: "/partner/lost-found", icon: <SearchCode className="w-5 h-5" /> },
    ],
  },
  {
    label: "Pengembangan",
    items: [
      { label: "Data Tim", path: "/partner/teams", icon: <UsersRound className="w-5 h-5" /> },
      { label: "Lowongan Karier", path: "/partner/career", icon: <Briefcase className="w-5 h-5" /> },
    ],
  }
];

export default function AdminSidebar({
  collapsed = false,
  mobileOpen = false,
  isMobile = false,
  onToggle,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col",
          isMobile
            ? mobileOpen
              ? "translate-x-0 w-[280px]"
              : "-translate-x-full w-[280px]"
            : collapsed
            ? "w-[80px]"
            : "w-[280px]"
        )}
      >
        {/* Header Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          {(!collapsed || isMobile) && (
            <span className="font-extrabold text-xl text-primary tracking-tight">NEXORA</span>
          )}
          {collapsed && !isMobile && (
            <span className="font-extrabold text-xl text-primary tracking-tight mx-auto">N</span>
          )}

          {isMobile && (
            <button onClick={onMobileClose} className="p-2 text-slate-500 hover:text-slate-900">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="flex flex-col gap-6 px-4">
            {navGroups.map((group, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                {(!collapsed || isMobile) && (
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                    {group.label}
                  </span>
                )}
                {group.items.map((item) => {
                  const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      title={collapsed && !isMobile ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm",
                        isActive 
                          ? "bg-primary text-white shadow-md shadow-primary/20" 
                          : "text-slate-600 hover:bg-slate-100",
                        collapsed && !isMobile && "justify-center px-0"
                      )}
                    >
                      {item.icon}
                      {(!collapsed || isMobile) && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <Link
            href="/partner/settings"
            title={collapsed && !isMobile ? "Pengaturan" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-slate-600 hover:bg-slate-100",
              collapsed && !isMobile && "justify-center px-0"
            )}
          >
            <Settings className="w-5 h-5" />
            {(!collapsed || isMobile) && <span>Pengaturan</span>}
          </Link>
          <Link
            href="/api/auth/logout"
            title={collapsed && !isMobile ? "Keluar" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-red-600 hover:bg-red-50",
              collapsed && !isMobile && "justify-center px-0"
            )}
          >
            <LogOut className="w-5 h-5" />
            {(!collapsed || isMobile) && <span>Keluar</span>}
          </Link>
        </div>

        {/* Collapse Toggle Desktop */}
        {!isMobile && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        )}
      </aside>
    </>
  );
}

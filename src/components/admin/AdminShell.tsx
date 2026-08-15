"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

const STORAGE_KEY = "nexora_admin_sidebar_collapsed";
const MOBILE_BREAKPOINT = 1024; // lg in tailwind

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    queueMicrotask(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setCollapsed(true);
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    });

    const checkViewport = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    // Close mobile drawer on path change
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
        onToggle={handleToggle}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          isMobile ? "ml-0" : collapsed ? "ml-[80px]" : "ml-[280px]"
        )}
      >
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button 
                onClick={() => setMobileOpen(true)}
                className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-semibold text-slate-800 hidden sm:block">Partner Console</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

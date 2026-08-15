"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  ShieldAlert,
  Globe,
  Wallet,
  Users,
  Menu,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SidebarItem = {
  href: string;
  label: string;
  icon: typeof ShieldAlert;
  match: (pathname: string) => boolean;
  disabled?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    href: "/nexora-admin",
    label: "God-Mode Analytics",
    icon: ShieldAlert,
    match: (pathname) => pathname === "/nexora-admin",
  },
  {
    href: "/nexora-admin/campuses",
    label: "Campus Network",
    icon: Globe,
    match: (pathname) => pathname.startsWith("/nexora-admin/campuses"),
    disabled: true,
  },
  {
    href: "/nexora-admin/finances",
    label: "Financial Ledger",
    icon: Wallet,
    match: (pathname) => pathname.startsWith("/nexora-admin/finances"),
    disabled: true,
  },
  {
    href: "/nexora-admin/roles",
    label: "Role Management",
    icon: Users,
    match: (pathname) => pathname.startsWith("/nexora-admin/roles"),
    disabled: true,
  },
];

const SidebarNavLink = ({
  item,
  pathname,
  onNavigate,
}: {
  item: SidebarItem;
  pathname: string;
  onNavigate?: () => void;
}) => {
  const Icon = item.icon;
  const active = item.match(pathname);

  return (
    <Link
      href={item.disabled ? "#" : item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-base border-2 px-3 py-3 text-sm font-black uppercase transition-all duration-150",
        active
          ? "bg-red-600 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white"
          : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:border-border hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:text-white",
        item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:border-transparent hover:shadow-none"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-base border-2 transition-colors",
        active ? "bg-red-700 border-border" : "bg-transparent border-transparent group-hover:bg-slate-700 group-hover:border-border"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1">{item.label}</span>
      {active && (
        <ChevronRight className="h-4 w-4" />
      )}
    </Link>
  );
};

export function SuperAdminShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-slate-950 shadow-sm">
        <div className="w-full h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-base h-10 w-10 bg-slate-800 text-white hover:bg-slate-700"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-slate-950 border-r-4 border-border">
                <div className="flex h-full flex-col p-4">
                  <SheetHeader className="text-left mb-6 pt-2">
                    <SheetTitle>
                      <Link href="/" className="inline-block" onClick={() => setMobileOpen(false)}>
                        <span className="text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                          <ShieldAlert className="text-red-500 w-6 h-6" /> NEXORA
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">
                      Menu Super Admin
                    </p>
                    {sidebarItems.map((item) => (
                      <SidebarNavLink
                        key={item.label}
                        item={item}
                        pathname={pathname}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Logo */}
            <Link href="/" className="hidden lg:flex items-center gap-2">
              <ShieldAlert className="text-red-500 w-8 h-8" />
              <span className="text-3xl font-black tracking-tight text-white uppercase">
                NEXORA
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/portal" className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-950 border-2 border-red-900 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-900 transition-colors cursor-pointer">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-black uppercase text-red-500">Super Admin</span>
            </Link>
            
            <div className="h-10 w-10 bg-white border-2 border-border rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-full h-full",
                    userButtonPopoverCard: "shadow-shadow border-4 border-border rounded-base",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r-4 border-border bg-slate-950 lg:block overflow-y-auto relative z-10">
          <div className="flex flex-col gap-2 p-4 h-full">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 px-2 mt-2">
              God-Mode Tools
            </p>
            {sidebarItems.map((item) => (
              <SidebarNavLink
                key={item.label}
                item={item}
                pathname={pathname}
              />
            ))}
            
            <div className="mt-auto p-4 bg-red-950/50 border-2 border-red-900 rounded-base border-dashed">
              <p className="text-sm font-black text-red-500 uppercase">Perhatian</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Anda memiliki kendali penuh atas sistem. Hati-hati dalam mengubah data.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Building2,
  CalendarCheck,
  Store,
  Search,
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
  icon: typeof Building2;
  match: (pathname: string) => boolean;
  disabled?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    href: "/campus-admin",
    label: "Overview Kampus",
    icon: Building2,
    match: (pathname) => pathname === "/campus-admin",
  },
  {
    href: "/campus-admin/events",
    label: "Event Approvals",
    icon: CalendarCheck,
    match: (pathname) => pathname.startsWith("/campus-admin/events"),
    disabled: true,
  },
  {
    href: "/campus-admin/tenants",
    label: "Tenant Management",
    icon: Store,
    match: (pathname) => pathname.startsWith("/campus-admin/tenants"),
    disabled: true,
  },
  {
    href: "/campus-admin/lost-found",
    label: "L&F Moderation",
    icon: Search,
    match: (pathname) => pathname.startsWith("/campus-admin/lost-found"),
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
          ? "bg-slate-800 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white"
          : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:border-border hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:text-white",
        item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:border-transparent hover:shadow-none"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-base border-2 transition-colors",
        active ? "bg-slate-700 border-border" : "bg-transparent border-transparent group-hover:bg-slate-700 group-hover:border-border"
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

export function CampusAdminShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-slate-900 shadow-sm">
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
              <SheetContent side="left" className="w-[280px] p-0 bg-slate-900 border-r-4 border-border">
                <div className="flex h-full flex-col p-4">
                  <SheetHeader className="text-left mb-6 pt-2">
                    <SheetTitle>
                      <Link href="/" className="inline-block" onClick={() => setMobileOpen(false)}>
                        <span className="text-3xl font-black tracking-tight text-white uppercase">
                          NEXORA
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">
                      Menu Navigasi
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
            <Link href="/" className="hidden lg:flex items-center">
              <span className="text-3xl font-black tracking-tight text-white uppercase">
                NEXORA
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/portal" className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800 border-2 border-slate-700 rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-700 transition-colors cursor-pointer">
              <Building2 className="h-4 w-4 text-slate-300" />
              <span className="text-xs font-black uppercase text-slate-300">Campus Admin</span>
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
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r-4 border-border bg-slate-900 lg:block overflow-y-auto relative z-10">
          <div className="flex flex-col gap-2 p-4 h-full">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 px-2 mt-2">
              Menu Navigasi
            </p>
            {sidebarItems.map((item) => (
              <SidebarNavLink
                key={item.label}
                item={item}
                pathname={pathname}
              />
            ))}
            
            <div className="mt-auto p-4 bg-slate-800 border-2 border-slate-700 rounded-base border-dashed">
              <p className="text-sm font-black text-white uppercase">Akses Terbatas</p>
              <p className="text-xs font-bold text-slate-400 mt-1">Anda berada di mode Administrator Kampus.</p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

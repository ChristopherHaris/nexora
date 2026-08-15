"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Coffee,
  Trophy,
  Users,
  Search,
  Briefcase,
  Menu,
  ChevronRight,
  Wallet,
  Flame,
  GraduationCap,
  FileText,
  Coins,
  Zap,
  CheckSquare,
  Calendar,
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
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

type SidebarItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  match: (pathname: string) => boolean;
  disabled?: boolean;
  isNew?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (pathname) => pathname === "/dashboard",
  },
  {
    href: "/canteen",
    label: "Smart Canteen",
    icon: Coffee,
    match: (pathname) => pathname.startsWith("/canteen"),
  },
  {
    href: "/events",
    label: "Events & Competitions",
    icon: Trophy,
    match: (pathname) => pathname.startsWith("/events"),
  },
  {
    href: "/teams",
    label: "Teammate Matcher",
    icon: Users,
    match: (pathname) => pathname.startsWith("/teams"),
  },
  {
    href: "/lost-found",
    label: "Lost & Found",
    icon: Search,
    match: (pathname) => pathname.startsWith("/lost-found"),
  },
  {
    href: "/career",
    label: "Career Compass",
    icon: Briefcase,
    match: (pathname) => pathname.startsWith("/career"),
  },
  {
    href: "/wallet",
    label: "Nexora Wallet",
    icon: Wallet,
    match: (pathname) => pathname.startsWith("/wallet"),
  },
  {
    href: "/quests",
    label: "Quests & XP",
    icon: Flame,
    match: (pathname) => pathname.startsWith("/quests"),
  },
  {
    href: "/peer-learning",
    label: "Peer Learning",
    icon: GraduationCap,
    match: (pathname) => pathname.startsWith("/peer-learning"),
  },
  {
    href: "/mini-cases",
    label: "Campus Gigs",
    icon: FileText,
    match: (pathname) => pathname.startsWith("/mini-cases"),
  },
  {
    href: "/study-tasks",
    label: "Study Tasks",
    icon: CheckSquare,
    match: (pathname) => pathname.startsWith("/study-tasks"),
  },
  {
    href: "/calendar",
    label: "My Calendar",
    icon: Calendar,
    match: (pathname) => pathname.startsWith("/calendar"),
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
          ? "bg-[#ECA823] border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-slate-900"
          : "bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:border-border hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:text-slate-900",
        item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:border-transparent hover:shadow-none"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 items-center justify-center rounded-base border-2 transition-colors",
        active ? "bg-white border-border" : "bg-transparent border-transparent group-hover:bg-white group-hover:border-border"
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

export function StudentDashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const trpc = useTRPC();

  const { data: stats } = useQuery({
    ...trpc.gamification.getMyStats.queryOptions(),
  });

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col font-sans relative">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-white shadow-sm">
        <div className="w-full h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-base h-10 w-10 bg-yellow-300"
                >
                  <Menu className="h-5 w-5 text-slate-900" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-[#F4F4F0] border-r-4 border-border">
                <div className="flex h-full flex-col p-4">
                  <SheetHeader className="text-left mb-6 pt-2">
                    <SheetTitle>
                      <Link href="/" className="inline-block" onClick={() => setMobileOpen(false)}>
                        <span className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                          NEXORA
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">
                      Navigation
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
              <span className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                NEXORA
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Nexora Coins Badge */}
            <Link href="/wallet" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 border-2 border-border rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all">
              <Coins className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-black text-amber-900">
                {stats?.coins ?? 0}
              </span>
            </Link>

            {/* XP Level Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 border-2 border-border rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-black text-purple-900">
                Lv.{stats?.level ?? 1} · {stats?.xp ?? 0} XP
              </span>
            </div>

            {/* Student Portal Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-200 border-2 border-border rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
              <span className="text-xs font-black uppercase text-green-900">Student Portal</span>
            </div>
            
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

      <div className="flex flex-1 w-full relative">
        {/* Desktop Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r-4 border-border bg-white lg:flex flex-col z-10">
          <div className="flex flex-col gap-2 p-4 flex-1 overflow-y-auto">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-2 mt-2">
              Navigation
            </p>
            {sidebarItems.map((item) => (
              <SidebarNavLink
                key={item.label}
                item={item}
                pathname={pathname}
              />
            ))}
            
            <div className="mt-auto p-4 bg-yellow-50 border-2 border-border rounded-base border-dashed">
              <p className="text-sm font-black text-slate-900 uppercase">Need Assistance?</p>
              <p className="text-xs font-bold text-slate-500 mt-1">Contact NEXORA support for technical issues.</p>
              <Link href="/support">
                <Button variant="outline" className="w-full mt-3 bg-white border-2 border-border font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Support
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 relative flex flex-col min-h-[calc(100vh-64px)]">
          <div className="fixed top-10 right-10 w-64 h-64 bg-primary/5 border-4 border-primary/10 rounded-full blur-3xl -z-10" />
          <div className="fixed bottom-10 left-10 w-64 h-64 bg-yellow-300/5 border-4 border-yellow-300/10 rounded-full blur-3xl -z-10" />
          
          <div className="mx-auto max-w-6xl w-full flex-1">
            {children}
          </div>

          <footer className="w-full mt-6 mb-6 bg-white border-4 border-black p-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                NEXORA
              </span>
              <span className="text-sm font-bold text-slate-500">© 2026</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-black uppercase text-slate-700">
              <Link href="/about" className="hover:underline decoration-2 underline-offset-4">About</Link>
              <Link href="/support" className="hover:underline decoration-2 underline-offset-4">Support</Link>
              <Link href="/privacy" className="hover:underline decoration-2 underline-offset-4">Privacy</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}


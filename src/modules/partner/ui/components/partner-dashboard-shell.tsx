"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Settings,
  Menu,
  ChevronRight,
  Store,
  Loader2,
  PlusCircle,
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
};

const sidebarItems: SidebarItem[] = [
  {
    href: "/partner",
    label: "Dashboard",
    icon: LayoutDashboard,
    match: (p) => p === "/partner",
  },
  {
    href: "/partner/menu",
    label: "Menu Management",
    icon: Utensils,
    match: (p) => p.startsWith("/partner/menu"),
  },
  {
    href: "/partner/orders",
    label: "Incoming Orders",
    icon: ShoppingBag,
    match: (p) => p.startsWith("/partner/orders"),
  },
  {
    href: "/partner/settings",
    label: "Canteen Settings",
    icon: Settings,
    match: (p) => p.startsWith("/partner/settings"),
  },
];

function SidebarNavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: SidebarItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const active = item.match(pathname);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-base border-2 px-3 py-3 text-sm font-black uppercase transition-all duration-150",
        active
          ? "bg-slate-900 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white"
          : "bg-transparent border-transparent text-slate-600 hover:bg-[#ECA823] hover:border-border hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:text-slate-900"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-base border-2 transition-colors",
          active
            ? "bg-slate-800 border-border"
            : "bg-transparent border-transparent group-hover:bg-white group-hover:border-border group-hover:text-slate-900"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1">{item.label}</span>
      {active && <ChevronRight className="h-4 w-4" />}
    </Link>
  );
}

function TenantBadge() {
  const trpc = useTRPC();
  const { data: tenant, isLoading } = useQuery(trpc.tenants.getMyTenant.queryOptions());

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 border-2 border-border rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <Loader2 className="h-3 w-3 animate-spin text-slate-600" />
        <span className="text-xs font-black uppercase text-slate-600">Loading...</span>
      </div>
    );
  }

  if (!tenant?.name) {
    return (
      <Link
        href="/partner/settings"
        className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-yellow-50 border-2 border-border rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors"
      >
        <PlusCircle className="h-4 w-4 text-[#ECA823] shrink-0" />
        <span className="text-xs font-black uppercase text-slate-900">
          + Setup Canteen
        </span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 border-2 border-border rounded-base shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <Store className="h-4 w-4 text-slate-900 shrink-0" />
      <span className="text-xs font-black uppercase text-slate-900 max-w-[200px] truncate">
        {tenant.name}
      </span>
    </div>
  );
}

function TenantSidebarInfo() {
  const trpc = useTRPC();
  const { data: tenant, isLoading } = useQuery(trpc.tenants.getMyTenant.queryOptions());

  return (
    <div className="mb-4 px-2">
      <div className="p-3 bg-[#ECA823]/20 border-2 border-[#ECA823] rounded-base">
        <div className="flex items-center gap-2 mb-1">
          <Store className="h-4 w-4 text-slate-900 shrink-0" />
          <p className="text-xs font-black text-slate-600 uppercase">Your Canteen</p>
        </div>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-slate-700 mt-1" />
        ) : tenant?.name ? (
          <div>
            <p className="text-base font-black text-slate-900 truncate leading-tight">
              {tenant.name}
            </p>
            {tenant.locationDetail && (
              <p className="text-xs font-bold text-slate-500 truncate mt-0.5">
                {tenant.locationDetail}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-xs font-bold text-slate-500 mb-1.5">Not configured yet</p>
            <Link
              href="/partner/settings"
              className="inline-flex items-center gap-1 text-xs font-black uppercase text-slate-900 bg-[#ECA823] hover:bg-yellow-500 px-2 py-1 rounded-base border border-border"
            >
              + Setup Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export function PartnerDashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-[#ECA823] shadow-sm">
        <div className="w-full h-16 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden border-2 border-border shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-base h-10 w-10 bg-white"
                >
                  <Menu className="h-5 w-5 text-slate-900" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-[#F4F4F0] border-r-4 border-border">
                <div className="flex h-full flex-col p-4">
                  <SheetHeader className="text-left mb-4 pt-2">
                    <SheetTitle>
                      <Link href="/" onClick={() => setMobileOpen(false)}>
                        <span className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                          NEXORA
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>
                  <TenantSidebarInfo />
                  <div className="flex-1 overflow-y-auto space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">
                      Merchant Menu
                    </p>
                    {sidebarItems.map((item) => (
                      <SidebarNavLink
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="hidden lg:flex items-center">
              <span className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                NEXORA
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <TenantBadge />
            </div>

            <div className="h-10 w-10 bg-white border-2 border-border rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-full h-full",
                    userButtonPopoverCard:
                      "shadow-shadow border-4 border-border rounded-base",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full overflow-hidden">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 border-r-4 border-border bg-white lg:block overflow-y-auto relative z-10">
          <div className="flex flex-col gap-2 p-4 h-full">
            <TenantSidebarInfo />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 px-2">
              Merchant Menu
            </p>
            {sidebarItems.map((item) => (
              <SidebarNavLink key={item.href} item={item} pathname={pathname} />
            ))}

            <div className="mt-auto p-4 bg-[#ECA823]/10 border-2 border-border rounded-base border-dashed">
              <p className="text-sm font-black text-slate-900 uppercase">Need Help?</p>
              <p className="text-xs font-bold text-slate-500 mt-1">
                Contact Nexora Partner Support for business inquiries.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

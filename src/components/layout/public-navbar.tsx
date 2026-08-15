"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/events", label: "Event & Lomba" },
  { href: "/teams", label: "Teammate Matcher" },
  { href: "/canteen", label: "Smart canteen" },
  { href: "/lost-found", label: "Lost & Found" },
];

export const PublicNavbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();

  const roles = (user?.unsafeMetadata?.roles || user?.publicMetadata?.roles || []) as string[];
  const isStudent = roles.includes("student");
  const isPartner = roles.includes("partner_tenant");
  const dashboardHref = isStudent ? "/dashboard" : "/partner";

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-border bg-white">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary tracking-tight uppercase">
            NEXORA
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-bold transition-colors hover:text-primary uppercase tracking-wide",
                pathname === link.href
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {!isLoaded ? (
            <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-base border-2 border-border" />
          ) : isSignedIn ? (
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-2 border-border rounded-base font-black uppercase text-xs hover:bg-yellow-300 transition-colors"
                  >
                    Dashboard
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 border-4 border-border shadow-shadow rounded-base p-2">
                  {isStudent ? (
                    <DropdownMenuItem asChild className="font-bold cursor-pointer hover:bg-slate-100 p-3 rounded-md mb-2">
                      <Link href="/dashboard">Portal Mahasiswa</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild className="font-bold cursor-pointer hover:bg-slate-100 p-3 rounded-md mb-2">
                      <Link href="/add-role">Daftar Mahasiswa</Link>
                    </DropdownMenuItem>
                  )}
                  {isPartner ? (
                    <DropdownMenuItem asChild className="font-bold cursor-pointer hover:bg-slate-100 p-3 rounded-md">
                      <Link href="/partner">Portal Partner</Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild className="font-bold cursor-pointer hover:bg-slate-100 p-3 rounded-md">
                      <Link href="/add-role">Buka Kantin</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <UserButton

                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 border-2 border-border rounded-base",
                  },
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="border-2 border-border rounded-base font-black uppercase text-xs hover:bg-yellow-300 transition-colors"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-green-700 text-white border-2 border-border rounded-base font-black uppercase text-xs shadow-shadow transition-all hover:-translate-y-0.5">
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t-4 border-border bg-white absolute top-20 left-0 w-full flex flex-col p-4 shadow-lg z-50">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "py-3 text-base font-bold border-b-2 border-border uppercase",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 pb-2">
            {!isLoaded ? (
              <div className="w-full h-10 bg-gray-200 animate-pulse rounded-base border-2 border-border" />
            ) : isSignedIn ? (
              <div className="flex flex-col gap-3">
                  <>
                    {isStudent ? (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        <Button className="w-full bg-primary hover:bg-green-700 text-white border-2 border-border rounded-base font-black uppercase">
                          Portal Mahasiswa
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href="/add-role"
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full border-2 border-border rounded-base font-black uppercase">
                          Daftar Mahasiswa
                        </Button>
                      </Link>
                    )}
                    {isPartner ? (
                      <Link
                        href="/partner"
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        <Button className="w-full bg-primary hover:bg-green-700 text-white border-2 border-border rounded-base font-black uppercase">
                          Portal Partner
                        </Button>
                      </Link>
                    ) : (
                      <Link
                        href="/add-role"
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full border-2 border-border rounded-base font-black uppercase">
                          Buka Kantin
                        </Button>
                      </Link>
                    )}
                  </>
                <div className="flex justify-center mt-2">
                  <UserButton />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-border rounded-base font-black uppercase"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-green-700 text-white border-2 border-border rounded-base font-black uppercase shadow-shadow">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

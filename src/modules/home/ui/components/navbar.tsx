"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, isActive, children }: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="default"
      className={cn(
        "bg-transparent hover:bg-transparent border-transparent hover:underline hover:decoration-2 hover:underline-offset-4 px-3.5 text-lg text-foreground dark:text-foreground",
        isActive && "underline decoration-2 underline-offset-4"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  {
    href: "/",
    children: "Home",
  },
  {
    href: "/about",
    children: "About",
  },
  {
    href: "/activities",
    children: "Activities",
  },
  {
    href: "/blog",
    children: "Blog",
  },
  {
    href: "/info",
    children: "Student Info",
  },
  {
    href: "/contact",
    children: "Contact Us",
  },
];

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="h-20 flex border-b-2 border-b-main-foreground justify-between font-medium bg-secondary-background dark:bg-secondary-background">
      <Link href="/" className="pl-6 flex items-center">
        <div className="relative w-14 h-14">
          <Image src="/logo.png" alt="logo" fill />
        </div>
      </Link>

      <div className="items-center gap-4 hidden lg:flex">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={item.href === pathname}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>
      <div className="flex">
        <div className="flex px-6 py-4 gap-2">
          <SidebarTrigger
            className="px-2 flex lg:hidden"
            variant="default"
            size="icon"
          />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

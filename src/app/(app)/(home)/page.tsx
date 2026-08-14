import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/home/ui/components/app-sidebar";
import { SiteHeader } from "@/modules/home/ui/components/site-header";
import { ArrowDown, ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  metadataBase: new URL("https://sema-ftd-web.vercel.app/"),
  title: "Sema FTD",
  description:
    "Sema FTD is a student organization that aims to provide a platform for students to develop their skills and interests in the field of technology.",
  generator: "Sema FTD",
  applicationName: "Website Sema FTD",
  referrer: "origin-when-cross-origin",
  keywords: [
    "Sema FTD",
    "Senat Mahasiswa FTD",
    "UBM",
    "FTD",
    "Senat Mahasiswa FTD UBM",
    "Senat Mahasiswa UBM",
  ],
  creator: "Christopher Haris",
  publisher: "Christopher Haris",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function Home() {
  return (
    <div className="px-6 lg:px-20 py-15 flex flex-col gap-4">
      <div>
        Home
      </div>
    </div>
  );
}

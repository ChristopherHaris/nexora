import { Button } from "@/components/ui/button";
import { LucideArrowRight, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Contact Sema FTD",
  description: "Contact Sema FTD",
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
    "Contact Sema FTD",
    "Contact Senat Mahasiswa FTD",
    "Contact Senat Mahasiswa FTD UBM",
    "Contact Senat Mahasiswa UBM",
  ],
  creator: "Christopher Haris",
  publisher: "Christopher Haris",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const Page = () => {
  return (
    <div className="px-4 lg:px-20 py-20 flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-start">
        <h1 className="text-5xl lg:text-6xl font-extrabold">
          Let&apos;s
          <br />
          <span className="text-main">Connect</span>
        </h1>
      </div>
      <div className="flex flex-col w-50 gap-5 mt-10">
        <Button className="justify-between h-14">
          <Link
            href="https://www.instagram.com/ubm_semaftd/"
            target="_blank"
            className="flex flex-row gap-2 mx-2 items-center"
          >
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={16}
              height={16}
            />
            <p className="text-base">Instagram</p>
          </Link>
          <LucideArrowRight />
        </Button>
        <Button className="justify-between h-14">
          <Link
            href="mailto:fakultasteknodesign@gmail.com?subject=Inquiry&body=Hey, let's..."
            target="_blank"
            className="flex flex-row gap-2 mx-2 items-center"
          >
            <Mail className="h-5 w-5" />
            <p className="text-base">Email</p>
          </Link>
          <LucideArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Page;

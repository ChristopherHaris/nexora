import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <>
      <footer className="flex border-t-2 border-t-main-foreground justify-between font-medium p-5 bg-secondary-background dark:bg-secondary-background">
        <div className="flex items-center gap-2 text-sm md:text-base">
          <p>Senat Mahasiswa FTD UBM</p>
        </div>
        <div className="flex flex-col items-start gap-2 mx-5">
          <Link
            href="https://www.instagram.com/ubm_semaftd/"
            target="_blank"
            className="flex gap-2 items-center"
          >
            <Image
              src="/instagram.svg"
              alt="instagram"
              width={16}
              height={16}
            />
            <p className="text-xs md:text-sm hover:underline hover:underline-offset-2 ">
              @ubm_semaftd
            </p>
          </Link>
          <Link
            href="mailto:fakultasteknodesign@gmail.com?subject=Inquiry&body=Hey, let's..."
            target="_blank"
            className="flex gap-2 items-center"
          >
            <Mail className="h-4 w-4" />
            <p className="text-xs md:text-sm hover:underline hover:underline-offset-2">
              fakultasteknodesign@gmail.com
            </p>
          </Link>
        </div>
      </footer>
      <footer className="flex border-t-2 border-t-main-foreground justify-between font-medium p-5 bg-secondary-background dark:bg-secondary-background">
        <div className="flex items-center gap-2">
          <p className="text-xs">
            &copy; 2025 Senat Mahasiswa Fakultas Teknologi dan Desain,
            Universitas Bunda Mulia
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 mx-5 text-xs md:text-sm">
          <p>
            Made With ❤️ by{" "}
            <a
              className="hover:underline hover:underline-offset-2"
              href="https://github.com/ChristopherHaris"
              target="_blank"
            >
              Sakana
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

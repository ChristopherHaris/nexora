import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Info NEXORA",
  description: "Info NEXORA",
  generator: "NEXORA",
  applicationName: "Website NEXORA",
  referrer: "origin-when-cross-origin",
  keywords: [
    "NEXORA",
    "Senat Mahasiswa FTD",
    "UBM",
    "FTD",
    "Senat Mahasiswa FTD UBM",
    "Senat Mahasiswa UBM",
    "NEXORA Info",
    "Info Senat Mahasiswa FTD",
    "Info Senat Mahasiswa FTD UBM",
    "Info Senat Mahasiswa UBM",
  ],
  creator: "Christopher Haris",
  publisher: "Christopher Haris",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const data = [
  {
    title: "Internal Event",
    href: "/activities?tags=Internal",
  },
  {
    title: "Seminar",
    href: "/activities?tags=Seminar",
  },
  {
    title: "Workshop",
    href: "/activities?tags=Workshop",
  },
  {
    title: "Competition",
    href: "/activities?tags=Competition",
  },
  {
    title: "Scholarship",
    href: "/activities?tags=Scholarship",
  },
];

const Page = () => {
  return (
    <div className="relative mx-auto h-full max-w-200 px-4 md:px-8 py-10">
      <div className="flex flex-col my-10 gap-12">
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {data.map((item) => (
              <Card
                key={item.title}
                className="w-56 h-56 max-w-sm bg-main mx-auto justify-between py-6"
              >
                <CardHeader>
                  <CardTitle className="text-3xl text-center mt-9">
                    {item.title}
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardFooter className="items-center justify-center">
                  <Link href={item.href}>
                    <Button className="" variant="secondary">
                      See Details <ArrowRightIcon />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

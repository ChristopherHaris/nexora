"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Media } from "@/payload-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  eventId: string;
};

export const EventView = ({ eventId }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.events.getOne.queryOptions({ eventId })
  );

  if (!data) return <div>Event not found</div>;

  const poster = data.poster as Media | null;

  return (
    <div className="px-4 lg:px-20 py-14 md:py-20 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3">
          <div className="rounded-base border-2 border-border overflow-hidden bg-pink-200">
            <Image
              src={poster?.url || ""}
              alt={data.name}
              width={1000}
              height={1000}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        <div className="w-full md:w-2/3 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{data.type}</Badge>
              <Badge variant="secondary">{data.scope}</Badge>
              {data.isOnline && <Badge variant="secondary">Online</Badge>}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">{data.name}</h1>
          </div>

          <div className="bg-main border-2 border-border rounded-base p-6 shadow-shadow flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-600">Tanggal Pelaksanaan</span>
              <span className="text-xl font-semibold">
                {data.eventDate ? formatDate(data.eventDate) : "TBA"}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-600">Batas Pendaftaran</span>
              <span className="text-xl font-semibold text-red-600">
                {data.registrationDeadline ? formatDate(data.registrationDeadline) : "TBA"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-600">Lokasi</span>
              <span className="text-lg">{data.location || "Online"}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-600">Kuota Tersisa</span>
              <span className="text-lg">{data.quota ? `${data.quota} Orang` : "Unlimited"}</span>
            </div>
          </div>

          <div className="bg-white border-2 border-border rounded-base p-6 shadow-shadow mt-2">
            <h2 className="text-2xl font-bold mb-4">Deskripsi Event</h2>
            <div className="whitespace-pre-wrap text-justify leading-relaxed">
              {data.description}
            </div>
          </div>
          
          <div className="mt-4">
            <Button size="lg" className="w-full md:w-auto text-xl px-10 py-6">
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

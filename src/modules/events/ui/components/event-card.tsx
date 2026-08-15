import { cn, formatDate } from "@/lib/utils";
import { Event } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";
import { Media } from "@/payload-types";
import { Calendar, MapPin, Users, ArrowRight, Tag } from "lucide-react";

type Props = {
  data: Event & { poster: Media | null };
  className?: string;
};

export default function EventCard({ data, className }: Props) {
  const isFree = data.ticketPrice === 0;

  return (
    <Link prefetch href={`/events/${data.id}`} className="block group">
      <div
        className={cn(
          "w-full overflow-hidden rounded-base border-4 border-border bg-white shadow-shadow flex flex-col mb-6 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
          className
        )}
      >
        {/* Poster Image Area */}
        <div className="relative w-full h-56 border-b-4 border-border bg-[#F4F4F0]">
          {data.poster?.url ? (
            <Image
              src={data.poster.url}
              alt={data.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-widest">No Poster</span>
            </div>
          )}
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <span className="px-4 py-1.5 bg-yellow-300 border-2 border-border shadow-shadow font-black uppercase text-xs rounded-base flex items-center gap-2">
              <Tag className="w-3 h-3" /> {data.category}
            </span>
            
            {isFree ? (
              <span className="px-4 py-1.5 bg-green-400 border-2 border-border shadow-shadow font-black uppercase text-xs rounded-base">
                Gratis
              </span>
            ) : (
              <span className="px-4 py-1.5 bg-primary text-white border-2 border-border shadow-shadow font-black uppercase text-xs rounded-base">
                Rp {data.ticketPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col w-full flex-1">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-slate-900 line-clamp-2 leading-tight uppercase group-hover:text-primary transition-colors">
              {data.title}
            </h2>
          </div>
          
          <p className="text-slate-700 text-base font-medium line-clamp-2 mb-6 flex-1">
            {data.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex flex-col gap-1 p-3 bg-slate-100 border-2 border-border rounded-base">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <Calendar className="w-4 h-4" /> Waktu
              </div>
              <span className="font-bold text-sm line-clamp-1">{data.eventStart ? formatDate(data.eventStart) : "TBA"}</span>
            </div>
            
            <div className="flex flex-col gap-1 p-3 bg-slate-100 border-2 border-border rounded-base">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <MapPin className="w-4 h-4" /> Cakupan
              </div>
              <span className="font-bold text-sm line-clamp-1">{data.locationFormat}</span>
            </div>
          </div>
          
          <div className="pt-4 border-t-4 border-border border-dashed flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold bg-[#ECA823] px-3 py-1 rounded-base border-2 border-border">
              <Users className="w-4 h-4" />
              <span className="text-xs uppercase">{data.maxQuota ? `${data.maxQuota} Kuota` : "Tanpa Kuota"}</span>
            </div>
            
            <div className="w-10 h-10 bg-primary border-2 border-border shadow-shadow rounded-base flex items-center justify-center text-white group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:bg-yellow-300 group-hover:text-black transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const EventCardSkeleton = () => {
  return (
    <div className="w-full h-[450px] rounded-base border-4 border-border bg-yellow-100 animate-pulse mb-6 flex flex-col">
      <div className="w-full h-56 bg-slate-200 border-b-4 border-border"></div>
      <div className="p-6 w-full flex flex-col gap-4">
        <div className="w-3/4 h-8 bg-slate-300 rounded-md"></div>
        <div className="w-full h-4 bg-slate-300 rounded-md mt-2"></div>
        <div className="w-2/3 h-4 bg-slate-300 rounded-md"></div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-16 bg-slate-300 border-2 border-border rounded-base"></div>
          <div className="h-16 bg-slate-300 border-2 border-border rounded-base"></div>
        </div>
      </div>
    </div>
  );
};

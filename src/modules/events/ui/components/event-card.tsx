import { cn, formatDate } from "@/lib/utils";
import { Event } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";
import { Media } from "@/payload-types";
import { Badge } from "@/components/ui/badge";

type Props = {
  data: Event & { poster: Media | null };
  className?: string;
};

export default function EventCard({ data, className }: Props) {
  return (
    <Link prefetch href={`/events/${data.id}`}>
      <div
        className={cn(
          "w-full overflow-hidden rounded-base border-2 border-border font-base flex mb-2 bg-pink-200",
          className
        )}
      >
        <div className="flex min-w-25 max-w-25 md:min-w-50">
          <Image
            src={data.poster?.url || ""}
            alt="poster"
            width={500}
            height={500}
            className="rounded-base w-full h-full aspect-square object-cover object-top"
          />
        </div>
        <div className="mx-4 my-4 flex flex-col w-full">
          <div className="flex justify-between items-start">
            <h2 className="text-sm md:text-xl font-semibold line-clamp-1">
              {data.name}
            </h2>
            <Badge variant="secondary">{data.type}</Badge>
          </div>
          <div className="text-main-foreground border-border text-xs md:text-base font-bold mt-1">
            {data.eventDate ? formatDate(data.eventDate) : "TBA"}
          </div>
          <div className="text-main-foreground border-border text-xs md:text-base mt-2 line-clamp-2">
            {data.description}
          </div>
        </div>
      </div>
    </Link>
  );
}

export const EventCardSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-base border-2 border-border font-base flex mb-2 bg-pink-200 animate-pulse h-[100px]"></div>
  );
};

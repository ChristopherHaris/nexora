"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEventsFilters } from "@/modules/events/hooks/use-event-filters";
import { DEFAULT_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import EventCard from "@/modules/events/ui/components/event-card";

export const EventList = () => {
  const [filters] = useEventsFilters();
  const trpc = useTRPC();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.events.getMany.infiniteQueryOptions(
        { ...filters, limit: DEFAULT_LIMIT },
        {
          getNextPageParam: (lastPage) =>
            lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
        }
      )
    );

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4 bg-[#F4F4F0] border-4 border-border rounded-base shadow-shadow w-full">
        <div className="w-20 h-20 bg-yellow-300 rounded-base border-4 border-border shadow-shadow flex items-center justify-center text-slate-800 transform -rotate-3">
          <InboxIcon className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black uppercase mt-4">Belum ada event tersedia</h3>
        <p className="text-lg font-bold text-slate-600">Silakan kembali lagi nanti atau coba ubah filter Anda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.pages.map((page, pageIndex) => (
          <div key={pageIndex} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {page.docs.map((event) => (
              <EventCard key={event.id} data={event as unknown as React.ComponentProps<typeof EventCard>["data"]} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-8 border-t-4 border-border border-dashed">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            size="lg"
            className="rounded-base border-4 border-border shadow-shadow bg-yellow-300 text-slate-900 hover:bg-yellow-400 font-black uppercase tracking-wider px-10 py-6 text-lg transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const EventListSkeleton = () => {
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

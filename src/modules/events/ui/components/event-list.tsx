"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useEventsFilters } from "../../hooks/use-event-filters";
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
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No events found</p>
      </div>
    );
  }

  return (
    <>
      <div>
        {data.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.docs.map((event) => (
              <EventCard key={event.id} data={event as any} />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-center pt-8">
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            className="font-medium disabled:opacity-50 text-black hover:text-white bg-white"
            onClick={() => fetchNextPage()}
          >
            Load more
          </Button>
        )}
      </div>
    </>
  );
};

export const EventListSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-base border-2 border-border font-base flex mb-2 bg-amber-300 animate-pulse h-[200px]"></div>
  );
};

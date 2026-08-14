"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useActivitiesFilters } from "../../hooks/use-activity-filters";
import { DEFAULT_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import ActivityCard from "@/modules/activities/ui/components/activity-card";

export const ActivityListUpcoming = () => {
  const [filters] = useActivitiesFilters();
  const trpc = useTRPC();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.activities.getMany.infiniteQueryOptions(
        { ...filters, limit: DEFAULT_LIMIT, date: todayISO },
        {
          getNextPageParam: (lastPage) =>
            lastPage.docs.length > 0 ? lastPage.nextPage : undefined,
        }
      )
    );

  console.log(data);

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon />
        <p className="text-base font-medium">No upcoming activities found</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {data.pages.map((page, pageIndex) => (
          <div key={pageIndex}>
            {page.docs.map((activity) => (
              <ActivityCard key={activity.id} data={activity} />
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

export const ActivityListSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-base border-2 border-border font-base flex mb-2 bg-amber-300 animate-pulse h-[200px]"></div>
  );
};

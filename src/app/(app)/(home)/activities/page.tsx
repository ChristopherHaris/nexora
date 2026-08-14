import type { SearchParams } from "nuqs/server";
import { DEFAULT_LIMIT } from "@/constants";
import { loadActivityFilters } from "@/modules/activities/search-params";
import { ActivityListView } from "@/modules/activities/ui/views/activity-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import { CalendarComponents } from "@/modules/activities/ui/components/calender";

export const metadata = {
  title: "Activities Sema FTD",
  description: "Activities Sema FTD",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadActivityFilters(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.activities.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActivityListView />
    </HydrationBoundary>
  );
};

export default Page;

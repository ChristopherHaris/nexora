import type { SearchParams } from "nuqs/server";
import { DEFAULT_LIMIT } from "@/constants";
import { loadTeamFilters } from "@/modules/teams/search-params";
import { TeamListView } from "@/modules/teams/ui/views/team-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const metadata = {
  title: "Teammate Matcher",
  description: "Cari rekan tim untuk lomba di NEXORA",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadTeamFilters(searchParams);
  const queryClient = getQueryClient();
  
  void queryClient.prefetchInfiniteQuery(
    trpc.teams.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamListView />
    </HydrationBoundary>
  );
};

export default Page;

import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";

import { loadMenuFilters } from "@/modules/canteen/search-params";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { CanteenListView } from "@/modules/canteen/ui/views/canteen-list-view";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadMenuFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.canteen.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CanteenListView tenantSlug={slug} />
    </HydrationBoundary>
  );
};

export default Page;

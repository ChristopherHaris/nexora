import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";
import { DEFAULT_LIMIT } from "@/constants";

import { loadMenuFilters } from "@/modules/kantin/search-params";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { KantinListView } from "@/modules/kantin/ui/views/kantin-list-view";

interface Props {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const filters = await loadMenuFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.kantin.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <KantinListView tenantSlug={slug} />
    </HydrationBoundary>
  );
};

export default Page;

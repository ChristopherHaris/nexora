import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { SearchParams } from "nuqs/server";

import { KantinListView } from "@/modules/kantin/ui/views/kantin-list-view";
import { loadMenuFilters } from "@/modules/kantin/search-params";
import { getQueryClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Smart Kantin",
  description: "Pesan makanan dari tenant kantin kampus tanpa perlu antre",
};

interface Props {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: Props) => {
  const filters = await loadMenuFilters(searchParams);
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.kantin.getMany.infiniteQueryOptions({
      limit: 12,
      ...filters,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <KantinListView />
    </HydrationBoundary>
  );
};

export default Page;

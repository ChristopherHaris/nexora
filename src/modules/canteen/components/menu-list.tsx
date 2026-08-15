"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import MenuCard from "./menu-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useMenuFilters } from "../hooks/use-menu-filters";
import { formatCurrency } from "@/lib/utils";

const DEFAULT_LIMIT = 12;

interface Props {
  tenantSlug?: string;
  selectedCampus?: string;
}

export const MenuList = ({ tenantSlug, selectedCampus }: Props) => {
  const [filters] = useMenuFilters();
  const trpc = useTRPC();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.canteen.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
          ...filters,
          tenantSlug,
          campus: selectedCampus,
        },
        {
          getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.nextPage : undefined,
        },
      ),
    );

  const items = data.pages.flatMap((page) => page.docs);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between hidden">
        {/* Title removed since it's already in the parent view */}
      </div>

      {items.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center justify-center py-20 text-slate-500 font-bold border-2 border-dashed border-black rounded-xl">
          Menu tidak ditemukan
        </div>
      ) : (
        <div className="w-full flex flex-col gap-8 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {items.map((item) => {
              const isOutOfStock = item.stockStatus === "out_of_stock";

              return (
                <MenuCard
                  key={item.id}
                  id={String(item.id) || ""}
                  imageUrl={item.image?.url || ""}
                  caption={item.name}
                  description={`${formatCurrency(item.basePrice)} · ${
                    item.tenant?.name ?? "Tenant"
                  }${isOutOfStock ? " · Habis" : ""}`}
                  tenantSlug={tenantSlug || item.tenant?.slug || ""}
                  price={item.basePrice}
                />
              );
            })}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pb-10">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold px-8 h-12 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export const MenuListSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="w-full aspect-square rounded-base" />
      ))}
    </div>
  );
};

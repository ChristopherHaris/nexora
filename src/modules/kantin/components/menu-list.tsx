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
}

export const MenuList = ({ tenantSlug }: Props) => {
  const [filters] = useMenuFilters();
  const trpc = useTRPC();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.kantin.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
          ...filters,
          tenantSlug,
        },
        {
          getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.nextPage : undefined,
        },
      ),
    );

  const items = data.pages.flatMap((page) => page.docs);

  const owner = data.pages[0]?.owner;

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
        <h1 className="text-4xl lg:text-6xl font-extrabold">
          {owner || "Smart Kantin"}
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center py-10">
          Menu tidak ditemukan
        </div>
      ) : (
        <div className="w-full flex flex-col gap-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
              const isOutOfStock = item.stockStatus === "out_of_stock";

              return (
                <MenuCard
                  key={item.id}
                  id={String(item.id) || ""}
                  imageUrl={item.image?.url || ""}
                  caption={item.name}
                  description={`${formatCurrency(item.price)} · ${
                    item.tenant?.name ?? "Tenant"
                  }${isOutOfStock ? " · Habis" : ""}`}
                  tenantSlug={tenantSlug || ""}
                />
              );
            })}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pb-10">
              <Button
                variant="ghost"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
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

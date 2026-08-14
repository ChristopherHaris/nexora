"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import ImageCard from "@/components/ui/image-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useMenuFilters } from "../hooks/use-menu-filters";

const DEFAULT_LIMIT = 12;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export const MenuList = () => {
  const [filters] = useMenuFilters();
  const trpc = useTRPC();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.kantin.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
          tenant: filters.tenant || undefined,
          type: filters.type || undefined,
          search: filters.search || undefined,
        },
        {
          getNextPageParam: (lastPage) =>
            lastPage.hasNextPage ? lastPage.nextPage : undefined,
        },
      ),
    );

  const items = data.pages.flatMap((page) => page.docs);

  if (items.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center py-10">
        Menu tidak ditemukan
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const isOutOfStock = item.stockStatus === "out_of_stock";

          return (
            <ImageCard
              key={item.id}
              imageUrl={item.image?.url || ""}
              caption={item.name}
              description={`${formatPrice(item.price)} · ${
                item.tenant?.name ?? "Tenant"
              }${isOutOfStock ? " · Habis" : ""}`}
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

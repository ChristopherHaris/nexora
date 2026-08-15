"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useTeamsFilters } from "@/modules/teams/hooks/use-team-filters";
import { DEFAULT_LIMIT } from "@/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamCard } from "./team-card";
import Link from "next/link";

export const TeamList = () => {
  const trpc = useTRPC();
  const [filters] = useTeamsFilters();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      trpc.teams.getMany.infiniteQueryOptions(
        {
          ...filters,
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: (lastPage) => {
            if (lastPage.hasNextPage) {
              return lastPage.nextPage;
            }
            return undefined;
          },
        }
      )
    );

  const flattenData = data.pages.flatMap((page) => page.docs);

  if (flattenData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center gap-5">
        <InboxIcon className="w-16 h-16 text-muted-foreground" />
        <p className="text-xl font-bold text-muted-foreground">
          Belum ada tim yang mencari anggota
        </p>
        <Link href="/teams/create">
          <Button size="lg" className="mt-4">Buat Tim Baru</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-base border-2 border-border shadow-shadow">
        <h2 className="text-xl font-bold">Daftar Tim Terbuka</h2>
        <Link href="/teams/create">
          <Button>Buat Tim Baru</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        {flattenData.map((team) => (
          <TeamCard key={team.id} data={team} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-5">
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Memuat..." : "Muat Lebih Banyak"}
          </Button>
        </div>
      )}
    </div>
  );
};

export const TeamListSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center bg-white p-4 rounded-base border-2 border-border shadow-shadow">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-32 h-10" />
      </div>
      
      <div className="grid grid-cols-1 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white border-2 border-border shadow-shadow rounded-base p-5 gap-4 flex flex-col"
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-1/2 h-6" />
            </div>
            <Skeleton className="w-full h-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

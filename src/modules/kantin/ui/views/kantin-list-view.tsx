"use client";

import { Suspense } from "react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuList, MenuListSkeleton } from "../../components/menu-list";

import { useMenuFilters } from "../../hooks/use-menu-filters";

export const KantinListView = () => {
  const [filters, setFilters] = useMenuFilters();

  return (
    <div className="px-4 lg:px-20 py-10 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
        <h1 className="text-4xl lg:text-6xl font-extrabold">Smart Kantin</h1>
      </div>

      <Input
        placeholder="Cari menu..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value || null })}
        className="max-w-md"
      />

      <Tabs
        value={filters.type ?? "all"}
        onValueChange={(value) =>
          setFilters({
            type:
              value === "all"
                ? null
                : (value as "food" | "drink" | "snack" | "dessert"),
          })
        }
      >
        <TabsList className="grid max-w-[500px] grid-cols-5 gap-2">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="food">Makanan</TabsTrigger>
          <TabsTrigger value="drink">Minuman</TabsTrigger>
          <TabsTrigger value="snack">Snack</TabsTrigger>
          <TabsTrigger value="dessert">Dessert</TabsTrigger>
        </TabsList>
      </Tabs>

      <Suspense fallback={<MenuListSkeleton />}>
        <MenuList />
      </Suspense>
    </div>
  );
};

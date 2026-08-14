"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useMenuFilters } from "../hooks/use-menu-filters";

export const MenuSort = () => {
  const [filters, setFilters] = useMenuFilters();
  return (
    <>
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
        <TabsList className="grid max-w-125 grid-cols-5 gap-2">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="food">Makanan</TabsTrigger>
          <TabsTrigger value="drink">Minuman</TabsTrigger>
          <TabsTrigger value="snack">Snack</TabsTrigger>
          <TabsTrigger value="dessert">Dessert</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};

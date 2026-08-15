"use client";

import { Input } from "@/components/ui/input";

import { useMenuFilters } from "../hooks/use-menu-filters";

export const MenuSort = () => {
  const [filters, setFilters] = useMenuFilters();
  return (
    <div className="flex flex-col lg:flex-row gap-4 flex-1 justify-end items-center">
      <Input
        placeholder="Cari menu..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value || null })}
        className="w-full lg:max-w-xs h-14 bg-[#F4F4F0] border-4 border-border rounded-base font-bold text-base focus-visible:ring-0 focus-visible:bg-yellow-50 transition-colors shadow-shadow"
      />

      <div className="flex gap-3 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto snap-x">
        {["all", "food", "drink", "snack", "dessert"].map((type) => {
          const isActive = (filters.type ?? "all") === type;
          const labels: Record<string, string> = {
            all: "Semua",
            food: "Makanan",
            drink: "Minuman",
            snack: "Snack",
            dessert: "Dessert",
          };
          return (
            <button
              key={type}
              onClick={() =>
                setFilters({
                  type: type === "all" ? null : (type as "food" | "drink" | "snack" | "dessert"),
                })
              }
              className={`snap-center shrink-0 h-12 px-6 font-black uppercase text-sm border-4 border-border rounded-base transition-all ${
                isActive
                  ? "bg-primary text-white shadow-none translate-y-1"
                  : "bg-white text-slate-900 shadow-shadow hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300"
              }`}
            >
              {labels[type]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

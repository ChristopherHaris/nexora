"use client";

import { useTeamsFilters } from "@/modules/teams/hooks/use-team-filters";

export const TeamSort = () => {
  const [filters, setFilters] = useTeamsFilters();

  return (
    <div className="flex items-center gap-2">
      <span className="font-bold text-sm">Urutkan:</span>
      <select
        value={filters.sort}
        onChange={(e) => setFilters({ sort: e.target.value as "latest" | "oldest" })}
        className="px-3 py-1 border-2 border-border rounded-base bg-white focus:outline-none focus:ring-2 focus:ring-border font-semibold text-sm"
      >
        <option value="latest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
    </div>
  );
};

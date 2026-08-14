"use client";

import { useEventsFilters } from "../../hooks/use-event-filters";

export const EventSort = () => {
  const [filters, setFilters] = useEventsFilters();
  return (
    <div className="flex gap-4 mb-4">
      <select 
        value={filters.sort || "latest"} 
        onChange={(e) => setFilters({ sort: e.target.value as "latest" | "oldest" })}
        className="px-4 py-2 border-2 border-black rounded-base shadow-shadow"
      >
        <option value="latest">Terbaru</option>
        <option value="oldest">Terlama</option>
      </select>
    </div>
  );
};

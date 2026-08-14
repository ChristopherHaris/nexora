"use client";

import { useEventsFilters } from "../../hooks/use-event-filters";

export const EventFilters = () => {
  const [filters, setFilters] = useEventsFilters();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-bold text-xl">Filter Kategori</h3>
      
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Tipe Event</label>
        <select 
          value={filters.type || ""} 
          onChange={(e) => setFilters({ type: e.target.value })}
          className="px-4 py-2 border-2 border-black rounded-base shadow-shadow"
        >
          <option value="">Semua</option>
          <option value="competition">Kompetisi</option>
          <option value="seminar">Seminar</option>
          <option value="workshop">Workshop</option>
          <option value="other">Lainnya</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold">Cakupan</label>
        <select 
          value={filters.scope || ""} 
          onChange={(e) => setFilters({ scope: e.target.value })}
          className="px-4 py-2 border-2 border-black rounded-base shadow-shadow"
        >
          <option value="">Semua</option>
          <option value="internal">Internal Kampus</option>
          <option value="external">Eksternal (Umum)</option>
        </select>
      </div>
    </div>
  );
};

"use client";

import { useTeamsFilters } from "@/modules/teams/hooks/use-team-filters";
import { Badge } from "@/components/ui/badge";

const fields = [
  "Software Development",
  "UI/UX Design",
  "Business Plan",
  "Cyber Security",
  "Data Science",
  "Game Development"
];

export const TeamFilters = () => {
  const [filters, setFilters] = useTeamsFilters();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold text-lg">Filter Bidang</h3>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filters.field === "" ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setFilters({ field: "" })}
        >
          Semua
        </Badge>
        {fields.map((field) => (
          <Badge
            key={field}
            variant={filters.field === field ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setFilters({ field })}
          >
            {field}
          </Badge>
        ))}
      </div>
    </div>
  );
};

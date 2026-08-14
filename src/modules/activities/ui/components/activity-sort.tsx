"use client";

import { Button } from "@/components/ui/button";
import { useActivitiesFilters } from "../../hooks/use-activity-filters";
import { cn } from "@/lib/utils";

export const ActivitiesSort = () => {
  const [filters, setFilters] = useActivitiesFilters();

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        className={cn(
          "rounded-base bg-white hover:bg-white",
          filters.sort !== "latest" &&
            "bg-main border-border hover:border-border hover:bg-main"
        )}
        variant="default"
        onClick={() => setFilters({ sort: "latest" })}
      >
        Latest
      </Button>
      <Button
        size="sm"
        className={cn(
          "rounded-base bg-white hover:bg-white",
          filters.sort !== "oldest" &&
            "bg-main border-border hover:border-border hover:bg-main"
        )}
        variant="default"
        onClick={() => setFilters({ sort: "oldest" })}
      >
        Oldest
      </Button>
    </div>
  );
};

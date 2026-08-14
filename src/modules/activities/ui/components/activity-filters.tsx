"use client";

import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { TagsFilter } from "./tags-filter";
import { useActivitiesFilters } from "../../hooks/use-activity-filters";

interface ProductFiltersProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const ActivityFilter = ({
  title,
  className,
  children,
}: ProductFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  return (
    <div className={cn("p-4 border-b flex flex-col gap-2", className)}>
      <div
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center justify-between cursor-pointer"
      >
        <p className="font-medium text-black">{title}</p>
        <Icon className="size-5 text-black" />
      </div>
      {isOpen && children}
    </div>
  );
};

export const ActivityFilters = () => {
  const [filters, setFilters] = useActivitiesFilters();

  const hasAnyFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "sort") return false;

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    // if (typeof value === "string") {
    //   return value !== "";
    // }

    return value !== null;
  });

  const onClear = () => {
    setFilters({
      tags: [],
    });
  };

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="border-2 shadow-shadow rounded-md bg-white">
      <div className="p-4 border-b flex items-center justify-between">
        <p className="font-medium text-black">Filters</p>
        {hasAnyFilters && (
          <button
            onClick={onClear}
            className="underline text-sm cursor-pointer text-black"
          >
            Clear
          </button>
        )}
      </div>
      <ActivityFilter title="Tags" className="border-b-0">
        <TagsFilter
          value={filters.tags}
          onChange={(value) => onChange("tags", value)}
        />
      </ActivityFilter>
    </div>
  );
};

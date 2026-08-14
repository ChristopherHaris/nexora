"use client";

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMembersFilters } from "@/modules/members/hooks/use-members-filters";

const getCurrentYearData = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const endYear = currentYear;

  const years: { value: string; label: string }[] = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push({
      value: String(year),
      label: String(year),
    });
  }
  
  return years;
};

export default function YearSelector() {
  const [open, setOpen] = React.useState(false);
  const [filters, setFilters] = useMembersFilters();

  return (
    <div className="pt-7 h-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="noShadow"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between md:max-w-[200px]"
          >
            {filters.year
              ? getCurrentYearData().find((year) => year.value === filters.year)
                  ?.label
              : "Select year..."}
            <ChevronsUpDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) border-0 p-0">
          <Command className="**:data-[slot=command-input-wrapper]:h-11">
            <CommandInput placeholder="Search year..." />
            <CommandList className="p-1">
              <CommandEmpty>No year found.</CommandEmpty>
              <CommandGroup>
                {getCurrentYearData().map((year) => (
                  <CommandItem
                    key={year.value}
                    value={year.value}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      setFilters({ year: currentValue });
                    }}
                  >
                    {year.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto",
                        filters.year === year.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

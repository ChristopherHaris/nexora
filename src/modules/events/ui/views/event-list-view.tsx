import { ScrollArea } from "@/components/ui/scroll-area";
import { Suspense } from "react";
import { EventList, EventListSkeleton } from "../components/event-list";
import { EventSort } from "../components/event-sort";
import { EventFilters } from "../components/event-filters";

export const EventListView = () => {
  return (
    <div className="px-4 lg:px-20 py-14 md:py-20 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-start gap-y-2 lg:gap-y-0 justify-between gap-x-10">
        <div className="w-[40%]">
          <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 py-5 justify-between">
            <h1 className="text-4xl lg:text-6xl font-extrabold">Event & Lomba Hub</h1>
          </div>
          <div className="flex flex-col mt-5 md:mt-0">
            <div className="text-justify leading-6">
              <EventSort />
            </div>
            <div className="mt-5">
              <EventFilters />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full md:w-[60%] gap-5">
          <ScrollArea className="rounded-base h-[700px] mt-5 md:mt-0 text-main-foreground border-2 border-border bg-main p-4 shadow-shadow">
            <Suspense fallback={<EventListSkeleton />}>
              <EventList />
            </Suspense>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

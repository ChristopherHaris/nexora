import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { EventView } from "@/modules/events/ui/views/event-view";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ eventId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eventId } = await params;

  const data = await caller.events.getOne({ eventId });

  return {
    title: data.title,
    description: data.description,
  };
}

const Page = async ({ params }: Props) => {
  const { eventId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.events.getOne.queryOptions({ eventId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventView eventId={eventId} />
    </HydrationBoundary>
  );
};

export default Page;

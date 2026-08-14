import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { caller, getQueryClient, trpc } from "@/trpc/server";
import { ActivityView } from "@/modules/activities/ui/views/activity-view";

import type { Metadata } from "next";

interface Props {
  params: Promise<{ activityId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { activityId } = await params;

  const data = await caller.activities.getOne({ activityId });

  return {
    title: data.title,
    description: data.description,
    generator: "Sema FTD",
    applicationName: "Website Sema FTD",
    referrer: "origin-when-cross-origin",
    keywords: [
      "Sema FTD",
      "Senat Mahasiswa FTD",
      "UBM",
      "FTD",
      "Senat Mahasiswa FTD UBM",
      "Senat Mahasiswa UBM",
      "Activity Sema FTD",
      "Activity Senat Mahasiswa FTD",
      "Activity Senat Mahasiswa FTD UBM",
      "Activity Senat Mahasiswa UBM",
    ],
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

const Page = async ({ params }: Props) => {
  const { activityId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.activities.getOne.queryOptions({ activityId })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActivityView activityId={activityId} />
    </HydrationBoundary>
  );
};

export default Page;

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { TeamView } from "@/modules/teams/ui/views/team-view";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ teamId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { teamId } = await params;
  const data = await caller.teams.getOne({ teamId: Number(teamId) });

  return {
    title: `Tim ${data.competitionName} - NEXORA`,
    description: data.projectSynopsis || "Cari rekan tim di NEXORA",
  };
}

const Page = async ({ params }: Props) => {
  const { teamId } = await params;
  const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(
    trpc.teams.getOne.queryOptions({ teamId: Number(teamId) })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TeamView teamId={teamId} />
    </HydrationBoundary>
  );
};

export default Page;

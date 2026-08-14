import { inferRouterOutputs } from "@trpc/server";

import type { appRouter } from "@/trpc/routers/_app";

export type ActivitiesGetManyOutput = inferRouterOutputs<
  typeof appRouter
>["activities"]["getMany"];
export type ActivitiesGetManyOutputSingle =
  ActivitiesGetManyOutput["docs"][number];

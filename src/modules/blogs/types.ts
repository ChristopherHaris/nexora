import { inferRouterOutputs } from "@trpc/server";

import type { appRouter } from "@/trpc/routers/_app";

export type BlogsGetManyOutput = inferRouterOutputs<
  typeof appRouter
>["blogs"]["getMany"];
export type BlogsGetManyOutputSingle = BlogsGetManyOutput["docs"][number];

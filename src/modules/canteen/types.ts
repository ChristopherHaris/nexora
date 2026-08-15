import { inferRouterOutputs } from "@trpc/server";

import type { appRouter } from "@/trpc/routers/_app";

export type MenuItemsGetManyOutput = inferRouterOutputs<
  typeof appRouter
>["canteen"]["getMany"];

export type TenantsGetManyOutput = inferRouterOutputs<
  typeof appRouter
>["canteen"]["getTenants"];

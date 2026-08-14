import { createTRPCRouter } from "../init";

import { blogsRouter } from "@/modules/blogs/server/procedures";
import { membersRouter } from "@/modules/members/server/procedures";
import { activitiesRouter } from "@/modules/activities/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";
import { eventsRouter } from "@/modules/events/server/procedures";
import { kantinRouter } from "@/modules/kantin/server/procedures";
import { tenantsRouter } from "@/modules/tenants/server/procedures";
import { authRouter } from "@/modules/auth/server/procedures";

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  blogs: blogsRouter,
  members: membersRouter,
  activities: activitiesRouter,
  events: eventsRouter,
  kantin: kantinRouter,
  tenants: tenantsRouter,
  auth: authRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;

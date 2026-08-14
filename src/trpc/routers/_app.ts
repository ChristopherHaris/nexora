import { createTRPCRouter } from "../init";

import { blogsRouter } from "@/modules/blogs/server/procedures";
import { membersRouter } from "@/modules/members/server/procedures";
import { activitiesRouter } from "@/modules/activities/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";
import { kantinRouter } from "@/modules/kantin/server/procedures";

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  blogs: blogsRouter,
  members: membersRouter,
  activities: activitiesRouter,
  kantin: kantinRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

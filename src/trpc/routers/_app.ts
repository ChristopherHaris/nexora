import { createTRPCRouter } from "../init";

import { blogsRouter } from "@/modules/blogs/server/procedures";
import { membersRouter } from "@/modules/members/server/procedures";
import { activitiesRouter } from "@/modules/activities/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";
import { eventsRouter } from "@/modules/events/server/procedures";
import { teamsRouter } from "@/modules/teams/server/procedures";
import { canteenRouter } from "@/modules/canteen/server/procedures";
import { tenantsRouter } from "@/modules/tenants/server/procedures";
import { authRouter } from "@/modules/auth/server/procedures";
import { lostfoundRouter } from "@/modules/lostfound/server/procedures";
import { careerRouter } from "@/modules/career/server/procedures";
import { superAdminRouter } from "@/modules/super-admin/server/procedures";
import { campusAdminRouter } from "@/modules/campus-admin/server/procedures";
import { partnerRouter } from "@/modules/partner/server/procedures";
import { gamificationRouter } from "@/modules/gamification/server/procedures";
import { peerLearningRouter } from "@/modules/peer-learning/server/procedures";
import { studyTasksRouter } from "@/modules/study-tasks/server/procedures";

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  blogs: blogsRouter,
  members: membersRouter,
  activities: activitiesRouter,
  events: eventsRouter,
  canteen: canteenRouter,
  tenants: tenantsRouter,
  teams: teamsRouter,
  auth: authRouter,
  lostfound: lostfoundRouter,
  career: careerRouter,
  superAdmin: superAdminRouter,
  campusAdmin: campusAdminRouter,
  partner: partnerRouter,
  gamification: gamificationRouter,
  peerLearning: peerLearningRouter,
  studyTasks: studyTasksRouter,
});

export type AppRouter = typeof appRouter;

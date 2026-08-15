import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

// Check if user is campus admin
const isCampusAdmin = (ctx: any) => {
  return ctx.session?.user?.roles?.includes("campus_admin") && ctx.session?.user?.managedCampus;
};

export const campusAdminRouter = createTRPCRouter({
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    if (!isCampusAdmin(ctx)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
    }

    try {
      const campusId = typeof ctx.session?.user?.managedCampus === "object" 
        ? ctx.session?.user?.managedCampus?.id 
        : ctx.session?.user?.managedCampus;

      const [tenantsCount, eventsCount] = await Promise.all([
        ctx.db.count({ 
          collection: "tenants",
          where: { campus: { equals: campusId } }
        }),
        ctx.db.count({ 
          collection: "events",
          where: { campus: { equals: campusId } }
        })
      ]);

      return {
        tenants: tenantsCount.totalDocs,
        events: eventsCount.totalDocs,
      };
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  getPendingApprovals: protectedProcedure
    .query(async ({ ctx }) => {
      if (!isCampusAdmin(ctx)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
      }

      // In a real app we would have a status field for events and tenants
      // For this demo, we'll just fetch a few latest records as "pending"
      try {
        const campusId = typeof ctx.session?.user?.managedCampus === "object" 
          ? ctx.session?.user?.managedCampus?.id 
          : ctx.session?.user?.managedCampus;

        const events = await ctx.db.find({
          collection: "events",
          where: { campus: { equals: campusId } },
          limit: 5,
          sort: "-createdAt"
        });

        return {
          events: events.docs,
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

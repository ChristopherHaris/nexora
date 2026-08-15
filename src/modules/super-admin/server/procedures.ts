import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { approvalRouter } from "./approval-procedures";

// Check if user is super admin
const isSuperAdmin = (ctx: any) => {
  return ctx.session?.user?.roles?.includes("super-admin");
};

export const superAdminRouter = createTRPCRouter({
  approval: approvalRouter,
  
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    if (!isSuperAdmin(ctx)) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
    }

    try {
      const [usersCount, campusesCount, tenantsCount, transactionsCount] = await Promise.all([
        ctx.db.count({ collection: "users" }),
        ctx.db.count({ collection: "campuses" }),
        ctx.db.count({ collection: "tenants" }),
        ctx.db.count({ collection: "transactions" })
      ]);

      return {
        users: usersCount.totalDocs,
        campuses: campusesCount.totalDocs,
        tenants: tenantsCount.totalDocs,
        transactions: transactionsCount.totalDocs,
      };
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
  }),

  getCampuses: protectedProcedure
    .input(z.object({
      limit: z.number().optional().default(10),
      page: z.number().optional().default(1),
    }))
    .query(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
      }

      try {
        const campuses = await ctx.db.find({
          collection: "campuses",
          limit: input.limit,
          page: input.page,
        });

        return campuses;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});

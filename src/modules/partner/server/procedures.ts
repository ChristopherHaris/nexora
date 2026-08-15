import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

async function getTenantIdForUser(ctx: any): Promise<string | number | null> {
  if (!ctx.session?.user?.id) return null;

  const users = await ctx.db.find({
    collection: "users",
    where: { id: { equals: ctx.session.user.id } },
    depth: 2,
    limit: 1,
  });

  const userDoc = users.docs[0];
  if (!userDoc) return null;

  const tenantRaw = userDoc?.tenants?.[0]?.tenant;
  if (tenantRaw) {
    return typeof tenantRaw === "object" ? (tenantRaw as any).id : tenantRaw;
  }

  const fallbackTenants = await ctx.db.find({
    collection: "tenants",
    where: {
      or: [
        { clerkUserId: { equals: ctx.session.user.clerkId || "" } },
        { ownerEmail: { equals: ctx.session.user.email || "" } },
      ],
    },
    limit: 1,
  });

  if (fallbackTenants.docs.length > 0) {
    const foundTenant = fallbackTenants.docs[0];
    try {
      await ctx.db.update({
        collection: "users",
        id: ctx.session.user.id,
        data: {
          tenants: [{ tenant: foundTenant.id }],
        },
      });
    } catch {
      // noop
    }
    return foundTenant.id;
  }

  return null;
}

export const partnerRouter = createTRPCRouter({
  getOrders: protectedProcedure
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().optional().default(50),
        page: z.number().optional().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const tenantId = await getTenantIdForUser(ctx);

      if (!tenantId) {
        return {
          docs: [],
          totalDocs: 0,
          limit: input.limit,
          totalPages: 0,
          page: input.page,
          pagingCounter: 0,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        };
      }

      const where: any = { tenant: { equals: tenantId } };
      if (input.status && input.status !== "ALL") {
        where.status = { equals: input.status };
      }

      const data = await ctx.db.find({
        collection: "orders",
        where,
        depth: 2,
        limit: input.limit,
        page: input.page,
        sort: "-createdAt",
      });

      const enriched = await Promise.all(
        data.docs.map(async (order: any) => {
          const items = await ctx.db.find({
            collection: "order-items",
            where: { order: { equals: order.id } },
            depth: 2,
            limit: 50,
          });
          return { ...order, items: items.docs };
        })
      );

      return { ...data, docs: enriched };
    }),

  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum([
          "CONFIRMED",
          "COOKING",
          "READY_FOR_PICKUP",
          "COMPLETED",
          "CANCELLED_REFUNDED",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const tenantId = await getTenantIdForUser(ctx);
      if (!tenantId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "User tidak memiliki tenant" });
      }

      const order = await ctx.db.findByID({ collection: "orders", id: input.orderId, depth: 0 });
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });

      const orderTenantId =
        typeof order.tenant === "object" ? (order.tenant as any).id : order.tenant;
      if (String(orderTenantId) !== String(tenantId)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Order bukan milik tenant Anda" });
      }

      return ctx.db.update({
        collection: "orders",
        id: input.orderId,
        data: { status: input.status },
      });
    }),

  getTodayStats: protectedProcedure.query(async ({ ctx }) => {
    const tenantId = await getTenantIdForUser(ctx);

    if (!tenantId) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        revenue: 0,
      };
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const allToday = await ctx.db.find({
      collection: "orders",
      where: {
        tenant: { equals: tenantId },
        createdAt: { greater_than_equal: startOfDay.toISOString() },
      },
      limit: 500,
      depth: 0,
    });

    const docs = allToday.docs as any[];
    const completed = docs.filter((o) => o.status === "COMPLETED");
    const pending = docs.filter((o) =>
      ["PAID", "CONFIRMED", "COOKING", "READY_FOR_PICKUP"].includes(o.status)
    );
    const revenue = completed.reduce((s: number, o: any) => s + (o.totalAmount || 0), 0);

    return {
      total: docs.length,
      completed: completed.length,
      pending: pending.length,
      revenue,
    };
  }),
});

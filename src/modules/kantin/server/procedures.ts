import type { Where } from "payload";
import z from "zod";
import { TRPCError } from "@trpc/server";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Media, Tenant } from "@/payload-types";

const DEFAULT_LIMIT = 12;

export const kantinRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().default(DEFAULT_LIMIT),
        tenant: z.string().nullish(),
        type: z.enum(["food", "drink", "snack", "dessert"]).nullish(),
        search: z.string().nullish(),
        tenantSlug: z.string().nullable().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isActive: {
          equals: true,
        },
      };

      let ownerName: string | null = null;

      if (input.tenant) {
        where.tenant = { equals: input.tenant };
      }

      if (input.type) {
        where.type = { equals: input.type };
      }

      if (input.search) {
        where.name = { like: input.search };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = { equals: input.tenantSlug };

        const tenants = await ctx.db.find({
          collection: "tenants",
          where: { slug: { equals: input.tenantSlug } },
          limit: 1,
        });

        const tenant = tenants.docs[0];

        if (!tenant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tenant not found",
          });
        }

        const users = await ctx.db.find({
          collection: "users",
          where: {
            "tenants.tenant": {
              equals: tenant.id,
            },
          },
          limit: 1,
        });

        const owner = users.docs[0];
        ownerName = owner?.fullName || tenant.name;
      }

      const data = await ctx.db.find({
        collection: "menu-items",
        depth: 2, // populate tenant & image
        where,
        page: input.cursor ?? 1,
        limit: input.limit,
      });

      return {
        ...data,
        owner: ownerName, 
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant,
        })),
      };
    }),

  getTenants: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "tenants",
      where: {
        isOpen: {
          equals: true,
        },
      },
      pagination: false,
      limit: 100,
    });

    return data;
  }),
});

export type KantinRouter = typeof kantinRouter;

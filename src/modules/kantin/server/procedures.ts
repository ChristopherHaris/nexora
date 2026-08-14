import type { Where } from "payload";
import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Media, Tenant } from "@/payload-types";

const DEFAULT_LIMIT = 12;

export const kantinRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(), // nomor halaman, kosong = halaman pertama
        limit: z.number().default(DEFAULT_LIMIT),
        tenant: z.string().nullish(),
        type: z.enum(["food", "drink", "snack", "dessert"]).nullish(),
        search: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isActive: {
          equals: true,
        },
      };

      if (input.tenant) {
        where.tenant = {
          equals: input.tenant,
        };
      }

      if (input.type) {
        where.type = {
          equals: input.type,
        };
      }

      if (input.search) {
        where.name = {
          like: input.search,
        };
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
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant,
        })),
      };
    }),

  // Dipakai buat dropdown/filter pilih tenant di UI, list ringan tanpa pagination.
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

import type { Sort, Where } from "payload";
import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { Media } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";

import { sortValues } from "../search-params";
import { TRPCError } from "@trpc/server";

export const eventsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.findByID({
        collection: "events",
        id: input.eventId,
        depth: 4,
      });

      return data;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        sort: z.enum(sortValues).default("latest"),
        tags: z.array(z.string()).nullable().optional(),
        type: z.string().nullable().optional(),
        scope: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        status: {
          equals: "published",
        }
      };
      
      let sort: Sort = "-createdAt";

      if (input.sort === "latest" || !input.sort) {
        sort = "-createdAt";
      } else if (input.sort === "oldest") {
        sort = "createdAt";
      }

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      
      if (input.type && input.type !== "") {
        where.type = {
          equals: input.type,
        };
      }
      
      if (input.scope && input.scope !== "") {
        where.scope = {
          equals: input.scope,
        };
      }

      const data = await ctx.db.find({
        collection: "events",
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        pagination: true,
      });

      const formattedDocs = data.docs.map((doc) => ({
        ...doc,
        poster: doc.poster as Media | null,
      }));

      return {
        ...data,
        docs: formattedDocs,
      };
    }),
});

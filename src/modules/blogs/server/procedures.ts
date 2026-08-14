import type { Sort, Where } from "payload";
import z from "zod";
// import { headers as getHeaders } from "next/headers";

import { DEFAULT_LIMIT } from "@/constants";
import { Media } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

import { sortValues } from "../search-params";

export const blogsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        blogId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.findByID({
        collection: "blogs",
        id: input.blogId,
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
        date: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";

      if (input.date) {
        const filterDate = new Date(input.date);
        filterDate.setHours(0, 0, 0, 0);

        where.date = {
          greater_than: filterDate.toISOString(),
        };
      }

      if (input.sort === "latest" || !input.sort) {
        sort = "-date";
      } else if (input.sort === "oldest") {
        sort = "date";
      }

      const data = await ctx.db.find({
        collection: "blogs",
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        pagination: true,
      });

      const formattedDocs = data.docs.map((doc) => ({
        ...doc,
        gallery: doc.gallery
          ? doc.gallery.map((galleryItem) => ({
              ...galleryItem,
              image: galleryItem.image as Media | null,
            }))
          : [],
      }));

      return {
        ...data,
        docs: formattedDocs,
      };
    }),
});

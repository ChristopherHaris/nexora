import type { Where } from "payload";
import z from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Media } from "@/payload-types";

export const membersRouter = createTRPCRouter({
  // getOne: baseProcedure
  //   .input(
  //     z.object({
  //       id: z.string(),
  //     })
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const headers = await getHeaders();
  //     const session = await ctx.db.auth({ headers });

  //     const product = await ctx.db.findByID({
  //       collection: "products",
  //       id: input.id,
  //       depth: 2,
  //       select: {
  //         content: false,
  //       },
  //     });

  //     let isPurchased = false;

  //     if (session.user) {
  //       const ordersData = await ctx.db.find({
  //         collection: "orders",
  //         pagination: false,
  //         limit: 1,
  //         where: {
  //           and: [
  //             {
  //               user: {
  //                 equals: session.user.id,
  //               },
  //             },
  //             {
  //               product: {
  //                 equals: input.id,
  //               },
  //             },
  //           ],
  //         },
  //       });

  //       isPurchased = !!ordersData.docs[0];
  //     }

  //     const reviews = await ctx.db.find({
  //       collection: "reviews",
  //       limit: 1,
  //       where: {
  //         product: {
  //           equals: input.id,
  //         },
  //       },
  //     });

  //     const reviewRating =
  //       reviews.docs.length > 0
  //         ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) /
  //           reviews.totalDocs
  //         : 0;

  //     const ratingDistribution: Record<number, number> = {
  //       5: 0,
  //       4: 0,
  //       3: 0,
  //       2: 0,
  //       1: 0,
  //     };

  //     if (reviews.docs.length > 0) {
  //       reviews.docs.forEach((review) => {
  //         const rating = review.rating;

  //         if (rating >= 1 && rating <= 5) {
  //           ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
  //         }
  //       });

  //       Object.keys(ratingDistribution).forEach((key) => {
  //         const rating = Number(key);
  //         const count = ratingDistribution[rating] || 0;

  //         ratingDistribution[rating] = Math.round(
  //           (count / reviews.totalDocs) * 100
  //         );
  //       });
  //     }

  //     return {
  //       ...product,
  //       isPurchased,
  //       image: product.image as Media | null,
  //       tenant: product.tenant as Tenant & { image: Media | null },
  //       reviewRating,
  //       reviewCount: reviews.totalDocs,
  //       ratingDistribution,
  //     };
  //   }),
  getMany: baseProcedure
    .input(
      z.object({
        year: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};

      if (input.year) {
        where.year = {
          equals: input.year,
        };
      }

      const data = await ctx.db.find({
        collection: "members",
        depth: 2, // populate image
        where,
        pagination: false,
        limit: 100,
      });

      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
        })),
        totalDocs: data.totalDocs,
      };
    }),
});

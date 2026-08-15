import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { baseProcedure, protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { openai } from "@ai-sdk/openai";
import { embed, cosineSimilarity } from "ai";

// Use AI Embeddings to calculate semantic similarity
async function calculateSemanticSimilarity(str1: string, str2: string) {
  try {
    const { embedding: emb1 } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: str1,
    });
    
    const { embedding: emb2 } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: str2,
    });
    
    return cosineSimilarity(emb1, emb2) * 100;
  } catch (error) {
    console.error("OpenAI embedding failed. Fallback to basic match.", error);
    // Fallback if API key is not set or fails
    const s1 = str1.toLowerCase().split(" ");
    const s2 = str2.toLowerCase().split(" ");
    const intersection = s1.filter((w) => s2.includes(w)).length;
    return (intersection / Math.max(s1.length, s2.length)) * 100;
  }
}

export const lostfoundRouter = createTRPCRouter({
  createReport: protectedProcedure
    .input(
      z.object({
        type: z.enum(["LOST", "FOUND"]),
        campusId: z.string(),
        itemName: z.string(),
        category: z.string(),
        description: z.string(),
        locationDetail: z.string(),
        dateTime: z.string(),
        secretVerificationPrompt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      // 1. Create Report
      const item = await ctx.db.create({
        collection: "lost-found-items",
        data: {
          type: input.type,
          reporter: ctx.session.user.id as any,
          campus: input.campusId as any,
          itemName: input.itemName,
          category: input.category,
          description: input.description,
          locationDetail: input.locationDetail,
          dateTime: input.dateTime,
          secretVerificationPrompt: input.secretVerificationPrompt,
          status: "ACTIVE",
        },
      });

      // 2. Similarity Engine Logic
      const oppositeType = input.type === "LOST" ? "FOUND" : "LOST";
      const possibleMatches = await ctx.db.find({
        collection: "lost-found-items",
        where: {
          and: [
            { type: { equals: oppositeType } },
            { status: { equals: "ACTIVE" } },
            { campus: { equals: input.campusId } },
          ],
        },
        limit: 100,
      });

      const threshold = 75; // 75% similarity threshold

      for (const candidate of possibleMatches.docs) {
        // AI Semantic Compare
        const textToEmbed1 = `${input.itemName} ${input.description}`;
        const textToEmbed2 = `${candidate.itemName} ${candidate.description}`;
        
        const scoreSemantic = await calculateSemanticSimilarity(textToEmbed1, textToEmbed2);
        const scoreCategory = input.category === candidate.category ? 100 : 0;
        const totalScore = Math.round((scoreSemantic * 0.8) + (scoreCategory * 0.2));

        if (totalScore >= threshold) {
          await ctx.db.create({
            collection: "lf-match-sessions",
            data: {
              lostItem: (input.type === "LOST" ? item.id : candidate.id) as any,
              foundItem: (input.type === "FOUND" ? item.id : candidate.id) as any,
              similarityScore: totalScore,
              status: "SUGGESTED",
            },
          });
          
          // Mark both as MATCH_PENDING (optional according to spec, but good for flow)
          await ctx.db.update({
            collection: "lost-found-items",
            id: item.id,
            data: { status: "MATCH_PENDING" },
          });
          await ctx.db.update({
            collection: "lost-found-items",
            id: candidate.id,
            data: { status: "MATCH_PENDING" },
          });
        }
      }

      return item;
    }),

  initiateChat: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) throw new TRPCError({ code: "UNAUTHORIZED" });
      
      const session = await ctx.db.update({
        collection: "lf-match-sessions",
        id: input.sessionId,
        data: {
          status: "CHAT_ACTIVE",
        },
      });
      return session;
    }),

  getReports: baseProcedure
    .input(z.object({ filter: z.enum(["all", "lost", "found"]).default("all") }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = {
         status: { not_equals: "RETURNED" }
      };

      if (input?.filter && input.filter !== "all") {
        where.type = { equals: input.filter.toUpperCase() };
      }

      const data = await ctx.db.find({
        collection: "lost-found-items",
        where: where,
        limit: 100,
        sort: "-createdAt",
      });

      return data.docs;
    }),

  getMatches: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user) return [];
    
    // Find sessions where the lostItem or foundItem reporter is the current user
    const sessions = await ctx.db.find({
      collection: "lf-match-sessions",
      where: {
        status: { equals: "SUGGESTED" },
      },
      depth: 2,
    });
    
    // Filter down to current user
    return sessions.docs.filter((session: any) => {
      const lostReporterId = typeof session.lostItem?.reporter === 'object' ? session.lostItem.reporter.id : session.lostItem?.reporter;
      const foundReporterId = typeof session.foundItem?.reporter === 'object' ? session.foundItem.reporter.id : session.foundItem?.reporter;
      
      return lostReporterId === ctx.session.user!.id || foundReporterId === ctx.session.user!.id;
    });
  }),
});

export type LostFoundRouter = typeof lostfoundRouter;

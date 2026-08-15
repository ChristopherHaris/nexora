import z from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const careerRouter = createTRPCRouter({
  getMajors: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "majors",
      limit: 100,
    });
    return data.docs;
  }),

  getCareerPaths: protectedProcedure
    .input(z.object({ majorId: z.coerce.number().optional() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // 1. Fetch career paths
      const paths = await ctx.db.find({
        collection: "career-paths",
        ...(input.majorId ? { where: { major: { equals: input.majorId } } } : {}),
        depth: 1, // To get major details if needed
      });

      if (!paths.docs.length) {
        return [];
      }

      const pathIds = paths.docs.map(p => p.id);

      // 2. Fetch all skills for these paths
      const skills = await ctx.db.find({
        collection: "career-skills",
        where: {
          careerPath: { in: pathIds },
        },
        limit: 1000,
      });

      // 3. If user is logged in, fetch their progress for these skills
      let progressMap: Record<number, boolean> = {};

      if (user) {
        const skillIds = skills.docs.map(s => s.id);
        if (skillIds.length > 0) {
          const progress = await ctx.db.find({
            collection: "user-career-progress",
            where: {
              and: [
                { user: { equals: user.id } },
                { careerSkill: { in: skillIds } },
              ]
            },
            limit: 1000,
          });

          progress.docs.forEach(p => {
            if (typeof p.careerSkill === "object" && p.careerSkill) {
              progressMap[p.careerSkill.id] = !!p.isCompleted;
            } else if (typeof p.careerSkill === "number") {
              progressMap[p.careerSkill] = !!p.isCompleted;
            }
          });
        }
      }

      // 4. Combine data
      return paths.docs.map(path => {
        const pathSkills = skills.docs.filter(s => {
          if (typeof s.careerPath === "object" && s.careerPath) {
            return s.careerPath.id === path.id;
          }
          return s.careerPath === path.id;
        }).map(s => ({
          ...s,
          isCompleted: progressMap[s.id] || false,
        }));

        return {
          ...path,
          skills: pathSkills,
        };
      });
    }),

  toggleSkillProgress: protectedProcedure
    .input(z.object({
      skillId: z.coerce.number(),
      isCompleted: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      // Check if progress entry already exists
      const existing = await ctx.db.find({
        collection: "user-career-progress",
        where: {
          and: [
            { user: { equals: user.id } },
            { careerSkill: { equals: input.skillId } }
          ]
        }
      });

      if (existing.docs.length > 0) {
        // Update existing
        const docId = existing.docs[0].id;
        return await ctx.db.update({
          collection: "user-career-progress",
          id: docId,
          data: {
            isCompleted: input.isCompleted,
            completedAt: input.isCompleted ? new Date().toISOString() : null,
          }
        });
      } else {
        // Create new
        return await ctx.db.create({
          collection: "user-career-progress",
          data: {
            user: user.id,
            careerSkill: input.skillId,
            isCompleted: input.isCompleted,
            completedAt: input.isCompleted ? new Date().toISOString() : null,
          }
        });
      }
    }),
});

import type { Sort, Where } from "payload";
import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { sortValues } from "../search-params";
import { TRPCError } from "@trpc/server";

export const teamsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        teamId: z.coerce.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.findByID({
        collection: "teams",
        id: input.teamId,
        depth: 4,
      });

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Team not found",
        });
      }

      // get team vacancies
      const positions = await ctx.db.find({
        collection: "team-vacancies",
        where: {
          team: {
            equals: input.teamId,
          }
        },
        limit: 100
      });

      return {
        ...data,
        positions: positions.docs,
      };
    }),
    
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        sort: z.enum(sortValues).default("latest"),
        field: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isClosed: {
          equals: false,
        }
      };
      
      let sort: Sort = "-createdAt";

      if (input.sort === "latest" || !input.sort) {
        sort = "-createdAt";
      } else if (input.sort === "oldest") {
        sort = "createdAt";
      }

      if (input.field && input.field !== "") {
        where.fieldCategory = {
          equals: input.field,
        };
      }
      
      const data = await ctx.db.find({
        collection: "teams",
        depth: 2,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
        pagination: true,
      });

      return data;
    }),

  applyToPosition: protectedProcedure
    .input(z.object({
      teamId: z.coerce.number(),
      positionId: z.coerce.number(),
      message: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      
      // Check if already applied
      const existing = await ctx.db.find({
        collection: "team-applications",
        where: {
          and: [
            { vacancy: { equals: input.positionId } },
            { applicant: { equals: user.id } }
          ]
        }
      });
      
      if (existing.docs.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already applied to this team",
        });
      }

      const application = await ctx.db.create({
        collection: "team-applications",
        data: {
          vacancy: input.positionId as any,
          applicant: user.id as any,
          portfolioUrl: "#", // Add this
          pitchStatement: input.message || "Saya ingin mendaftar posisi ini",
          status: "PENDING",
        }
      });

      return application;
    }),

  createTeam: protectedProcedure
    .input(z.object({
      competitionName: z.string(),
      field: z.string(),
      description: z.string().optional(),
      deadline: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const team = await ctx.db.create({
        collection: "teams",
        data: {
          leader: user.id as any,
          competitionName: input.competitionName,
          fieldCategory: input.field,
          projectSynopsis: input.description || "",
          deadline: input.deadline,
          isClosed: false,
        }
      });

      return team;
    }),

  addPosition: protectedProcedure
    .input(z.object({
      teamId: z.coerce.number(),
      positionName: z.string(),
      skillRequired: z.string().optional(),
      slotsNeeded: z.number().default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Security: Validate user owns the team
      const team = await ctx.db.findByID({
        collection: "teams",
        id: input.teamId,
      });

      const leaderId = typeof team.leader === 'object' && team.leader !== null ? team.leader.id : team.leader;
      if (!team || leaderId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to add positions to this team",
        });
      }

      const position = await ctx.db.create({
        collection: "team-vacancies",
        data: {
          team: input.teamId as any,
          roleTitle: input.positionName,
          skillsRequired: input.skillRequired ? [{ skill: input.skillRequired }] : [],
          slotsTotal: input.slotsNeeded,
          slotsFilled: 0,
        }
      });

      return position;
    }),
});

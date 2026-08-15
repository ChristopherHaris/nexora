import type { Sort, Where } from "payload";
import z from "zod";

import { DEFAULT_LIMIT } from "@/constants";
import { Media } from "@/payload-types";
import { baseProcedure, protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

import { sortValues } from "../search-params";
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
          equals: "PUBLISHED",
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

  register: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User not synced in DB" });
      }

      const event = await ctx.db.findByID({
        collection: "events",
        id: input.eventId,
      });

      if (!event) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      }

      if (event.registeredCount >= (event.maxQuota as number)) {
        throw new TRPCError({ code: "CONFLICT", message: "Event quota is full" });
      }

      const existingRegistration = await ctx.db.find({
        collection: "event-registrations",
        where: {
          and: [
            { event: { equals: event.id } },
            { user: { equals: ctx.session.user.id } },
          ],
        },
        limit: 1,
      });

      if (existingRegistration.docs.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Already registered for this event" });
      }

      const ticketCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const qrHash = crypto.createHash("sha256").update(ticketCode).digest("hex");

      const registration = await ctx.db.create({
        collection: "event-registrations",
        data: {
          event: event.id,
          user: ctx.session.user.id,
          ticketCode,
          qrHash,
          status: "REGISTERED",
        },
      });

      // Update event registered count
      await ctx.db.update({
        collection: "events",
        id: event.id,
        data: {
          registeredCount: (event.registeredCount as number) + 1,
        },
      });

      // If paid event, generate transaction
      let paymentUrl: string | null = null;
      if ((event.ticketPrice as number) > 0) {
        await ctx.db.create({
          collection: "transactions",
          data: {
            invoiceNumber: `EVT-${ticketCode}`,
            eventRegistration: registration.id,
            amount: event.ticketPrice as number,
            status: "PENDING",
          },
        });
        paymentUrl = `/checkout-event/${registration.id}`; // Mock payment url
      }

      return {
        registration,
        paymentUrl,
      };
    }),

  verifyCheckIn: protectedProcedure
    .input(
      z.object({
        qrHash: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Must be event EO to scan
      if (!ctx.session.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const registrations = await ctx.db.find({
        collection: "event-registrations",
        where: { qrHash: { equals: input.qrHash } },
        limit: 1,
      });

      const registration = registrations.docs[0];
      if (!registration) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invalid QR Code" });
      }

      if (registration.status === "ATTENDED") {
        throw new TRPCError({ code: "CONFLICT", message: "User already checked in" });
      }

      const updated = await ctx.db.update({
        collection: "event-registrations",
        id: registration.id,
        data: {
          status: "ATTENDED",
          checkedInAt: new Date().toISOString(),
        },
      });

      return updated;
    }),
});

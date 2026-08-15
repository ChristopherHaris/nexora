import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

function generateSlug(text: string): string {
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || `kantin-${Date.now().toString(36)}`;
}

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const tenantsData = await ctx.db.find({
        collection: "tenants",
        where: {
          slug: {
            equals: input.slug,
          },
        },
        limit: 1,
        pagination: false,
      });

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tenant not found",
        });
      }

      return tenant as Tenant & { image: Media | null };
    }),

  getMyTenant: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });
    }

    const users = await ctx.db.find({
      collection: "users",
      where: { id: { equals: ctx.session.user.id } },
      depth: 2,
      limit: 1,
    });
    const userDoc = users.docs[0];
    const tenantObj = userDoc?.tenants?.[0]?.tenant;

    if (tenantObj) {
      if (typeof tenantObj === "object" && "name" in tenantObj) {
        return tenantObj as Tenant & { image: Media | null };
      }
      const tenantId = typeof tenantObj === "object" ? (tenantObj as any).id : tenantRawId(tenantObj);
      const found = await ctx.db.findByID({
        collection: "tenants",
        id: tenantId,
        depth: 2,
      });
      if (found) return found as Tenant & { image: Media | null };
    }

    const fallbackTenants = await ctx.db.find({
      collection: "tenants",
      where: {
        or: [
          { clerkUserId: { equals: ctx.session.user.clerkId || "" } },
          { ownerEmail: { equals: ctx.session.user.email || "" } },
        ],
      },
      depth: 2,
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
      return foundTenant as Tenant & { image: Media | null };
    }

    return null;
  }),

  updateTenant: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        locationDetail: z.string().optional(),
        isOpen: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });
      }

      const users = await ctx.db.find({
        collection: "users",
        where: { id: { equals: ctx.session.user.id } },
        depth: 2,
        limit: 1,
      });
      const userDoc = users.docs[0];

      if (!userDoc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User tidak ditemukan" });
      }

      let tenantId: string | number | null = null;
      const tenantRaw = userDoc?.tenants?.[0]?.tenant;
      if (tenantRaw) {
        tenantId = typeof tenantRaw === "object" ? (tenantRaw as any).id : tenantRaw;
      }

      if (!tenantId) {
        const fallback = await ctx.db.find({
          collection: "tenants",
          where: {
            or: [
              { clerkUserId: { equals: ctx.session.user.clerkId || "" } },
              { ownerEmail: { equals: ctx.session.user.email || "" } },
            ],
          },
          limit: 1,
        });
        if (fallback.docs.length > 0) {
          tenantId = fallback.docs[0].id;
        }
      }

      if (!tenantId) {
        let campusId = typeof userDoc.campus === "object" ? (userDoc.campus as any)?.id : userDoc.campus;
        if (!campusId) {
          const campuses = await ctx.db.find({ collection: "campuses", limit: 1 });
          campusId = campuses.docs[0]?.id;
        }

        const baseSlug = generateSlug(input.name || "kantin-baru");
        const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

        const createdTenant = await ctx.db.create({
          collection: "tenants",
          data: {
            name: input.name?.trim() || "Kantin Baru",
            slug: uniqueSlug,
            campus: campusId as any,
            description: input.description || "",
            locationDetail: input.locationDetail || "",
            isOpen: input.isOpen ?? true,
            ownerName: ctx.session.user.fullName || ctx.session.user.username || "Partner",
            ownerEmail: ctx.session.user.email || "",
            clerkUserId: ctx.session.user.clerkId || "",
          },
        });

        const roles = Array.isArray(userDoc.roles) ? [...userDoc.roles] : [userDoc.roles || "student"];
        if (!roles.includes("partner_tenant")) {
          roles.push("partner_tenant");
        }

        await ctx.db.update({
          collection: "users",
          id: ctx.session.user.id,
          data: {
            tenants: [{ tenant: createdTenant.id }],
            roles: roles as any,
          },
        });

        return createdTenant;
      }

      const updatedTenant = await ctx.db.update({
        collection: "tenants",
        id: tenantId,
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.locationDetail !== undefined && { locationDetail: input.locationDetail }),
          ...(input.isOpen !== undefined && { isOpen: input.isOpen }),
        },
      });

      if (!tenantRaw) {
        try {
          await ctx.db.update({
            collection: "users",
            id: ctx.session.user.id,
            data: {
              tenants: [{ tenant: tenantId as any }],
            },
          });
        } catch {
          // noop
        }
      }

      return updatedTenant;
    }),

  getMenuItems: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });
    }

    const users = await ctx.db.find({
      collection: "users",
      where: { id: { equals: ctx.session.user.id } },
      depth: 2,
      limit: 1,
    });
    const userDoc = users.docs[0];
    let actualTenantId: any = userDoc?.tenants?.[0]?.tenant;
    if (typeof actualTenantId === "object" && actualTenantId !== null) {
      actualTenantId = (actualTenantId as any).id;
    }

    if (!actualTenantId) {
      const fallback = await ctx.db.find({
        collection: "tenants",
        where: {
          or: [
            { clerkUserId: { equals: ctx.session.user.clerkId || "" } },
            { ownerEmail: { equals: ctx.session.user.email || "" } },
          ],
        },
        limit: 1,
      });
      if (fallback.docs.length > 0) {
        actualTenantId = fallback.docs[0].id;
      }
    }

    if (!actualTenantId) return [];

    const items = await ctx.db.find({
      collection: "menu-items",
      where: { tenant: { equals: actualTenantId } },
      depth: 2,
      limit: 200,
    });

    return items.docs;
  }),

  addMenuItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(["food", "drink", "snack", "dessert"]),
        basePrice: z.number(),
        description: z.string().optional(),
        isAvailable: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });

      const users = await ctx.db.find({
        collection: "users",
        where: { id: { equals: ctx.session.user.id } },
        depth: 2,
        limit: 1,
      });
      const userDoc = users.docs[0];
      let tenantId: any = userDoc?.tenants?.[0]?.tenant;
      if (typeof tenantId === "object" && tenantId !== null) {
        tenantId = (tenantId as any).id;
      }

      if (!tenantId) {
        const fallback = await ctx.db.find({
          collection: "tenants",
          where: {
            or: [
              { clerkUserId: { equals: ctx.session.user.clerkId || "" } },
              { ownerEmail: { equals: ctx.session.user.email || "" } },
            ],
          },
          limit: 1,
        });
        if (fallback.docs.length > 0) {
          tenantId = fallback.docs[0].id;
        }
      }

      if (!tenantId) {
        let campusId = typeof userDoc?.campus === "object" ? (userDoc.campus as any)?.id : userDoc?.campus;
        if (!campusId) {
          const campuses = await ctx.db.find({ collection: "campuses", limit: 1 });
          campusId = campuses.docs[0]?.id;
        }

        const createdTenant = await ctx.db.create({
          collection: "tenants",
          data: {
            name: `${ctx.session.user.fullName || ctx.session.user.username || "Partner"}'s Kantin`,
            slug: generateSlug(`${ctx.session.user.username || "kantin"}-${Date.now().toString().slice(-4)}`),
            campus: campusId as any,
            isOpen: true,
            ownerName: ctx.session.user.fullName || ctx.session.user.username || "Partner",
            ownerEmail: ctx.session.user.email || "",
            clerkUserId: ctx.session.user.clerkId || "",
          },
        });

        tenantId = createdTenant.id;

        await ctx.db.update({
          collection: "users",
          id: ctx.session.user.id,
          data: {
            tenants: [{ tenant: createdTenant.id }],
          },
        });
      }

      return await ctx.db.create({
        collection: "menu-items",
        data: {
          tenant: tenantId as any,
          ...input,
        },
      });
    }),

  updateMenuItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        type: z.enum(["food", "drink", "snack", "dessert"]).optional(),
        basePrice: z.number().optional(),
        description: z.string().optional(),
        isAvailable: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });

      return await ctx.db.update({
        collection: "menu-items",
        id: input.id,
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.type !== undefined && { type: input.type }),
          ...(input.basePrice !== undefined && { basePrice: input.basePrice }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.isAvailable !== undefined && { isAvailable: input.isAvailable }),
        },
      });
    }),

  deleteMenuItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED", message: "Not logged in" });

      return await ctx.db.delete({
        collection: "menu-items",
        id: input.id,
      });
    }),
});

function tenantRawId(tenant: any): string | number {
  return typeof tenant === "object" && tenant !== null ? tenant.id : tenant;
}

export type TenantsRouter = typeof tenantsRouter;

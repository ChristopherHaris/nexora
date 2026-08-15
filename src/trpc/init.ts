import { initTRPC, TRPCError } from "@trpc/server";
import { getPayload } from "payload";
import config from "@payload-config";
import superjson from "superjson";

import { cache } from "react";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({ config });

  return next({
    ctx: {
      db: payload,
    },
  });
});

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not logged in via Clerk",
    });
  }

  // Find the Payload user by clerkId (assuming we save clerkId, or we fallback to searching by email if available, 
  // but for now, we just pass clerkId as the user object to keep it simple, or query the db if we sync it)
  // Let's assume the Users collection has `clerkId` or we use `userId` directly for now.
  const users = await ctx.db.find({
    collection: "users",
    where: { clerkId: { equals: userId } },
    limit: 1,
  });

  let payloadUser = users.docs[0];

  if (!payloadUser) {
    const clerkUser = await (await import("@clerk/nextjs/server")).currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || `${userId}@nexora.app`;
    const fullName = clerkUser?.firstName 
      ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() 
      : "Nexora User";
    
    const metadata = clerkUser?.unsafeMetadata || clerkUser?.publicMetadata || {};
    const roles = (metadata.roles as string[]) || ["student"];

    const allowedRoles = ["super-admin", "admin", "campus_admin", "partner_tenant", "partner_eo", "student"];
    const assignedRoles = roles.filter(role => allowedRoles.includes(role));
    if (assignedRoles.length === 0) assignedRoles.push("student");

    // Create the user in DB or update if email exists
    try {
      const existingEmailUsers = await ctx.db.find({
        collection: "users",
        where: { email: { equals: email } },
        limit: 1,
      });

      if (existingEmailUsers.docs.length > 0) {
        payloadUser = await ctx.db.update({
          collection: "users",
          id: existingEmailUsers.docs[0].id,
          data: { clerkId: userId },
        });
      } else {
        payloadUser = await ctx.db.create({
          collection: "users",
          data: {
            clerkId: userId,
            email: email,
            username: (clerkUser?.username || email.split("@")[0]),
            fullName: fullName,
            roles: assignedRoles as Array<"student" | "admin" | "super-admin" | "campus_admin" | "partner_tenant" | "partner_eo">,
            password: Math.random().toString(36).slice(-10) + "A1!",
          },
        });
      }

      // If user is a partner_tenant, create their tenant record
      if (assignedRoles.includes("partner_tenant") && metadata.partnerData) {
        const pData = metadata.partnerData as Record<string, string>;
        let campusId: number | null = null;
        if (pData.campus) {
          const matchedCampuses = await ctx.db.find({
            collection: "campuses",
            where: { name: { equals: pData.campus as string } },
            limit: 1,
          });
          if (matchedCampuses.docs.length > 0) {
            campusId = matchedCampuses.docs[0].id;
          }
        }

        // Create fallback if not found
        if (!campusId) {
          const fallback = await ctx.db.create({
            collection: "campuses",
            data: {
              name: pData.campus as string || "Kampus Lain",
              code: "KAMPUS-LAIN-" + Date.now(),
              address: "Alamat belum ditentukan",
            },
          });
          campusId = fallback.id;
        }

        const tenant = await ctx.db.create({
          collection: "tenants",
          data: {
            name: pData.tenantName as string,
            slug: (pData.tenantName as string).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            campus: campusId,
            locationDetail: pData.locationDetail as string || "",
            isOpen: true,
          },
        });

        // Add dummy/initial menu if provided
        if (pData.menuName && pData.menuPrice) {
           await ctx.db.create({
             collection: "menu-items",
             data: {
               tenant: tenant.id,
               name: pData.menuName as string,
               basePrice: Number(pData.menuPrice) || 15000,
               type: "food",
               isAvailable: true,
             }
           });
        }

        // Link the tenant to the user
        payloadUser = (await ctx.db.update({
          collection: "users",
          id: payloadUser.id,
          data: {
            tenants: [
              {
                tenant: tenant.id,
              }
            ]
          }
        })) as any;
      }
    } catch (e) {
      console.error("Failed to sync user:", e);
    }
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        clerkId: userId,
        user: payloadUser || null,
      },
    },
  });
});

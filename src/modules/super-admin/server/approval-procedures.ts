import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const isSuperAdmin = (ctx: any) => {
  return ctx.session?.user?.roles?.includes("super-admin");
};

export const approvalRouter = createTRPCRouter({
  getPendingTenantApplications: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        page: z.number().optional().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
      }

      try {
        const applications = await ctx.db.find({
          collection: "tenant-applications",
          where: { status: { equals: "pending" } },
          limit: input.limit,
          page: input.page,
          sort: "-createdAt",
        });

        return applications;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  getPendingCampusApplications: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        page: z.number().optional().default(1),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
      }

      try {
        const applications = await ctx.db.find({
          collection: "campus-applications",
          where: { status: { equals: "pending" } },
          limit: input.limit,
          page: input.page,
          sort: "-createdAt",
        });

        return applications;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),

  approveTenantApplication: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
      }

      try {
        const application = await ctx.db.findByID({
          collection: "tenant-applications",
          id: input.applicationId,
        });

        if (!application) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Aplikasi tidak ditemukan" });
        }

        if (application.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Aplikasi sudah diproses sebelumnya",
          });
        }

        const tenant = await ctx.db.create({
          collection: "tenants",
          data: {
            name: application.tenantName,
            slug: application.slug,
            campus: application.campus,
            description: application.description || "",
            locationDetail: application.locationDetail,
            phone: application.phone,
            isOpen: true,
            ownerName: application.applicantName,
            ownerEmail: application.applicantEmail,
            bankName: application.bankName,
            bankAccountNumber: application.bankAccountNumber,
            bankAccountName: application.bankAccountName,
            npwpNumber: application.npwpNumber,
            idCardNumber: application.idCardNumber,
            clerkUserId: application.clerkUserId,
            applicationId: input.applicationId as any,
          },
        });

        await ctx.db.update({
          collection: "tenant-applications",
          id: input.applicationId,
          data: {
            status: "approved",
            reviewedBy: ctx.session?.user?.id,
            reviewedAt: new Date().toISOString(),
            approvalNotes: input.notes || "",
            createdTenantId: tenant.id,
          },
        });

        if (application.clerkUserId) {
          const user = await ctx.db.find({
            collection: "users",
            where: { clerkId: { equals: application.clerkUserId } },
          });

          if (user.docs.length > 0) {
            const currentUser = user.docs[0];
            const currentRoles = currentUser.roles || [];
            if (!currentRoles.includes("partner_tenant")) {
              await ctx.db.update({
                collection: "users",
                id: currentUser.id,
                data: {
                  roles: [...currentRoles, "partner_tenant"],
                },
              });
            }
          }
        }

        return { success: true, tenant };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Gagal approve aplikasi",
        });
      }
    }),

  rejectTenantApplication: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        reason: z.enum([
          "incomplete_documents",
          "invalid_documents",
          "invalid_location",
          "requirements_not_met",
          "duplicate",
          "other",
        ]),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
      }

      try {
        const application = await ctx.db.findByID({
          collection: "tenant-applications",
          id: input.applicationId,
        });

        if (!application) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Aplikasi tidak ditemukan" });
        }

        if (application.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Aplikasi sudah diproses sebelumnya",
          });
        }

        await ctx.db.update({
          collection: "tenant-applications",
          id: input.applicationId,
          data: {
            status: "rejected",
            reviewedBy: ctx.session?.user?.id,
            reviewedAt: new Date().toISOString(),
            rejectionReason: input.reason,
            approvalNotes: input.notes,
          },
        });

        return { success: true };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Gagal reject aplikasi",
        });
      }
    }),

  approveCampusApplication: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        notes: z.string().optional(),
        adminEmail: z.string().email(),
        adminPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
      }

      try {
        const application = await ctx.db.findByID({
          collection: "campus-applications",
          id: input.applicationId,
        });

        if (!application) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Aplikasi tidak ditemukan" });
        }

        if (application.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Aplikasi sudah diproses sebelumnya",
          });
        }

        const campus = await ctx.db.create({
          collection: "campuses",
          data: {
            code: application.campusCode,
            name: application.campusName,
            address: application.address,
            city: application.city,
            province: application.province,
            postalCode: application.postalCode,
            campusType: application.campusType,
            totalStudents: application.totalStudents,
            picName: application.applicantName,
            picEmail: application.applicantEmail,
            picPhone: application.applicantPhone,
            logo: application.campusLogo,
            npwp: application.campusNpwp,
            bankName: application.bankName,
            bankAccountNumber: application.bankAccountNumber,
            bankAccountName: application.bankAccountName,
            websiteUrl: application.websiteUrl,
            applicationId: input.applicationId as any,
          },
        });

        const adminUser = await ctx.db.create({
          collection: "users",
          data: {
            email: input.adminEmail,
            password: input.adminPassword,
            username: `admin.${application.campusCode.toLowerCase()}`,
            fullName: `Admin ${application.campusName}`,
            roles: ["campus_admin"],
            managedCampus: campus.id,
            campus: campus.id,
          },
        });

        await ctx.db.update({
          collection: "campus-applications",
          id: input.applicationId,
          data: {
            status: "approved",
            reviewedBy: ctx.session?.user?.id,
            reviewedAt: new Date().toISOString(),
            approvalNotes: input.notes || "",
            createdCampusId: campus.id,
            createdAdminId: adminUser.id,
          },
        });

        return { success: true, campus, admin: adminUser };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Gagal approve aplikasi",
        });
      }
    }),

  rejectCampusApplication: protectedProcedure
    .input(
      z.object({
        applicationId: z.string(),
        reason: z.enum([
          "incomplete_documents",
          "invalid_documents",
          "not_accredited",
          "requirements_not_met",
          "duplicate",
          "other",
        ]),
        notes: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isSuperAdmin(ctx)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Akses ditolak" });
      }

      try {
        const application = await ctx.db.findByID({
          collection: "campus-applications",
          id: input.applicationId,
        });

        if (!application) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Aplikasi tidak ditemukan" });
        }

        if (application.status !== "pending") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Aplikasi sudah diproses sebelumnya",
          });
        }

        await ctx.db.update({
          collection: "campus-applications",
          id: input.applicationId,
          data: {
            status: "rejected",
            reviewedBy: ctx.session?.user?.id,
            reviewedAt: new Date().toISOString(),
            rejectionReason: input.reason,
            approvalNotes: input.notes,
          },
        });

        return { success: true };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Gagal reject aplikasi",
        });
      }
    }),
});

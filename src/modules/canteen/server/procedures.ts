import type { Where } from "payload";
import z from "zod";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";

import { baseProcedure, protectedProcedure, createTRPCRouter } from "@/trpc/init";
import type { Media, Tenant } from "@/payload-types";
import { inngest } from "@/inngest/client";

const DEFAULT_LIMIT = 24;

export const canteenRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().nullish(),
        limit: z.number().default(DEFAULT_LIMIT),
        tenant: z.string().nullish(),
        type: z.enum(["food", "drink", "snack", "dessert"]).nullish(),
        search: z.string().nullish(),
        tenantSlug: z.string().nullable().optional(),
        campus: z.string().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isAvailable: {
          equals: true,
        },
      };

      let campusId: string | number | null | undefined = input.campus;

      if (!campusId) {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();
        if (userId) {
          const users = await ctx.db.find({
            collection: "users",
            where: { clerkId: { equals: userId } },
            limit: 1,
          });
          const userDoc = users.docs[0];
          if (userDoc?.campus) {
            campusId = typeof userDoc.campus === "object" ? userDoc.campus.id : (userDoc.campus as any);
          }
        }
      }

      if (campusId) {
        where["tenant.campus"] = { equals: campusId };
      }

      let ownerName: string | null = null;

      if (input.tenant) {
        const parsedTenantId = typeof input.tenant === "string" && !isNaN(Number(input.tenant)) 
          ? Number(input.tenant) 
          : input.tenant;
        where.tenant = { equals: parsedTenantId };
      }

      if (input.type) {
        where.type = { equals: input.type };
      }

      if (input.search) {
        where.name = { like: input.search };
      }

      if (input.tenantSlug) {
        where["tenant.slug"] = { equals: input.tenantSlug };

        const tenants = await ctx.db.find({
          collection: "tenants",
          where: { slug: { equals: input.tenantSlug } },
          limit: 1,
        });

        const tenant = tenants.docs[0];

        if (!tenant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Tenant not found",
          });
        }

        const users = await ctx.db.find({
          collection: "users",
          where: {
            "tenants.tenant": {
              equals: tenant.id,
            },
          },
          limit: 1,
        });

        const owner = users.docs[0];
        ownerName = owner?.fullName || tenant.name;
      }

      const data = await ctx.db.find({
        collection: "menu-items",
        depth: 2,
        where,
        page: input.cursor ?? 1,
        limit: input.limit,
      });

      return {
        ...data,
        owner: ownerName,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant,
        })),
      };
    }),

  getTenants: baseProcedure
    .input(z.object({ campus: z.string().nullish() }).optional())
    .query(async ({ ctx, input }) => {
      const where: Where = {
        isOpen: {
          equals: true,
        },
      };

      let campusId: string | number | null | undefined = input?.campus;

      if (!campusId) {
        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();
        if (userId) {
          const users = await ctx.db.find({
            collection: "users",
            where: { clerkId: { equals: userId } },
            limit: 1,
          });
          const userDoc = users.docs[0];
          if (userDoc?.campus) {
            campusId = typeof userDoc.campus === "object" ? userDoc.campus.id : (userDoc.campus as any);
          }
        }
      }

      if (campusId) {
        where.campus = { equals: campusId };
      }

      const data = await ctx.db.find({
        collection: "tenants",
        where,
        pagination: false,
        limit: 100,
      });

      return data;
    }),

  getCart: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
    }

    const carts = await ctx.db.find({
      collection: "carts",
      where: {
        user: { equals: ctx.session.user.id },
      },
      limit: 1,
      overrideAccess: true,
    });

    const cart = carts.docs[0];

    if (!cart) {
      return {
        cart: null,
        items: [],
      };
    }

    const cartItems = await ctx.db.find({
      collection: "cart-items",
      where: {
        cart: { equals: cart.id },
      },
      depth: 2,
      overrideAccess: true,
    });

    return {
      cart,
      items: cartItems.docs,
    };
  }),

  getTimeSlots: baseProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.find({
        collection: "time-slots",
        where: { isActive: { equals: true } },
        pagination: false,
        limit: 100,
        sort: "startTime",
        overrideAccess: true,
      });

      if (data.docs && data.docs.length > 0) {
        return data.docs;
      }

      // Default time slots if not present in DB
      const defaultSlots = [
        { startTime: "2026-08-15T09:30:00.000Z", endTime: "2026-08-15T10:00:00.000Z", maxCapacity: 25, isActive: true },
        { startTime: "2026-08-15T11:30:00.000Z", endTime: "2026-08-15T12:00:00.000Z", maxCapacity: 30, isActive: true },
        { startTime: "2026-08-15T12:00:00.000Z", endTime: "2026-08-15T12:30:00.000Z", maxCapacity: 35, isActive: true },
        { startTime: "2026-08-15T12:30:00.000Z", endTime: "2026-08-15T13:00:00.000Z", maxCapacity: 30, isActive: true },
        { startTime: "2026-08-15T15:00:00.000Z", endTime: "2026-08-15T15:30:00.000Z", maxCapacity: 25, isActive: true },
      ];

      const tenants = await ctx.db.find({
        collection: "tenants",
        limit: 1,
        overrideAccess: true,
      });
      const fallbackTenantId = tenants.docs[0]?.id;

      const createdSlots = await Promise.all(
        defaultSlots.map((slot) =>
          ctx.db.create({
            collection: "time-slots",
            data: {
              ...slot,
              ...(fallbackTenantId ? { tenant: fallbackTenantId } : {}),
            } as any,
            overrideAccess: true,
          })
        )
      );

      if (createdSlots && createdSlots.length > 0) {
        return createdSlots;
      }
    } catch (err) {
      console.warn("getTimeSlots DB error, returning fallbacks:", err);
    }

    return [
      { id: 1, startTime: "2026-08-15T09:30:00.000Z", endTime: "2026-08-15T10:00:00.000Z", maxCapacity: 25, isActive: true },
      { id: 2, startTime: "2026-08-15T11:30:00.000Z", endTime: "2026-08-15T12:00:00.000Z", maxCapacity: 30, isActive: true },
      { id: 3, startTime: "2026-08-15T12:00:00.000Z", endTime: "2026-08-15T12:30:00.000Z", maxCapacity: 35, isActive: true },
      { id: 4, startTime: "2026-08-15T12:30:00.000Z", endTime: "2026-08-15T13:00:00.000Z", maxCapacity: 30, isActive: true },
      { id: 5, startTime: "2026-08-15T15:00:00.000Z", endTime: "2026-08-15T15:30:00.000Z", maxCapacity: 25, isActive: true },
    ];
  }),

  addToCart: protectedProcedure
    .input(z.object({ menuItemId: z.union([z.string(), z.number()]), quantity: z.number().default(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
      }

      const menuItemId = typeof input.menuItemId === "string" && !isNaN(Number(input.menuItemId)) 
        ? Number(input.menuItemId) 
        : input.menuItemId;

      const menuItemDoc = await ctx.db.findByID({
        collection: "menu-items",
        id: menuItemId as number,
        depth: 0,
      });

      if (!menuItemDoc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Menu item not found" });
      }

      const tenantId = typeof menuItemDoc.tenant === "object" && menuItemDoc.tenant !== null
        ? (menuItemDoc.tenant as any).id
        : menuItemDoc.tenant;

      const carts = await ctx.db.find({
        collection: "carts",
        where: { user: { equals: ctx.session.user.id } },
        limit: 1,
        overrideAccess: true,
      });

      let cart = carts.docs[0];
      if (!cart) {
        cart = await ctx.db.create({
          collection: "carts",
          data: { 
            user: ctx.session.user.id,
            tenant: tenantId,
          } as any,
          overrideAccess: true,
        });
      }

      const existingItems = await ctx.db.find({
        collection: "cart-items",
        where: {
          and: [
            { cart: { equals: cart.id } },
            { menuItem: { equals: menuItemId } },
          ],
        },
        limit: 1,
        overrideAccess: true,
      });

      if (existingItems.docs.length > 0) {
        const item = existingItems.docs[0];
        return await ctx.db.update({
          collection: "cart-items",
          id: item.id,
          data: {
            quantity: item.quantity + input.quantity,
          },
          overrideAccess: true,
        });
      }

      return await ctx.db.create({
        collection: "cart-items",
        data: {
          cart: cart.id as any,
          menuItem: menuItemId as any,
          quantity: input.quantity,
        },
        overrideAccess: true,
      });
    }),

  updateCartItemQuantity: protectedProcedure
    .input(z.object({ cartItemId: z.union([z.string(), z.number()]), quantity: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      if (input.quantity <= 0) {
        return await ctx.db.delete({
          collection: "cart-items",
          id: input.cartItemId,
          overrideAccess: true,
        });
      }

      return await ctx.db.update({
        collection: "cart-items",
        id: input.cartItemId,
        data: { quantity: input.quantity },
        overrideAccess: true,
      });
    }),

  removeFromCart: protectedProcedure
    .input(z.object({ cartItemId: z.union([z.string(), z.number()]) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      return await ctx.db.delete({
        collection: "cart-items",
        id: input.cartItemId,
        overrideAccess: true,
      });
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const carts = await ctx.db.find({
      collection: "carts",
      where: { user: { equals: ctx.session.user.id } },
      limit: 1,
      overrideAccess: true,
    });

    const cart = carts.docs[0];
    if (cart) {
      const items = await ctx.db.find({
        collection: "cart-items",
        where: { cart: { equals: cart.id } },
        limit: 100,
        overrideAccess: true,
      });

      for (const item of items.docs) {
        await ctx.db.delete({ collection: "cart-items", id: item.id, overrideAccess: true });
      }
    }

    return { success: true };
  }),

  createOrder: protectedProcedure
    .input(
      z.object({
        timeSlotId: z.union([z.string(), z.number()]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User not authenticated" });
      }

      const carts = await ctx.db.find({
        collection: "carts",
        where: { user: { equals: ctx.session.user.id } },
        limit: 1,
        overrideAccess: true,
      });

      const cart = carts.docs[0];
      if (!cart) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Keranjang belanja kosong" });
      }

      const cartItems = await ctx.db.find({
        collection: "cart-items",
        where: { cart: { equals: cart.id } },
        depth: 2,
        limit: 100,
        overrideAccess: true,
      });

      if (cartItems.docs.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Keranjang belanja kosong" });
      }

      let subtotalAmount = 0;
      let tenantId: any = null;
      const orderItemsData: any[] = [];

      for (const item of cartItems.docs) {
        const menuItem = item.menuItem as any;
        if (!menuItem) continue;

        if (!tenantId) {
          tenantId = typeof menuItem.tenant === "object" ? menuItem.tenant?.id : menuItem.tenant;
        }

        const unitBasePrice = menuItem.basePrice || 0;
        const subtotal = unitBasePrice * item.quantity;
        subtotalAmount += subtotal;

        orderItemsData.push({
          menuItem: menuItem.id,
          quantity: item.quantity,
          unitBasePrice: unitBasePrice,
          selectedVariants: [],
          subtotal: subtotal,
        });
      }

      if (!tenantId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Tenant pesanan tidak valid" });
      }

      const platformFee = 2000;
      const totalAmount = subtotalAmount + platformFee;

      // Ensure valid timeSlot ID
      let slotId = input.timeSlotId;
      try {
        const slotDoc = await ctx.db.findByID({
          collection: "time-slots",
          id: slotId as any,
          overrideAccess: true,
        }).catch(() => null);

        if (!slotDoc) {
          const anySlots = await ctx.db.find({ collection: "time-slots", limit: 1, overrideAccess: true });
          if (anySlots.docs.length > 0) {
            slotId = anySlots.docs[0].id;
          } else {
            const newSlot = await ctx.db.create({
              collection: "time-slots",
              data: {
                startTime: "2026-08-15T12:00:00.000Z",
                endTime: "2026-08-15T12:30:00.000Z",
                maxCapacity: 30,
                isActive: true,
                tenant: tenantId as any,
              },
              overrideAccess: true,
            });
            slotId = newSlot.id;
          }
        }
      } catch {
        // if slotId is a number or string, keep as fallback
      }

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const randHex = crypto.randomBytes(3).toString("hex").toUpperCase();
      const orderNumber = `NX-${dateStr}-${randHex}`;
      const pickupCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      const qrVerificationHash = crypto.createHash("sha256").update(pickupCode).digest("hex");

      const order = await ctx.db.create({
        collection: "orders",
        data: {
          user: ctx.session.user.id as any,
          tenant: tenantId as any,
          timeSlot: slotId as any,
          status: "PENDING_PAYMENT",
          orderNumber,
          pickupCode,
          qrVerificationHash,
          subtotalAmount,
          platformFee,
          totalAmount,
          notes: input.notes || "",
        },
        overrideAccess: true,
      });

      for (const oi of orderItemsData) {
        await ctx.db.create({
          collection: "order-items",
          data: {
            order: order.id as any,
            menuItem: oi.menuItem as any,
            quantity: oi.quantity,
            unitBasePrice: oi.unitBasePrice,
            selectedVariants: oi.selectedVariants,
            subtotal: oi.subtotal,
          },
          overrideAccess: true,
        });
      }

      try {
        await ctx.db.create({
          collection: "transactions",
          data: {
            invoiceNumber: `INV-${order.orderNumber || order.id}`,
            order: order.id as any,
            amount: totalAmount,
            status: "PENDING",
          },
          overrideAccess: true,
        });
      } catch {
        // noop
      }

      // Clear cart items in parallel
      await Promise.all(
        cartItems.docs.map((item) =>
          ctx.db.delete({
            collection: "cart-items",
            id: item.id,
            overrideAccess: true,
          })
        )
      );

      // Non-blocking inngest event trigger
      inngest.send({
        name: "canteen/order.created",
        data: {
          orderId: order.id,
        },
      }).catch(() => {});

      return {
        order,
        orderId: order.id,
        orderNumber: order.orderNumber,
        pickupCode: order.pickupCode,
        totalAmount,
      };
    }),

  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) return [];

    const data = await ctx.db.find({
      collection: "orders",
      where: {
        user: { equals: ctx.session.user.id },
      },
      sort: "-createdAt",
      depth: 2,
      limit: 20,
      overrideAccess: true,
    });

    const enriched = await Promise.all(
      data.docs.map(async (order: any) => {
        const items = await ctx.db.find({
          collection: "order-items",
          where: { order: { equals: order.id } },
          depth: 2,
          limit: 50,
          overrideAccess: true,
        });
        return { ...order, items: items.docs };
      })
    );

    return enriched;
  }),

  simulatePaymentSuccess: protectedProcedure
    .input(z.object({ orderId: z.union([z.string(), z.number()]) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

      const order = await ctx.db.findByID({
        collection: "orders",
        id: input.orderId as any,
        depth: 2,
        overrideAccess: true,
      });

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      const updated = await ctx.db.update({
        collection: "orders",
        id: input.orderId as any,
        data: {
          status: "PAID",
        },
        overrideAccess: true,
      });

      // Also update transaction status if exists
      const tx = await ctx.db.find({
        collection: "transactions",
        where: { order: { equals: input.orderId } },
        limit: 1,
        overrideAccess: true,
      });

      if (tx.docs.length > 0) {
        try {
          await ctx.db.update({
            collection: "transactions",
            id: tx.docs[0].id,
            data: { status: "PAID" },
            overrideAccess: true,
          });
        } catch {
          // noop
        }
      }

      return {
        success: true,
        order: updated,
      };
    }),
});

export type CanteenRouter = typeof canteenRouter;

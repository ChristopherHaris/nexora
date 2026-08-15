import type { CollectionConfig } from "payload";
import crypto from "crypto";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    group: "Smart canteen",
  },
  // Field "tenant" ditambahkan otomatis oleh multiTenantPlugin (relationTo: "tenants").
  fields: [
    {
      name: "orderNumber",
      type: "text",
      unique: true,
      admin: {
        readOnly: true,
        description: "Nomor urut pesanan otomatis (contoh: NX-20260315-001).",
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "timeSlot",
      type: "relationship",
      relationTo: "time-slots",
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "DRAFT",
      required: true,
      options: [
        "DRAFT",
        "PENDING_PAYMENT",
        "PAID",
        "CONFIRMED",
        "COOKING",
        "READY_FOR_PICKUP",
        "COMPLETED",
        "CANCELLED_EXPIRED",
        "CANCELLED_REFUNDED",
      ],
    },
    {
      name: "subtotalAmount",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "platformFee",
      type: "number",
      required: true,
      defaultValue: 2000,
    },
    {
      name: "totalAmount",
      type: "number",
      required: true,
      defaultValue: 0,
    },
    {
      name: "pickupCode",
      type: "text",
      admin: { readOnly: true },
    },
    {
      name: "qrVerificationHash",
      type: "text",
      admin: { readOnly: true },
    },
    {
      name: "notes",
      type: "textarea",
    },
    {
      name: "lockedUntil",
      type: "date",
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Atomic Time Slot Reservation Logic for Status PENDING_PAYMENT or PAID
        if (
          data.timeSlot &&
          (data.status === "PENDING_PAYMENT" || data.status === "PAID")
        ) {
          try {
            const timeSlotDoc = await req.payload.findByID({
              collection: "time-slots",
              id: data.timeSlot,
              overrideAccess: true,
            });

            if (timeSlotDoc && timeSlotDoc.maxCapacity) {
              const activeOrders = await req.payload.find({
                collection: "orders",
                where: {
                  and: [
                    { timeSlot: { equals: data.timeSlot } },
                    {
                      or: [
                        {
                          status: {
                            in: ["PAID", "CONFIRMED", "COOKING", "READY_FOR_PICKUP"],
                          },
                        },
                        {
                          and: [
                            { status: { equals: "PENDING_PAYMENT" } },
                            { lockedUntil: { greater_than: new Date().toISOString() } },
                          ],
                        },
                      ],
                    },
                  ],
                },
                limit: 0,
                overrideAccess: true,
              });

              if (operation === "create" && activeOrders.totalDocs >= (timeSlotDoc.maxCapacity as number)) {
                throw new Error("ERR_SLOT_CAPACITY_EXCEEDED");
              }
            }
          } catch (err: any) {
            if (err?.message === "ERR_SLOT_CAPACITY_EXCEEDED") throw err;
            // Ignore other lookup errors to allow resilient order flow
          }
        }

        if (operation === "create") {
          // Set lockedUntil to 15 mins from now
          data.lockedUntil = new Date(Date.now() + 15 * 60000).toISOString();

          // Generate guaranteed unique order number & pickup code
          const now = new Date();
          const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
          const randHex = crypto.randomBytes(3).toString("hex").toUpperCase();

          if (!data.orderNumber) {
            data.orderNumber = `NX-${dateStr}-${randHex}`;
          }

          if (!data.pickupCode) {
            data.pickupCode = Math.random().toString(36).substring(2, 6).toUpperCase();
          }

          if (!data.qrVerificationHash) {
            data.qrVerificationHash = crypto.createHash("sha256").update(data.pickupCode).digest("hex");
          }
        }
        return data;
      },
    ],
  },
};

export default Orders;

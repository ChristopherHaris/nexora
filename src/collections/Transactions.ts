import { CollectionConfig } from "payload";
import { isSuperAdmin } from "@/lib/access";

export const Transactions: CollectionConfig = {
  slug: "transactions",
  admin: {
    useAsTitle: "invoiceNumber",
    group: "Core",
  },
  access: {
    // Only super admin can read/manage all transactions for security
    read: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: "invoiceNumber",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      hasMany: false,
      admin: {
        description: "Terkait dengan pesanan canteen",
      },
    },
    {
      name: "eventRegistration",
      type: "relationship",
      relationTo: "event-registrations",
      hasMany: false,
      admin: {
        description: "Terkait dengan pendaftaran Event",
      },
    },
    {
      name: "paymentChannel",
      type: "text",
    },
    {
      name: "amount",
      type: "number",
      required: true,
    },
    {
      name: "dokuTransactionId",
      type: "text",
    },
    {
      name: "status",
      type: "select",
      options: ["PENDING", "PAID", "FAILED", "EXPIRED"],
      defaultValue: "PENDING",
      required: true,
    },
    {
      name: "rawResponse",
      type: "json",
      admin: {
        description: "Raw Webhook Response from DOKU",
      },
    },
    {
      name: "paidAt",
      type: "date",
    },
  ],
};

export default Transactions;

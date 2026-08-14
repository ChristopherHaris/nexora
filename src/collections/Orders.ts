import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    group: "Smart Kantin",
  },
  // Field "tenant" ditambahkan otomatis oleh multiTenantPlugin (relationTo: "tenants").
  // Hook di bawah tetap memakai data.tenant karena field itu tetap ada di dokumen,
  // hanya deklarasinya dipindah ke plugin, bukan ditulis manual di sini.
  fields: [
    {
      name: "orderNumber",
      type: "number",
      admin: {
        readOnly: true,
        description:
          "Nomor urut pesanan per tenant per hari (reset tiap hari). Di-generate otomatis, bukan diisi manual.",
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "pickupSlot",
      type: "relationship",
      relationTo: "pickup-slots",
    },
    {
      name: "total",
      type: "number",
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "diterima",
      options: [
        "diterima",
        "dikonfirmasi",
        "sedang_dimasak",
        "siap_diambil",
        "selesai",
        "dibatalkan",
      ],
    },
    {
      name: "timeEstimate",
      type: "number",
      admin: {
        description: "Estimasi menit sampai siap",
      },
    },
    {
      name: "paymentStatus",
      type: "select",
      defaultValue: "pending",
      options: ["pending", "paid", "failed", "refunded"],
    },
    {
      name: "paymentMethod",
      type: "select",
      options: ["virtual_account", "qris", "e_wallet"],
    },
    {
      name: "readyAt",
      type: "date",
    },
    {
      name: "completedAt",
      type: "date",
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === "create" && data.tenant) {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);

          const todaysOrders = await req.payload.find({
            collection: "orders",
            where: {
              and: [
                { tenant: { equals: data.tenant } },
                { createdAt: { greater_than_equal: startOfDay.toISOString() } },
              ],
            },
            limit: 0,
          });

          data.orderNumber = todaysOrders.totalDocs + 1;
        }
        return data;
      },
    ],
  },
};

export default Orders;

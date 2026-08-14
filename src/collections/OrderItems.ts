import type { CollectionConfig } from "payload";

export const OrderItems: CollectionConfig = {
  slug: "order-items",
  admin: {
    useAsTitle: "id",
    group: "Smart Kantin",
  },
  fields: [
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      required: true,
    },
    {
      name: "menuItem",
      type: "relationship",
      relationTo: "menu-items",
      required: true,
    },
    {
      name: "quantity",
      type: "number",
      required: true,
      defaultValue: 1,
    },
    {
      name: "priceAtPurchase",
      type: "number",
      required: true,
      admin: {
        description: "Snapshot harga saat order",
      },
    },
    {
      name: "subtotal",
      type: "number",
      required: true,
    },
  ],
};

export default OrderItems;
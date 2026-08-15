import type { CollectionConfig } from "payload";

export const CartItems: CollectionConfig = {
  slug: "cart-items",
  admin: {
    useAsTitle: "id",
    group: "Smart canteen",
  },
  fields: [
    {
      name: "cart",
      type: "relationship",
      relationTo: "carts",
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
      name: "notes",
      type: "textarea",
    },
  ],
};

export default CartItems;

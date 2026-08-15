import type { CollectionConfig } from "payload";

export const Carts: CollectionConfig = {
  slug: "carts",
  admin: {
    useAsTitle: "id",
    group: "Smart canteen",
  },
  // Field "tenant" ditambahkan otomatis oleh multiTenantPlugin.
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        description: "1 cart aktif per user per tenant",
      },
    },
  ],
};

export default Carts;

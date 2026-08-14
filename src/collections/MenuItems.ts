import type { CollectionConfig } from "payload";

export const MenuItems: CollectionConfig = {
  slug: "menu-items",
  admin: {
    useAsTitle: "name",
    group: "Smart Kantin",
  },
  // NOTE: field relasi "tenant" TIDAK dideklarasikan manual di sini.
  // @payloadcms/plugin-multi-tenant otomatis menambahkan field "tenant"
  // (relationTo: "tenants") ke collection ini karena "menu-items" terdaftar
  // di config multiTenantPlugin({ collections: {...} }) pada payload.config.ts.
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: ["food", "drink", "snack", "dessert"],
    },
    {
      name: "price",
      type: "number",
      required: true,
    },
    {
      name: "quantity",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Stok tersisa",
      },
    },
    {
      name: "stockStatus",
      type: "select",
      defaultValue: "available",
      options: ["available", "low_stock", "out_of_stock"],
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Nonaktifkan tanpa hapus",
      },
    },
  ],
};

export default MenuItems;

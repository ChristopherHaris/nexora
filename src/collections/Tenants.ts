import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
    group: "Smart Kantin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nama Tenant",
      admin: {
        description: "Nama tenant/mitra",
      },
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      admin: {
        description:
          "This is the subdomain of your store (e.g. [yourstore].kana.com)",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "location",
      type: "text",
      admin: {
        description: "Titik lokasi di kampus",
      },
    },
    {
      name: "openTime",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "timeOnly",
        },
      },
    },
    {
      name: "closeTime",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "timeOnly",
        },
      },
    },
    {
      name: "isOpen",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Toggle manual buka/tutup",
      },
    },
  ],
};

export default Tenants;
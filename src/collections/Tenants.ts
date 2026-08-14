import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "name",
    group: "Smart Kantin",
  },
  fields: [
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      admin: {
        description: "Akun tenant/mitra",
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
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
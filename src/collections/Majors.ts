import type { CollectionConfig } from "payload";

export const Majors: CollectionConfig = {
  slug: "majors",
  admin: {
    useAsTitle: "name",
    group: "Career Paths",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Contoh: Informatika, Sistem Informasi",
      },
    },
  ],
};

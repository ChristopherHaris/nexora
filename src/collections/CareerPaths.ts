import type { CollectionConfig } from "payload";

export const CareerPaths: CollectionConfig = {
  slug: "career-paths",
  admin: {
    useAsTitle: "title",
    group: "Career Paths",
  },
  fields: [
    {
      name: "major",
      type: "relationship",
      relationTo: "majors",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Contoh: Software Engineer, Data Analyst",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "relatedTags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
      admin: {
        description:
          "Dipakai untuk rekomendasi event relevan (dicocokkan ke tags di Events)",
      },
    },
  ],
};

import type { CollectionConfig } from "payload";

export const LostFoundItems: CollectionConfig = {
  slug: "lost-found-items",
  admin: {
    useAsTitle: "itemName",
    group: "Lost & Found",
  },
  fields: [
    {
      name: "type",
      type: "select",
      required: true,
      options: ["LOST", "FOUND"],
    },
    {
      name: "reporter",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "campus",
      type: "relationship",
      relationTo: "campuses",
      required: true,
    },
    {
      name: "itemName",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "locationDetail",
      type: "text",
      required: true,
    },
    {
      name: "dateTime",
      type: "date",
      required: true,
    },
    {
      name: "media",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "secretVerificationPrompt",
      type: "textarea",
      admin: {
        description: "Pertanyaan keamanan rahasia yang hanya diketahui pemilik (cth: 'Apa warna wallpaper HP?')",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "ACTIVE",
      required: true,
      options: ["ACTIVE", "MATCH_PENDING", "RESOLVED"],
    },
  ],
};

export default LostFoundItems;

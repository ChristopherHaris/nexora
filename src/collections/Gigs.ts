import type { CollectionConfig } from "payload";

export const Gigs: CollectionConfig = {
  slug: "gigs",
  admin: {
    useAsTitle: "title",
    group: "Gamification & Cases",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "category",
      type: "text",
      required: true,
    },
    {
      name: "poster",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "budgetCoins",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "deadline",
      type: "date",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: ["OPEN", "TAKEN", "COMPLETED"],
      defaultValue: "OPEN",
      required: true,
    },
    {
      name: "worker",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "submissionUrl",
      type: "text",
    },
  ],
};

import type { CollectionConfig } from "payload";

export const Tutors: CollectionConfig = {
  slug: "tutors",
  admin: {
    useAsTitle: "id",
    group: "Peer Learning",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "skills",
      type: "array",
      fields: [
        {
          name: "skill",
          type: "text",
          required: true,
        },
      ],
      required: true,
    },
    {
      name: "coinRatePerHour",
      type: "number",
      required: true,
      defaultValue: 50,
      min: 0,
    },
    {
      name: "rating",
      type: "number",
      defaultValue: 5.0,
      min: 0,
      max: 5,
    },
    {
      name: "totalSessions",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "status",
      type: "select",
      options: ["PENDING", "APPROVED", "REJECTED"],
      defaultValue: "PENDING",
      required: true,
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "cvUrl",
      type: "text",
      required: true,
    },
    {
      name: "portfolioUrl",
      type: "text",
    },
  ],
};

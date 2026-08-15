import type { CollectionConfig } from "payload";

export const LFMatchSessions: CollectionConfig = {
  slug: "lf-match-sessions",
  admin: {
    useAsTitle: "id",
    group: "Lost & Found",
  },
  fields: [
    {
      name: "lostItem",
      type: "relationship",
      relationTo: "lost-found-items",
      required: true,
      filterOptions: {
        type: { equals: "LOST" },
      },
    },
    {
      name: "foundItem",
      type: "relationship",
      relationTo: "lost-found-items",
      required: true,
      filterOptions: {
        type: { equals: "FOUND" },
      },
    },
    {
      name: "similarityScore",
      type: "number",
      required: true,
      admin: {
        description: "0 to 100",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "SUGGESTED",
      required: true,
      options: ["SUGGESTED", "CHAT_ACTIVE", "VERIFIED_MATCH", "REJECTED"],
    },
  ],
};

export default LFMatchSessions;

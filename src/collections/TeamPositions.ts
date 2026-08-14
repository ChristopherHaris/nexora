import type { CollectionConfig } from "payload";

export const TeamPositions: CollectionConfig = {
  slug: "team-positions",
  admin: {
    useAsTitle: "positionName",
    group: "Teamate Matcher",
  },
  fields: [
    {
      name: "team",
      type: "relationship",
      relationTo: "teams",
      required: true,
    },
    {
      name: "positionName",
      type: "text",
      required: true,
      admin: {
        description: "Contoh: UI/UX Designer",
      },
    },
    {
      name: "skillRequired",
      type: "text",
    },
    {
      name: "slotsNeeded",
      type: "number",
      defaultValue: 1,
    },
    {
      name: "slotsFilled",
      type: "number",
      defaultValue: 0,
    },
  ],
};

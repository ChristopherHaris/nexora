import type { CollectionConfig } from "payload";

export const TeamVacancies: CollectionConfig = {
  slug: "team-vacancies",
  admin: {
    useAsTitle: "roleTitle",
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
      name: "roleTitle",
      type: "text",
      required: true,
      admin: {
        description: "Contoh: UI/UX Designer",
      },
    },
    {
      name: "skillsRequired",
      type: "array",
      required: true,
      fields: [
        {
          name: "skill",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "slotsTotal",
      type: "number",
      required: true,
      defaultValue: 1,
      min: 1,
    },
    {
      name: "slotsFilled",
      type: "number",
      required: true,
      defaultValue: 0,
    },
  ],
};

export default TeamVacancies;

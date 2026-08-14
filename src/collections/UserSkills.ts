import type { CollectionConfig } from "payload";

export const UserSkills: CollectionConfig = {
  slug: "user-skills",
  admin: {
    useAsTitle: "skillName",
    group: "Teamate Matcher",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "skillName",
      type: "text",
      required: true,
    },
    {
      name: "proficiency",
      type: "select",
      options: ["pemula", "menengah", "mahir"],
    },
    {
      name: "portfolioUrl",
      type: "text",
    },
  ],
};

export default UserSkills;
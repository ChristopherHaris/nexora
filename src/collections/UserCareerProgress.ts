import type { CollectionConfig } from "payload";

export const UserCareerProgress: CollectionConfig = {
  slug: "user-career-progress",
  admin: {
    useAsTitle: "id",
    group: "Career Paths",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "careerSkill",
      type: "relationship",
      relationTo: "career-skills",
      required: true,
    },
    {
      name: "isCompleted",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "completedAt",
      type: "date",
    },
  ],
};

export default UserCareerProgress;
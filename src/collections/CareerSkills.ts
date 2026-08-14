import type { CollectionConfig } from "payload";

export const CareerSkills: CollectionConfig = {
  slug: "career-skills",
  admin: {
    useAsTitle: "skillName",
    group: "Career Paths",
  },
  fields: [
    {
      name: "careerPath",
      type: "relationship",
      relationTo: "career-paths",
      required: true,
    },
    {
      name: "skillName",
      type: "text",
      required: true,
    },
    {
      name: "resourceUrl",
      type: "text",
      admin: {
        description: "Kurasi sumber belajar/sertifikasi",
      },
    },
    {
      name: "isCertification",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

export default CareerSkills;
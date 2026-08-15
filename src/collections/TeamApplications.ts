import type { CollectionConfig } from "payload";

export const TeamApplications: CollectionConfig = {
  slug: "team-applications",
  admin: {
    useAsTitle: "id",
    group: "Teamate Matcher",
  },
  fields: [
    {
      name: "vacancy",
      type: "relationship",
      relationTo: "team-vacancies",
      required: true,
    },
    {
      name: "applicant",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "portfolioUrl",
      type: "text",
      required: true,
    },
    {
      name: "pitchStatement",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "PENDING",
      required: true,
      options: ["PENDING", "ACCEPTED", "REJECTED"],
    },
  ],
};

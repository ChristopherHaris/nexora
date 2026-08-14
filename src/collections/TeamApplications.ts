import type { CollectionConfig } from "payload";

export const TeamApplications: CollectionConfig = {
  slug: "team-applications",
  admin: {
    useAsTitle: "id",
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
      name: "position",
      type: "relationship",
      relationTo: "team-positions",
      required: true,
    },
    {
      name: "applicant",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "menunggu",
      options: ["menunggu", "diterima", "ditolak"],
    },
  ],
};

import type { CollectionConfig } from "payload";

export const Teams: CollectionConfig = {
  slug: "teams",
  admin: {
    useAsTitle: "competitionName",
    group: "Teamate Matcher",
  },
  fields: [
    {
      name: "creator",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "competitionName",
      type: "text",
      required: true,
      admin: {
        description: "Nama lomba yang dituju",
      },
    },
    {
      name: "field",
      type: "text",
      required: true,
      admin: {
        description: "Bidang lomba (software dev, ui/ux, dsb)",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "deadline",
      type: "date",
      required: true,
      admin: {
        description: "Deadline tim harus lengkap",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "open",
      options: ["open", "closed"],
    },
  ],
};

export default Teams;
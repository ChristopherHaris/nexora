import type { CollectionConfig } from "payload";

export const Teams: CollectionConfig = {
  slug: "teams",
  admin: {
    useAsTitle: "competitionName",
    group: "Teamate Matcher",
  },
  fields: [
    {
      name: "leader",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "competitionName",
      type: "text",
      required: true,
    },
    {
      name: "fieldCategory",
      type: "text",
      required: true,
    },
    {
      name: "projectSynopsis",
      type: "textarea",
      required: true,
    },
    {
      name: "deadline",
      type: "date",
      required: true,
      admin: {
        description: "Deadline pendaftaran tim",
      },
    },
    {
      name: "competitionDate",
      type: "date",
      required: true,
      admin: {
        description: "Tanggal akhir kompetisi (untuk Kalender)",
      },
    },
    {
      name: "isClosed",
      type: "checkbox",
      defaultValue: false,
    },
  ],
};

export default Teams;

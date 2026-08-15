import type { CollectionConfig } from "payload";

export const StudyTasks: CollectionConfig = {
  slug: "study-tasks",
  admin: {
    useAsTitle: "title",
    group: "Student Tools",
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "text",
      required: true,
      defaultValue: "Umum",
    },
    {
      name: "deadline",
      type: "date",
    },
    {
      name: "status",
      type: "select",
      options: ["PENDING", "COMPLETED"],
      defaultValue: "PENDING",
      required: true,
    },
    {
      name: "checklists",
      type: "array",
      fields: [
        {
          name: "taskName",
          type: "text",
          required: true,
        },
        {
          name: "isCompleted",
          type: "checkbox",
          defaultValue: false,
        },
      ],
    },
  ],
};

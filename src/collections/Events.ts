import type { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "name",
    group: "Event & Competition",
  },
  fields: [
    {
      name: "organizer",
      type: "relationship",
      relationTo: "users",
      admin: {
        description: "Panitia/BEM/UKM",
      },
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: ["competition", "seminar", "workshop", "other"],
    },
    {
      name: "scope",
      type: "select",
      required: true,
      defaultValue: "internal",
      options: ["internal", "external"],
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "isOnline",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "location",
      type: "text",
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "quota",
      type: "number",
    },
    {
      name: "registrationDeadline",
      type: "date",
      required: true,
    },
    {
      name: "eventDate",
      type: "date",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending_review",
      options: ["draft", "pending_review", "published", "closed"],
    },
  ],
};

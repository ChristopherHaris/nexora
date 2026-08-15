import type { CollectionConfig } from "payload";

export const Events: CollectionConfig = {
  slug: "events",
  admin: {
    useAsTitle: "title",
    group: "Event & Competition",
  },
  fields: [
    {
      name: "organizer",
      type: "relationship",
      relationTo: "users",
      required: true,
      admin: {
        description: "Panitia/BEM/UKM",
      },
    },
    {
      name: "campus",
      type: "relationship",
      relationTo: "campuses",
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
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "poster",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "eventStart",
      type: "date",
      required: true,
    },
    {
      name: "eventEnd",
      type: "date",
      required: true,
    },
    {
      name: "registrationDeadline",
      type: "date",
      required: true,
    },
    {
      name: "locationFormat",
      type: "select",
      required: true,
      options: ["ONLINE", "OFFLINE", "HYBRID"],
    },
    {
      name: "locationDetail",
      type: "text",
      required: true,
    },
    {
      name: "ticketPrice",
      type: "number",
      defaultValue: 0,
      required: true,
      min: 0,
    },
    {
      name: "maxQuota",
      type: "number",
      required: true,
      min: 1,
    },
    {
      name: "registeredCount",
      type: "number",
      defaultValue: 0,
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "PENDING_APPROVAL",
      required: true,
      options: ["DRAFT", "PENDING_APPROVAL", "PUBLISHED", "REJECTED", "COMPLETED"],
    },
    {
      name: "rejectionReason",
      type: "textarea",
      admin: {
        condition: (data) => data.status === "REJECTED",
      },
    },
  ],
};

export default Events;

import type { CollectionConfig } from "payload";

export const EventRegistrations: CollectionConfig = {
  slug: "event-registrations",
  admin: {
    useAsTitle: "ticketCode",
    group: "Event & Competition",
  },
  fields: [
    {
      name: "event",
      type: "relationship",
      relationTo: "events",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "ticketCode",
      type: "text",
      unique: true,
      required: true,
    },
    {
      name: "qrHash",
      type: "text",
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "REGISTERED",
      required: true,
      options: ["REGISTERED", "ATTENDED", "CANCELLED"],
    },
    {
      name: "checkedInAt",
      type: "date",
    },
  ],
};

export default EventRegistrations

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
    },
    {
      name: "status",
      type: "select",
      defaultValue: "registered",
      options: ["registered", "checked_in", "cancelled"],
    },
  ],
};

export default EventRegistrations
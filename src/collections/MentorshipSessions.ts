import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const MentorshipSessions: CollectionConfig = {
  slug: "mentorship_sessions",
  admin: {
    useAsTitle: "id",
    group: "Peer Learning",
  },
  access: {
    read: () => true,
    create: () => true, // allow authenticated users to request sessions
    update: () => true, // allow status updates by participants
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: "mentor",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "mentee",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "topic",
      type: "text",
      required: true,
    },
    {
      name: "status",
      type: "select",
      options: ["pending", "accepted", "rejected", "completed", "cancelled"],
      defaultValue: "pending",
      required: true,
    },
    {
      name: "scheduledAt",
      type: "date",
      required: true,
    },
    {
      name: "priceCoins",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "notes",
      type: "textarea",
    }
  ],
};

export default MentorshipSessions;

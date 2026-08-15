import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Quests: CollectionConfig = {
  slug: "quests",
  admin: {
    useAsTitle: "title",
    group: "Gamification",
  },
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "xpReward",
      type: "number",
      required: true,
      defaultValue: 10,
    },
    {
      name: "type",
      type: "select",
      options: ["daily", "weekly", "milestone"],
      required: true,
    },
    {
      name: "targetCount",
      type: "number",
      required: true,
      defaultValue: 1,
    },
    {
      name: "actionType",
      type: "select",
      options: ["order_food", "attend_event", "mentor_session", "report_lost_found"],
      required: true,
    }
  ],
};

export default Quests;

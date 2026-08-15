import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const UserBadges: CollectionConfig = {
  slug: "user_badges",
  admin: {
    useAsTitle: "id",
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
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "badge",
      type: "relationship",
      relationTo: "badges",
      required: true,
    },
    {
      name: "earnedAt",
      type: "date",
      defaultValue: () => new Date().toISOString(),
    },
  ],
};

export default UserBadges;

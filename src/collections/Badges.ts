import { isSuperAdmin } from "@/lib/access";
import type { CollectionConfig } from "payload";

export const Badges: CollectionConfig = {
  slug: "badges",
  admin: {
    useAsTitle: "name",
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
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "iconUrl",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "select",
      options: ["Onboarding", "Aktivitas", "Produktivitas", "Pencapaian", "Kualitas", "Magang", "Karier"],
      required: true,
    },
    {
      name: "xpBonus",
      type: "number",
      required: true,
      defaultValue: 50,
    },
  ],
};

export default Badges;

import type { CollectionConfig } from "payload";

export const AdminActions: CollectionConfig = {
  slug: "admin-actions",
  admin: {
    useAsTitle: "actionType",
    group: "Core",
  },
  access: {
    read: ({ req: { user } }) => {
      return Boolean(
        user &&
        (user.roles?.includes("admin") || user.roles?.includes("super-admin")),
      );
    },
  },
  fields: [
    {
      name: "admin",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "actionType",
      type: "select",
      required: true,
      options: [
        "approve_event",
        "reject_event",
        "moderate_lost_found",
        "suspend_tenant",
        "suspend_user",
        "other",
      ],
    },
    {
      name: "targetCollection",
      type: "text",
      required: true,
      admin: {
        description: "Contoh: 'events', 'lost-items'",
      },
    },
    {
      name: "targetId",
      type: "text",
      required: true,
    },
    {
      name: "notes",
      type: "textarea",
    },
  ],
};

export default AdminActions;
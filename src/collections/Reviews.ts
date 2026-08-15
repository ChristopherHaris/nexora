import type { CollectionConfig } from "payload";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    useAsTitle: "id",
    group: "Smart canteen",
  },
  fields: [
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "menuItem",
      type: "relationship",
      relationTo: "menu-items",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "comment",
      type: "textarea",
    },
  ],
};

export default Reviews;

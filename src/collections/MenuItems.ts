import type { CollectionConfig } from "payload";

export const MenuItems: CollectionConfig = {
  slug: "menu-items",
  admin: {
    useAsTitle: "name",
    group: "Smart canteen",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: ["food", "drink", "snack", "dessert"],
    },
    {
      name: "basePrice",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "dailyStock",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Kuota Stok Harian",
      },
    },
    {
      name: "stockStatus",
      type: "select",
      defaultValue: "available",
      options: ["available", "low_stock", "out_of_stock"],
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "isAvailable",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Menu tersedia untuk dipesan?",
      },
    },
    {
      name: "variantGroups",
      type: "array",
      admin: {
        description: "Grup Varian (Misal: Level Pedas, Extra Topping)",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "isRequired",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "allowMultiple",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "minSelections",
          type: "number",
          defaultValue: 0,
        },
        {
          name: "maxSelections",
          type: "number",
          defaultValue: 1,
        },
        {
          name: "options",
          type: "array",
          required: true,
          minRows: 1,
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
            },
            {
              name: "extraPrice",
              type: "number",
              required: true,
              defaultValue: 0,
              min: 0,
            },
          ],
        },
      ],
    },
  ],
};

export default MenuItems;

import type { CollectionConfig } from "payload";

export const PickupSlots: CollectionConfig = {
  slug: "pickup-slots",
  admin: {
    useAsTitle: "id",
    group: "Smart Kantin",
  },
  // Field "tenant" ditambahkan otomatis oleh multiTenantPlugin.
  fields: [
    {
      name: "slotStart",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "timeOnly",
        },
      },
    },
    {
      name: "slotEnd",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "timeOnly",
        },
      },
    },
    {
      name: "capacity",
      type: "number",
      defaultValue: 10,
    },
    {
      name: "bookedCount",
      type: "number",
      defaultValue: 0,
    },
  ],
};

export default PickupSlots;
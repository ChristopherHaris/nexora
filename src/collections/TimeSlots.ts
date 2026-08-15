import type { CollectionConfig } from "payload";

export const TimeSlots: CollectionConfig = {
  slug: "time-slots",
  admin: {
    useAsTitle: "id",
    group: "Smart canteen",
  },
  // "tenant" field is automatically added by multiTenantPlugin
  fields: [
    {
      name: "startTime",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "timeOnly",
        },
      },
    },
    {
      name: "endTime",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "timeOnly",
        },
      },
    },
    {
      name: "maxCapacity",
      type: "number",
      required: true,
      defaultValue: 15,
      admin: {
        description: "Maksimal jumlah pesanan yang bisa diproses dalam slot ini",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};

export default TimeSlots;

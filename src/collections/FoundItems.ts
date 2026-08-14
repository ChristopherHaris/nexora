import type { CollectionConfig } from "payload";

export const FoundItems: CollectionConfig = {
  slug: "found-items",
  admin: {
    useAsTitle: "itemName",
    group: "Lost & Found",
  },
  fields: [
    {
      name: "finder",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "itemName",
      type: "text",
      required: true,
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        "kartu_mahasiswa",
        "dompet",
        "elektronik",
        "botol_minum",
        "aksesoris",
        "lainnya",
      ],
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "foundLocation",
      type: "text",
    },
    {
      name: "foundAt",
      type: "date",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "dilaporkan",
      options: ["dilaporkan", "ada_kecocokan", "dikonfirmasi", "dikembalikan"],
    },
  ],
};

export default FoundItems;
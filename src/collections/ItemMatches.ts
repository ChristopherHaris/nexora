import type { CollectionConfig } from "payload";

export const ItemMatches: CollectionConfig = {
  slug: "item-matches",
  admin: {
    useAsTitle: "id",
    group: "Lost & Found",
  },
  fields: [
    {
      name: "lostItem",
      type: "relationship",
      relationTo: "lost-items",
      required: true,
    },
    {
      name: "foundItem",
      type: "relationship",
      relationTo: "found-items",
      required: true,
    },
    {
      name: "matchScore",
      type: "number",
      admin: {
        description: "Skor kemiripan kategori/lokasi/kata kunci",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "disarankan",
      options: ["disarankan", "dikonfirmasi", "ditolak"],
    },
  ],
};

export default ItemMatches;
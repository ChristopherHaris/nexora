import type { CollectionConfig } from "payload";

export const ItemChatMessages: CollectionConfig = {
  slug: "item-chat-messages",
  admin: {
    useAsTitle: "id",
    group: "Lost & Found",
  },
  fields: [
    {
      name: "match",
      type: "relationship",
      relationTo: "item-matches",
      required: true,
    },
    {
      name: "sender",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "message",
      type: "textarea",
      required: true,
    },
  ],
};

export default ItemChatMessages;
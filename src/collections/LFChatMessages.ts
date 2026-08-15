import type { CollectionConfig } from "payload";

export const LFChatMessages: CollectionConfig = {
  slug: "lf-chat-messages",
  admin: {
    useAsTitle: "id",
    group: "Lost & Found",
  },
  fields: [
    {
      name: "session",
      type: "relationship",
      relationTo: "lf-match-sessions",
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

export default LFChatMessages;

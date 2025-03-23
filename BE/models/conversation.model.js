const mongoose = require("mongoose");

const DOCUMENT_NAME = "Conversation";
const COLLECTION_NAME = "Conversations";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        media: [
          {
            type: String,
            url: String,
          },
        ],
        readBy: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            readAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPinned: {
      type: Map,
      of: Boolean,
      default: new Map(),
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

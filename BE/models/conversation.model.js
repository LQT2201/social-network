const mongoose = require("mongoose");

const DOCUMENT_NAME = "Conversation";
const COLLECTION_NAME = "Conversations";

const convensationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    type: {
      type: String,
      enum: ["private", "group"],
      default: "private",
    },
    name: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "group";
      },
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "group";
      },
    },
    unreadCount: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
    pinned: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    pinnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, convensationSchema);

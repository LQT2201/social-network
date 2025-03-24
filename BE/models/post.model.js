const mongoose = require("mongoose");

const DOCUMENT_NAME = "Post";
const COLLECTION_NAME = "Posts";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxLength: 5000,
    },
    metadata: {
      tags: [
        {
          type: String,
          trim: true,
        },
      ],
      location: {
        type: {
          lat: Number,
          lng: Number,
          name: String,
        },
        default: null,
      },
    },
    settings: {
      visibility: {
        type: String,
        enum: ["public", "private", "followers"],
        default: "public",
      },
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video"],
        },
        url: {
          type: String,
        },
        publicId: {
          type: String,
        },
        thumbnail: String,
        dimensions: {
          width: Number,
          height: Number,
        },
        metadata: {
          format: String,
          size: Number,
          originalName: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "deleted", "reported"],
      default: "active",
    },
    stats: {
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
      shares: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, postSchema);

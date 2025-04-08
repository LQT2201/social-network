const mongoose = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    googleId: String,
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "online", "offline"],
      default: "active",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    // Profile information
    fullName: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1674042682/default-avatar.png",
    },
    coverImage: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1674042682/default-cover.png",
    },
    // Follow system
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Additional fields
    lastActive: {
      type: Date,
      default: Date.now,
    },
    settings: {
      notifications: {
        type: Boolean,
        default: true,
      },
      privacy: {
        type: String,
        enum: ["public", "private"],
        default: "public",
      },
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, userSchema);

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
        "https://res.cloudinary.com/dgtac4atn/image/upload/v1744793135/social_media_uploads/dks4tjsizcpugnrifpvv.jpg",
    },
    coverImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dgtac4atn/image/upload/v1744793524/social_media_uploads/mzywkioy1mrmoptlf4yf.webp",
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

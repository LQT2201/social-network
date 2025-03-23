const mongoose = require("mongoose");

const DOCUMENT_NAME = "UserProfile";
const COLLECTION_NAME = "UserProfiles";

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    coverImage: {
      type: String,
      default: "default-cover.png",
    },
    bio: {
      type: String,
      maxLength: 500,
    },
    location: String,
    website: String,
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
    social: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    interests: [String],
    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        from: Date,
        to: Date,
        current: Boolean,
      },
    ],
    work: [
      {
        company: String,
        position: String,
        from: Date,
        to: Date,
        current: Boolean,
      },
    ],
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, userProfileSchema);

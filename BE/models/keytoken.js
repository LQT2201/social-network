const mongoose = require("mongoose");

const DOCUMENT_NAME = "Keytoken";
const COLLECTION_NAME = "Keytokens";

var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);

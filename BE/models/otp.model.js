const mongoose = require("mongoose");

const DOCUMENT_NAME = "Otp";
const COLLECTION_NAME = "Otps";

const OTPSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { collection: COLLECTION_NAME, timestamps: true }
);

module.exports = mongoose.model(DOCUMENT_NAME, OTPSchema);

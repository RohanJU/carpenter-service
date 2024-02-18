const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    emailOtp: {
      type: String,
      required: true,
    },
    phoneOtp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otpSchema);

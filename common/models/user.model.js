const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    birthday: Date,
    profilePicture: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["business", "guest", "admin", "superadmin"],
      default: "guest",
    },
    firebaseToken: String,
    verificationKey: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    country: {
      type: String,
      enum: ["TUN", "DZA", "MCO"],
      default: "TUN",
      required: true,
    },
    BusinessID: {
      type: Schema.Types.ObjectId,
      ref: "Business",
    },
    fcmToken: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);

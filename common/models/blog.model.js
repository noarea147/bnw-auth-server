const mongoose = require("mongoose");

const { Schema } = mongoose;
const blogSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    title: String,
    text: String,
    body: String,
    meta_tags: [String],
    language: String,
    keywords: [String],
    image: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    alternativeHeader: String,
    description: String,
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "published", "deleted"],
    },
    category: String,
    subcategory: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

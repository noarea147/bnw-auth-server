const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available",
    },
    capacity: {
      type: Number,
    },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    timeBlocker: {
      type: Schema.Types.ObjectId,
      ref: 'TimeBlocker',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.models.Room || mongoose.model('Room', roomSchema);

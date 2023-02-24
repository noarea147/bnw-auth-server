const mongoose = require('mongoose');

const { Schema } = mongoose;
const timeBlockerSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    startDateAndTime: {
      type: Date,
      required: true,
    },
    endDateAndTime: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.models.TimeBlocker || mongoose.model('TimeBlocker', timeBlockerSchema);

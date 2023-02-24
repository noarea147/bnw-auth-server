const mongoose = require('mongoose');

const { Schema } = mongoose;
const appointmentSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    lawyer: {
      type: Schema.Types.ObjectId,
      ref: 'Lawyer',
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['virtual', 'inPerson'],
      default: 'inPerson',
      required: true,
    },
    timeBlocker: {
      type: Schema.Types.ObjectId,
      ref: 'TimeBlocker',
      required: true,
    },
    virtualMeetingLink: String,
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

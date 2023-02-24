const mongoose = require("mongoose");

const { Schema } = mongoose;
const businessSchema = new Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    profilePicture: {
      type: String,
      required: true,
    },
    businessAddress: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    numberOfCallAttempts: {
      type: Number,
      default: 0,
    },
    numberOfViews: {
      type: Number,
      default: 0,
    },
    clients: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    workingHours: {
      type: [
        {
          day: {
            type: String,
            required: true,
          },
          startTimeMorning: {
            type: String,
            required: true,
          },
          endTimeMorning: {
            type: String,
            required: true,
          },
          startTimeAfternoon: {
            type: String,
            required: true,
          },
          endTimeAfternoon: {
            type: String,
            required: true,
          },
        },
      ],
      default: [
        {
          day: "Sunday",
          startTimeMorning: "08:00:00",
          endTimeMorning: "08:00:00",
          startTimeAfternoon: "08:00:00",
          endTimeAfternoon: "08:00:00",
        },
        {
          day: "Monday",
          startTimeMorning: "08:00:00",
          endTimeMorning: "12:00:00",
          startTimeAfternoon: "13:00:00",
          endTimeAfternoon: "17:00:00",
        },
        {
          day: "Tuesday",
          startTimeMorning: "08:00:00",
          endTimeMorning: "12:00:00",
          startTimeAfternoon: "13:00:00",
          endTimeAfternoon: "17:00:00",
        },
        {
          day: "Wednesday",
          startTimeMorning: "08:00:00",
          endTimeMorning: "12:00:00",
          startTimeAfternoon: "13:00:00",
          endTimeAfternoon: "17:00:00",
        },
        {
          day: "Thursday",
          startTimeMorning: "08:00:00",
          endTimeMorning: "12:00:00",
          startTimeAfternoon: "13:00:00",
          endTimeAfternoon: "17:00:00",
        },
        {
          day: "Friday",
          startTimeMorning: "08:00:00",
          endTimeMorning: "12:00:00",
          startTimeAfternoon: "13:00:00",
          endTimeAfternoon: "17:00:00",
        },
        {
          day: "Saturday",
          startTimeMorning: "08:00:00",
          endTimeMorning: "12:00:00",
          startTimeAfternoon: "13:00:00",
          endTimeAfternoon: "17:00:00",
        },
      ],
    },
    online: Boolean,
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    country: {
      type: String,
      enum: ["TUN", "DZA", "MCO"],
      default: "TUN",
      required: true,
    },
    features: [
      {
        title: String,
        description: String,
      },
    ],
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
  },
  {
    timestamps: true,
  }
);
module.exports =
  mongoose.models.Business || mongoose.model("Business", businessSchema);

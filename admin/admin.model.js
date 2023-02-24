const mongoose = require('mongoose');

const { Schema } = mongoose;
const adminSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    actionVerificationCode: Number,
    actionVerificationExpire: Date,
    passwordResetCode: Number,
    passwordResetExpire: Date,
    role: {
      type: String,
      enum: ['admin', 'superAdmin'],
      default: 'admin',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

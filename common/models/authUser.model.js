const mongoose = require('mongoose');

const { Schema } = mongoose;
const authUserSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        passwordResetCode: Number,
        passwordResetExpire: Date,
        role: {
            type: String,
            enum: ['lawyer', 'guest', 'admin', 'superadmin'],
            default: 'guest',
            required: true,
        },
    },
    {
        timestamps: true,
    },
);
module.exports = mongoose.models.AuthUser || mongoose.model('AuthUser', authUserSchema);

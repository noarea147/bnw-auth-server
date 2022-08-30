'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tokenSchema = new Schema(
    {
        firstName: String,
        phoneNumber: String,
        role: String,
        token: String
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model('Token', tokenSchema);
/* eslint func-names: "off" */
const mongoose = require("mongoose");
const LOG = require("../common/helpers/logger");
const AdminModel = require("../admin/admin.model");
const bcrypt = require("bcrypt");

const createAdminUser = async () => {
  await AdminModel.deleteMany();
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const admin = {
    name: "Alaa",
    email: process.env.SUPER_ADMIN_EMAIL,
    password: hashedPassword,
    role: "superAdmin",
  };

  const adminUser = new AdminModel(admin);
  await adminUser.save();
  LOG.info("Admin user created successfully:");
};
createAdminUser();

require("dotenv").config();

module.exports = function () {
  const url = process.env.MONGO_DB_AUTH_URL;
  mongoose.connect(url, { useUnifiedTopology: true });
  mongoose.connection
    .once("open", () => {
      LOG.info(
        `Connected to MongoDB [AUTH ENVIRONMENT]: ${process.env.NODE_ENV}`
      );
    })
    .on("error", (error) => {
      LOG.info("Connection error:", error);
    });
};

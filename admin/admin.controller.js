require("dotenv").config();
const bcrypt = require("bcrypt");
const AdminModel = require("../common/models/admin.model");
const jwt = require("../common/auth/jwt");
const LOG = require("../common/helpers/logger");
const { sendClientEmail } = require("../common/helpers/nodemailer");

function getTokens(admin) {
  const payload = {
    id: admin._id,
    role: admin.role,
  };
  const accessToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);
  return { accessToken, refreshToken };
}

// AddAdmin
exports.AddAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });
    if (admin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const { name } = req.body;
    const newAdmin = new AdminModel({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await newAdmin.save();
    // send email to new admin to congratulate them on their new role
    const emailData = {
      email: newAdmin.email,
      subject: "Avoconsulte - Admin Added",
      text: `<p>Hi ${newAdmin.name},</p>
        <p>You have been added as an admin to Avoconsulte.</p>
        <p>Please login to your account and change your password.</p>
        <p>Thank you,</p>

        <p>Avoconsulte</p>
      `,
    };
    await sendClientEmail(emailData);
    res.status(201).json({
      message: "Admin created successfully",
    });
  } catch (err) {
    LOG.error(err);
    res.status(500).json({
      message: "Error creating admin",
    });
  }
};

// Login
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        message: "Admin does not exist",
      });
    }
    const isMatch = password === process.env.ADMIN_PASSWORD;
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    // create actionVerificationCode
    const actionVerificationCode =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    // write email to the admin trying to log in
    // update admin.actionVerificationCode
    admin.actionVerificationCode = actionVerificationCode;
    admin.actionVerificationExpire = Date.now() + 3600000; // 1 hour
    admin.save();
    const emailData = {
      from: "BNW <smtp@noiroublanc.tn>",
      to: admin.email,
      subject: "BNW - Admin Login",
      html: `<p>Hi ${admin.name},</p>
      <p>You are receiving this email because you recently requested to login to your BNW account. Please enter the following code to verify your account:</p>
      <p>${actionVerificationCode}</p>
      <p>If you did not request to login, please ignore this email.</p>
      <p>Thank you,</p>
      <p>BNW</p>`,
    };
    // send email to the admin trying to log in
    await sendClientEmail(emailData);

    // respond with verification code sent
    res.status(200).json({
      message: "Verification code sent",
    });
  } catch (err) {
    LOG.error(err);
    res.status(500).json({
      message: err,
    });
  }
};

// Verify Login with actionVerificationCode
exports.VerifyLogin = async (req, res) => {
  try {
    const { email, actionVerificationCode } = req.body;
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        message: "Admin does not exist",
      });
    }

    if (admin.actionVerificationCode !== actionVerificationCode) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }
    const { accessToken, refreshToken } = getTokens(admin);
    // remove actionVerificationCode
    admin.actionVerificationCode = null;
    admin.actionVerificationExpire = null;
    await admin.save();
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    LOG.error(err);
    res.status(500).json({
      message: "Error verifying login",
    });
  }
};

exports.RefreshToken = (req, res) => {
  try {
    const accessToken = jwt.generateAdminAccessToken(req.body);
    res.json({ accessToken });
  } catch (err) {
    LOG.error(err);
    res.status(500).send({ message: err, status: "fail" });
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const admin = await AdminModel.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }
    admin.passwordResetCode =
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    admin.passwordResetExpire = Date.now() + 3600000; // 1 hour
    await admin.save();
    const email = {
      email: admin.email,
      subject: "Avoconsulte Password Reset",
      text: `
        Hello ${admin.name},
        You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Here is your password reset code:\n \n
        
        RESET CODE:${admin.passwordResetCode}\n \n

        If you did not request this, please ignore this email and your password will remain unchanged.
      `,
    };
    await awsEmail.sendClientEmail(email);
    res.json({ message: "Email sent" });
  } catch (err) {
    LOG.error(err);
    res.status(500).send({ message: err, status: "fail" });
  }
};

// Reset Password
exports.ResetPassword = async (req, res) => {
  try {
    if (!req.body.passwordResetCode) {
      return res.status(400).json({
        message: "Password reset code is required",
      });
    }
    const admin = await AdminModel.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({
        message: "Admin not found",
      });
    }
    if (admin.passwordResetCode !== req.body.passwordResetCode) {
      return res.status(400).json({
        message: "Invalid password reset code",
      });
    }
    if (admin.passwordResetExpire < Date.now()) {
      return res.status(400).json({
        message: "Password reset code has expired",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    admin.password = hashedPassword;
    admin.passwordResetCode = undefined;
    admin.passwordResetExpire = undefined;
    await admin.save();
    res.status(200).json({
      message: "Password reset successfully",
      status: "success",
    });
  } catch (err) {
    LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

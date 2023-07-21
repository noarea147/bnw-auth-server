require("dotenv").config();
const bcrypt = require("bcrypt");
const UserModel = require("../common/models/authUser.model");
const jwt = require("../common/auth/jwt");
const { sendClientEmail } = require("../common/helpers/nodemailer");

function getTokens(user) {
  const payload = {
    id: user.id,
    role: user.role,
  };
  const accessToken = jwt.generateAccessToken(payload);
  const refreshToken = jwt.generateRefreshToken(payload);
  return { accessToken, refreshToken };
}

function getAdminTokens() {
  const payload = {
    id: "admin",
    role: "admin",
  };
  const accessToken = jwt.generateAdminAccessToken(payload);
  const refreshToken = jwt.generateAdminRefreshToken(payload);
  return { accessToken, refreshToken };
}

exports.Register = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.body.id });
    if (user) {
      return res
        .status(409)
        .send({ message: "User already exists", status: "fail" });
    }
    req.body.role = "guest";
    const newUser = new UserModel(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newUser.password = hashedPassword;
    await newUser.save();
    const tokens = getTokens(newUser);
    return res.status(201).json(tokens);
  } catch (err) {
    res.status(500).send({ message: err, status: "fail" });
  }
};

exports.Login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.body.id });
    if (!user) {
      return res.json({ message: "User not found", status: "fail" });
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const tokens = getTokens(user);
      return res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        status: "success",
      });
    }
    return res.send({ message: "wrong password", status: "fail" });
  } catch (err) {
    return res.status(500).send({ message: err, status: "fail" });
  }
};

exports.RefreshToken = (req, res) => {
  try {
    const accessToken = jwt.generateAccessToken(req.body);
    res.json({ accessToken });
  } catch (err) {
    res.status(500).send({ message: err, status: "fail" });
  }
};

exports.ForgotPassword = async (req, res) => {
  try {
    const { id, email } = req.body;
    const user = await UserModel.findOne({ id: id });
    if (!user) {
      return res.json({ message: "User not found", status: "fail" });
    }
    const code = Math.floor(Math.random() * (999999 - 100000) + 100000);
    sendClientEmail({
      from: process.env.CLIENT_SERVER_INBOX_EMAIL,
      to: email,
      subject: "Rest password Code",
      html: `<h1>Hi noir ou blanc user</h1>
      <p>This is your rest password code</p>
      <p>Code : ${code}</p>
      <p>Best regards</p>
      <p>N ou B team</p>`,
    });

    user.passwordResetCode = code;
    await user.save();
    return res
      .status(200)
      .json({ message: "Verification code sent", status: "success" });
  } catch (err) {
    res
      .status(500)
      .send({ message: "could not process request", status: "fail" });
  }
};

exports.ResetPassword = async (req, res) => {
  try {
    const { id, code, password } = req.body;
    const user = await UserModel.findOne({ id: id });
    if (!user) {
      return res.json({ message: "User not found", status: "fail" });
    }
    if (user.passwordResetCode !== parseInt(code)) {
      return res.json({ message: "Invalid code", status: "fail" });
    } else if (!password) {
      return res.json({ message: "Valid code", status: "success" });
    }
    if (code && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.passwordResetCode = null;
      await user.save();
      return res.status(200).send({
        message: "Password reset successfully",
        status: "success",
      });
    } else if (code) {
      return res.status(200).send({
        message: "The code is valid",
        status: "success",
      });
    }
  } catch (err) {
    res
      .status(500)
      .send({ message: "could not process request", status: "fail" });
  }
};
//ChangePassword
exports.ChangePassword = async (req, res) => {
  try {
    if (!req.body.data.newPassword) {
      return res.status(400).json({
        message: "Password is required",
      });
    }
    const user = await UserModel.findOne({ id: req.body.data.id });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    if (await bcrypt.compare(req.body.data.newPassword, user.password)) {
      return res.status(400).json({
        message: "can't use old password",
      });
    }
    if (await bcrypt.compare(req.body.data.oldPassword, user.password)) {
      const hashedPassword = await bcrypt.hash(req.body.data.newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({
        message: "Password reset successfully",
        status: "success",
      });
    } else {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
  } catch (err) {
    // LOG.error(err.message);
    res.status(500).send({ message: err.message, status: "fail" });
  }
};

// register admin
exports.AdminLogin = async (req, res) => {
  try {
    if (req.body.password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    // create admin tokens

    const tokens = await getAdminTokens();
    return res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      status: "success",
    });
  } catch (err) {
    res.status(500).send({ message: err, status: "fail" });
  }
};

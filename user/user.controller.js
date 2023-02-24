require('dotenv').config();
const bcrypt = require('bcrypt');
const UserModel = require('../common/models/authUser.model');
const jwt = require('../common/auth/jwt');

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
        id: 'admin',
        role: 'admin',
    };
    const accessToken = jwt.generateAdminAccessToken(payload);
    const refreshToken = jwt.generateAdminRefreshToken(payload);
    return { accessToken, refreshToken };
}

exports.Register = async(req, res) => {
    try {
        const user = await UserModel.findOne({ id: req.body.id });
        if (user) {
            return res.status(409).send({ message: 'User already exists', status: 'fail' });
        }
        req.body.role = 'guest';
        const newUser = new UserModel(req.body);
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        newUser.password = hashedPassword;
        await newUser.save();
        const tokens = await getTokens(newUser);
        return res.status(201).json(tokens);
    } catch (err) {
        res.status(500).send({ message: err, status: 'fail' });
    }
};

exports.Login = async(req, res) => {
    try {
        const user = await UserModel.findOne({ id: req.body.id });
        if (!user) {
            return res.json({ message: 'User not found', status: 'fail' });
        }
        if (await bcrypt.compare(req.body.password, user.password)) {
            const tokens = await getTokens(user);
            await UserModel.findOneAndUpdate({ id: user.id }, user, { new: true });
            return res.json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                status: 'success',
            });
        }
        return res.send({ message: 'wrong password', status: 'fail' });
    } catch (err) {
        return res.status(500).send({ message: err, status: 'fail' });
    }
};

exports.RefreshToken = (req, res) => {
    try {
        const accessToken = jwt.generateAccessToken(req.body);
        res.json({ accessToken });
    } catch (err) {
        res.status(500).send({ message: err, status: 'fail' });
    }
};

exports.ForgotPassword = async(req, res) => {
    try {
        const user = await UserModel.findOne({ id: req.body.id });
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            });
        }
        user.passwordResetCode = req.body.passwordResetCode;
        user.passwordResetExpire = Date.now() + 3600000; // 1 hour
        await user.save();
        res.status(200).json({
            message: 'Password reset code sent successfully',
            status: 'success',
        });
    } catch (err) {
        // LOG.error(err.message);
        res.status(500).send({ message: err.message, status: 'fail' });
    }
};
// Reset Password
exports.ResetPassword = async(req, res) => {
    try {
        if (!req.body.passwordResetCode) {
            return res.status(400).json({
                message: 'Password reset code is required',
            });
        }
        const user = await UserModel.findOne({ id: req.body.id });
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            });
        }
        if (user.passwordResetCode !== req.body.passwordResetCode) {
            return res.status(400).json({
                message: 'Invalid password reset code',
            });
        }
        if (user.passwordResetExpire < Date.now()) {
            return res.status(400).json({
                message: 'Password reset code has expired',
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.passwordResetCode = undefined;
        user.passwordResetExpire = undefined;
        await user.save();
        res.status(200).json({
            message: 'Password reset successfully',
            status: 'success',
        });
    } catch (err) {
        // LOG.error(err.message);
        res.status(500).send({ message: err.message, status: 'fail' });
    }
};
//ChangePassword
exports.ChangePassword = async(req, res) => {
    try {
        if (!req.body.data.newPassword) {
            return res.status(400).json({
                message: 'Password is required',
            });
        }
        const user = await UserModel.findOne({ id: req.body.data.id });
        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            });
        }
        if (await bcrypt.compare(req.body.data.newPassword, user.password)) {
            return res.status(400).json({
                message: 'can\'t use old password',
            });
        }
        if (await bcrypt.compare(req.body.data.oldPassword, user.password)) {
            const hashedPassword = await bcrypt.hash(req.body.data.newPassword, 10);
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({
                message: 'Password reset successfully',
                status: 'success',
            });
        } else {
            return res.status(400).json({
                message: 'Invalid password',
            });
        }
    } catch (err) {
        // LOG.error(err.message);
        res.status(500).send({ message: err.message, status: 'fail' });
    }
}


// register admin
exports.AdminLogin = async(req, res) => {
    try {
        if (req.body.password !== process.env.ADMIN_PASSWORD) {
            return res.status(400).json({
                message: 'Invalid password',
            });
        }
        // create admin tokens

        const tokens = await getAdminTokens();
        return res.json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            status: 'success',
        });
    } catch (err) {
        res.status(500).send({ message: err, status: 'fail' });
    }
};
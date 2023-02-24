const express = require('express');
const UserController = require('./user.controller');
const jwt = require('../common/auth/jwt');

const router = express.Router();

router.post('/register', UserController.Register);
router.post('/login', UserController.Login);
router.post('/admin-login', UserController.AdminLogin);
router.get('/refresh', jwt.authenticateRefreshToken, UserController.RefreshToken);
router.post('/reset-password', UserController.ResetPassword);
router.post('/change-password', jwt.authenticateAccessToken, UserController.ChangePassword);
router.post('/forgot-password', UserController.ForgotPassword);

module.exports = router;
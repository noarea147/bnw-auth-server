const express = require('express');
const jwt = require('../common/auth/jwt');
const AdminController = require('./admin.controller');

const router = express.Router();

router.post('/add-admin', jwt.authenticateTokenSuperAdmin, AdminController.AddAdmin);
router.post('/login', AdminController.Login);
// verify-login
router.post('/verify-login', AdminController.VerifyLogin);
router.get('/refresh', jwt.authenticateRefreshToken, AdminController.RefreshToken);
router.post('/reset-password', AdminController.ResetPassword);
router.post('/forgot-password', AdminController.ForgotPassword);
module.exports = router;

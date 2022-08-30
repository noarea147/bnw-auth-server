const express = require('express');
const TokenController = require('../Token/token.controller');
const router = express.Router();
const jwt = require('../Middleware/jwt')

router.post('/login', TokenController.Login);
router.post('/logout', TokenController.Logout);
router.post('/logoutfromalldevices', TokenController.LogoutFromAllDevices);
router.post('/refresh', TokenController.Refresh);
router.post('/accessdatabase', jwt.authenticateToken, TokenController.AccessDatabase);
module.exports = router;
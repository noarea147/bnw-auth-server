const express = require('express');
const staticController = require('./static.controller');

const router = express.Router();

// route to get all statics
router.get('/', staticController.home);
module.exports = router;

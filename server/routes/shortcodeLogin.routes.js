const express = require("express");
const {getShortcode, getShortcodeAuthorizationNotification} = require("../controllers/shortcodeLogin.controller");
const router = express.Router();

// Authentication needed
// TODO: add authentication middleware
router.get("/getShortcode", getShortcode);
router.get("/getShortcodeAuthorizationNotification", getShortcodeAuthorizationNotification);

module.exports = router;
const express = require("express");
const {setShortcode, getShortcodeAuthorizationNotification, getShortcodeSessionInfo} = require("../controllers/shortcodeLogin.controller");
const router = express.Router();

// Authentication needed
router.post("/setShortcode", setShortcode);
router.get("/getShortcodeAuthorizationNotification", getShortcodeAuthorizationNotification);
router.get("/getShortcodeSessionInfo", getShortcodeSessionInfo);

module.exports = router;
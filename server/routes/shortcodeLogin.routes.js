const express = require("express");
const {setShortcode, getShortcodeAuthorizationNotification, getShortcodeSessionInfo, setShortcodeSessionAuthorized} = require("../controllers/shortcodeLogin.controller");
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");
const router = express.Router();

router.get("/setShortcode", setShortcode);
router.get("/getShortcodeAuthorizationNotification", getShortcodeAuthorizationNotification);

// Authentication needed
router.get("/getShortcodeSessionInfo", isAuthenticatedMiddleware, getShortcodeSessionInfo);
router.post("/setShortcodeSessionAuthorized", isAuthenticatedMiddleware, setShortcodeSessionAuthorized);

module.exports = router;
const express = require("express");
const {getShortcode} = require("../controllers/shortcodeLogin.controller");
const router = express.Router();

// Authentication needed
// TODO: add authentication middleware
router.get("/getShortcode", getShortcode);

module.exports = router;
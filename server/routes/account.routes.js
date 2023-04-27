const express = require("express");
const router = express.Router();
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");

router.delete("/deleteUser", deleteUser);

module.exports = router;
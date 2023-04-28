const express = require("express");
const router = express.Router();
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");
const {deleteUser} = require("../controllers/account.controller");

router.delete("/deleteUser", isAuthenticatedMiddleware, deleteUser);

module.exports = router;
const express = require("express");
const router = express.Router();
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");
const {deleteUser, logOutUser} = require("../controllers/account.controller");

router.delete("/deleteUser", isAuthenticatedMiddleware, deleteUser);
router.post("/logOutUser", isAuthenticatedMiddleware, logOutUser);
module.exports = router;
const express = require("express");
const router = express.Router();
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");
const {deleteUser, logOutUser, getCurrentUserInformation} = require("../controllers/account.controller");

router.get("/currentUserInformation", isAuthenticatedMiddleware, getCurrentUserInformation);
router.delete("/deleteUser", isAuthenticatedMiddleware, deleteUser);
router.post("/logOutUser", isAuthenticatedMiddleware, logOutUser);
module.exports = router;
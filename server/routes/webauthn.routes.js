const express = require("express");
const router = express.Router();
const {
    isUserInDatabase,
    writeUserToDb
} = require("../controllers/webauthn.controller");

router.get("/userExists", isUserInDatabase);

// only for debugging
router.post("/writeUser", writeUserToDb);

module.exports = router;
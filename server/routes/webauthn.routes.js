const express = require("express");
const router = express.Router();
const {
    writeUserToDb, registrationOptions
} = require("../controllers/webauthn.controller");

router.post("/registrationOptions", registrationOptions);

// only for debugging
router.post("/writeUser", writeUserToDb);

module.exports = router;
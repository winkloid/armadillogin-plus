const express = require("express");
const router = express.Router();
const {
    writeUserToDb, registrationOptions, completeRegistration
} = require("../controllers/webauthn.controller");

router.post("/registrationOptions", registrationOptions);
router.post("/completeRegistration", completeRegistration);

// only for debugging
router.post("/writeUser", writeUserToDb);

module.exports = router;
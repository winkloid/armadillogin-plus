const express = require("express");
const router = express.Router();
const {
    registrationOptions, completeRegistration, authenticationOptions
} = require("../controllers/webauthn.controller");

// WebAuthn Registration
router.post("/registrationOptions", registrationOptions);
router.post("/completeRegistration", completeRegistration);

// WebAuthn Authentication
router.get("/authenticationOptions", authenticationOptions);


module.exports = router;
const express = require("express");
const router = express.Router();
const {
    registrationOptions, completeRegistration, authenticationOptions, completeAuthentication
} = require("../controllers/webauthn.controller");

// WebAuthn Registration
router.post("/registrationOptions", registrationOptions);
router.post("/completeRegistration", completeRegistration);

// WebAuthn Authentication
router.post("/authenticationOptions", authenticationOptions);
router.post("/completeAuthentication", completeAuthentication);

module.exports = router;
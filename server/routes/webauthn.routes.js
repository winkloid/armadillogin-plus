const express = require("express");
const router = express.Router();
const {
    registrationOptions, completeRegistration, authenticationOptions, completeAuthentication, addNewAuthenticatorOptions,
    addNewAuthenticatorCompletion
} = require("../controllers/webauthn.controller");
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");

// WebAuthn Registration
router.post("/registrationOptions", registrationOptions);
router.post("/completeRegistration", completeRegistration);

// WebAuthn Authentication
router.post("/authenticationOptions", authenticationOptions);
router.post("/completeAuthentication", completeAuthentication);

// Operations that need Authorization
router.get("/addNewAuthenticatorOptions", isAuthenticatedMiddleware, addNewAuthenticatorOptions);
router.post("/addNewAuthenticatorCompletion", isAuthenticatedMiddleware, addNewAuthenticatorCompletion);

module.exports = router;
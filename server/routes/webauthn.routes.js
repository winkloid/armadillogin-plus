const express = require("express");
const router = express.Router();
const {
    registrationOptions, completeRegistration, authenticationOptions, completeAuthentication, addNewAuthenticatorOptions,
    addNewAuthenticatorCompletion, getUserAuthenticatorList, deleteAuthenticator
} = require("../controllers/webauthn.controller");
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");

// WebAuthn Registration
// time_startRegistration measurement
router.post("/registrationOptions", registrationOptions);
// time_endRegistration measurement
router.post("/completeRegistration", completeRegistration);

// WebAuthn Authentication
// time_startFido2Authentication measurement
router.post("/authenticationOptions", authenticationOptions);
// time_endFido2Authentication measurement
router.post("/completeAuthentication", completeAuthentication);

// Operations that need Authorization
router.get("/addNewAuthenticatorOptions", isAuthenticatedMiddleware, addNewAuthenticatorOptions);
router.post("/addNewAuthenticatorCompletion", isAuthenticatedMiddleware, addNewAuthenticatorCompletion);
router.get("/getUserAuthenticatorList", isAuthenticatedMiddleware, getUserAuthenticatorList);
router.delete("/deleteAuthenticator", isAuthenticatedMiddleware, deleteAuthenticator);

module.exports = router;
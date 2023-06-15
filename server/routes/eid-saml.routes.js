const express = require("express");
const router = express.Router();
const fs = require("fs");
const {
    getMetadata, samlLogin, samlCallback, assertSaml, linkEIdToAccount, loginUserNameInput, loginCompletion,
    getUserInformation
} = require("../controllers/eid-saml.controller");
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");

router.get("/metadata", getMetadata);
router.get("/login", samlLogin);
router.post("/callback", samlCallback);
router.post("/assert", assertSaml);
router.put("/linkEIdToAccount", isAuthenticatedMiddleware, linkEIdToAccount);
router.post("/loginUserNameInput", loginUserNameInput);
router.post("/loginCompletion", loginCompletion);
router.get("/userInformation", isAuthenticatedMiddleware, getUserInformation);

module.exports = router;
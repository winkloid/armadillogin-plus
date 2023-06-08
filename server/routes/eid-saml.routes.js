const express = require("express");
const router = express.Router();
const fs = require("fs");
const {
    getMetadata, samlLogin, samlCallback, assertSaml, linkEIdToAccount, loginUserNameInput, loginCompletion
} = require("../controllers/eid-saml.controller");
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");

router.get("/metadata", getMetadata);
router.get("/login", samlLogin);
router.post("/callback", samlCallback);
router.post("/assert", assertSaml);
router.put("/linkEIdToAccount", isAuthenticatedMiddleware, linkEIdToAccount);
router.post("/loginUserNameInput", loginUserNameInput);
router.post("/loginCompletion", loginCompletion);

module.exports = router;
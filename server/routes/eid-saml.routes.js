const express = require("express");
const router = express.Router();
const passport = require("passport");
const saml = require("passport-saml");
const fs = require("fs");
const {
    getMetadata, getMainpage
} = require("../controllers/eid-saml.controller");
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");
const config = require("../config/config");
const {samlStrategy} = require("../middleware/passportSamlMiddleware");

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use("samlStrategy", samlStrategy);


router.get("/", getMainpage);

router.get("/metadata", getMetadata);

router.get("/login",
    passport.authenticate("samlStrategy", {
        failureRedirect: "/api/eid-saml/login",
        successRedirect: "/api/eid-saml/"
    })
);

router.post("/callback",
    passport.authenticate("samlStrategy", {
        failureRedirect: "/api/eid-saml/login",
        failureFlash: true,
    }),
    function (req, res) {
        return res.status(200).send("Authentifizierung erfolgreich.");
    }
);

module.exports = router;
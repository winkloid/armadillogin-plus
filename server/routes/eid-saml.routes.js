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
const UserModel = require("../models/user.model")

// Passport related configuration
const samlStrategy = new saml.Strategy(
    config.passport.saml,
    function (profile, done) {
        try {
            return done(null, profile);
        } catch(error) {
            return done(null, false, "Fehler bei der Anmeldung mittels Personalausweis. Folgender Fehler ist aufgetreten: \n" + error);
        }
    }
);
passport.serializeUser((user, done) => {
    process.nextTick(function() {
        return done(null, {
            eIdentifier: user.nameID,
            issuer: user.attributes["http://www.skidentity.de/att/IDIssuer"]
        });
    });
});

passport.deserializeUser((user, done) => {
    process.nextTick(function() {
        return done(null, user);
    })
});

passport.use("samlStrategy", samlStrategy);


router.get("/", getMainpage);

router.get("/metadata", getMetadata);

router.get("/login",
    passport.authenticate("samlStrategy", {
        failureRedirect: "/api/eid-saml/login",
        successRedirect: "/api/eid-saml/",
        session: false
    })
);

router.post("/callback", function(req, res, next) {
        passport.authenticate("samlStrategy", {
            failureRedirect: "/api/eid-saml/login",
            session: false
        }, async function (err, user, info) {
            console.log("User: " + user);
        if(err) {
            res.status(500).send("<h1>Interner Server Fehler</h1>");
        } else {
            const userName = req.session.userName;
            const userId = req.session.userId;
            const eIdentifier = user.eIdentifier;
            if (req.session?.isAuthenticated && req.session?.userName && req.session?.userId) {
                let eIdentifierAdditionResponse = await UserModel.updateOne({
                    userName: userName,
                    _id: userId
                }, {
                    $set: {
                        eIdentifier: eIdentifier
                    }
                }).then((response) => {
                    return {success: 1, content: response};
                }).catch((error) => {
                    return {success: 0, content: error};
                });

                if (eIdentifierAdditionResponse.success === 0) {
                    return res.redirect("/api/eid-saml/login");
                } else {
                    return res.redirect(process.env.FRONTEND_BASE_URL + "/private");
                }
            } else {
                let userByEId = await UserModel.findOne({
                    eIdentifier: eIdentifier
                }).then((response) => {
                    return {success: 1, content: response};
                }).catch((error) => {
                    return {success: 0, content: error};
                });
            }
            req.session.isAuthenticated = true;
            req.session.userName = userName;
            req.session.userId = userId;
            res.redirect("https://armadillogin.winkloid.de:5173/private");
        }
    })(req, res, next);
});

module.exports = router;
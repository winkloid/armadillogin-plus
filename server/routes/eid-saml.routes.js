const express = require("express");
const router = express.Router();
const fs = require("fs");
const {
    getMetadata, samlLogin, samlCallback, getMainpage, assertSaml
} = require("../controllers/eid-saml.controller");
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");



router.get("/", getMainpage);

router.get("/metadata", getMetadata);

router.get("/login", samlLogin);
router.post("/callback", samlCallback);
router.post("/assert", assertSaml);


/*
* function(req, res, next) {
        passport.authenticate("samlStrategy", {
            failureRedirect: "/api/eid-saml/login",
        }, async function (err, user, info) {
            console.log("User: " + user);
        if(err) {
            res.status(500).send("<h1>Interner Server Fehler</h1>");
        } else {
            console.log(user.req);
            console.log(user[0].session);
            const userName = user.req.session.userName;
            const userId = user.req.session.userId;
            const isAuthenticated = user.req.session.isAuthenticated
            const eIdentifier = user.eIdentifier;
            if (isAuthenticated && userName && userId) {
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
    })(req, res, next);*/

module.exports = router;
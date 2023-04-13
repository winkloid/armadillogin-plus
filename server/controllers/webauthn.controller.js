const UserModel = require("../models/user.model");

// constant values needed for WebAuthn implementation itself
const WebAuthnAuthenticatorModel = require("../models/webauthn_authenticator.model");
const rpName = "ArmadilLogin PLUS";
const rpId = "localhost"; // domain name
const origin = "http://" + rpId;
const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
} = require("@simplewebauthn/server");

// PUBLIC
const registrationOptions = async (req, res) => {
    UserModel.exists({
        userName: req.body.userName
    }).then((databaseResponse) => {
        if(databaseResponse) {
            return res.status(400).send("User already exists and cannot be registered again. Please choose another username.");
        } else {
            // if the user does not exist yet, we can create a new one
            req.session.userName = req.body.userName;

            const options = generateRegistrationOptions({
                rpName: rpName,
                rpID: rpId,
                userName: req.body.userName,
                attestationType: "none",
                excludeCredentials: []
            });
            req.session.currentChallenge = options.challenge;
            return res.status(200).send(options);
        }
    }).catch((error) => {
        return res.status(500).send("Server error:\n" + error);
    });
}




// only for debugging
const writeUserToDb = (req, res) => {
    const newUser = new UserModel({
        userName: req.body.userName,
    }).save().then((databaseResponse) => {
        return res.status(200).send("User saved.\n" + databaseResponse);
    }).catch((error) => {
        return res.status(500).send("Server error:\n" + error);
    });
} 

module.exports = {
    registrationOptions,
    writeUserToDb
}
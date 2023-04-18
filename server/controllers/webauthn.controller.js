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
const {data} = require("express-session/session/cookie");

const maxRetriesOnError = 10;

// PUBLIC
const registrationOptions = async (req, res) => {
    if(!req.body.userName) {
        return res.status(400).send("Kein Benutzername angegeben. Bitte geben Sie einen Benutzernamen an.");
    }
    const existsUser = await UserModel.exists({
        userName: req.body.userName
    }).then((databaseResponse) => {
        return {success: 1, content: databaseResponse};
    }).catch((error) => {
        return {success: 0, content: error};
    });

    if(existsUser.success) {
        if(existsUser.content) {
            return res.status(400).send("Der Benutzername existiert bereits und kann nicht erneut vergeben werden. Bitte wählen Sie einen anderen Benutzernamen.");
        } else {
            // if the user does not exist yet, we can create a new one
            let newlyCreatedUser = await createNewUser(req.body.userName);

            // in the very unlikely case that a newly generated (UUID-based!) user id already exists we try again for a specified number of times to create the user with a new id
            for(let iterator = 0; (!newlyCreatedUser.success) && (maxRetriesOnError-iterator > 0); iterator++) {
                newlyCreatedUser = await createNewUser(req.body.userName);
            }
            // if we were still not successful in creating an unqiue user id after those retries we return an internal server error
            if(!newlyCreatedUser.success) {
                return res.status(500).send("Internal Server Error: not enough free user Ids available.");
            }

            req.session.userName = req.body.userName;

            const options = generateRegistrationOptions({
                rpName: rpName,
                rpID: rpId,
                userID: newlyCreatedUser.content._id,
                userName: req.body.userName,
                attestationType: "none",
                excludeCredentials: []
            });
            req.session.currentChallenge = options.challenge;
            return res.status(200).send(options);
        }
    } else {
        return res.status(500).send("Internal Server Error: \n\n" + existsUser.content);
    }
}

// PRIVATE
async function createNewUser(userName) {
    return await UserModel.create({
        userName: userName
    }).then((databaseResponse) => {
        return {success: 1, content: databaseResponse};
    }).catch((error) => {
        return {success: 0, content: error};
    })
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
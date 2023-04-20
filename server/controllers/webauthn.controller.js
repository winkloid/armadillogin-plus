const UserModel = require("../models/user.model");

// constant values needed for WebAuthn implementation itself
const WebAuthnAuthenticatorModel = require("../models/webauthn_authenticator.model");
const rpName = "ArmadilLogin PLUS";
const rpId = process.env.rpId; // domain name
const origin = "http://" + rpId + ":" + process.env.clientPort;
const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse
} = require("@simplewebauthn/server");
const {data} = require("express-session/session/cookie");

const maxRetriesOnError = 10;

// PUBLIC
const registrationOptions = async (req, res) => {
    if(!req.body.userName) {
        return res.status(400).send("Kein Benutzername angegeben. Bitte geben Sie einen Benutzernamen an.");
    }
    const isUserRegistered = await UserModel.findOne({
        userName: req.body.userName
    }).exec().then(async (databaseResponse) => {
        if(!databaseResponse) {
            return {success: 1, content: false};
        } else {
            // if a user with the specified username was found and is already registered, return true
            if(databaseResponse.isRegistered) {
                return {success: 1, content: true};

            // if a user with the specified username was found but its registration is not yet complete
            // this is necessary here because the database shall not be spammed with usernames that can't be used anymore after this
            } else {
                // if a username already exists in the database but the registration process for it was not completed yet, the user is deleted in order to create a new one later
                // this is done to handle race conditions so that two users can never have the same user id to register an authenticator
                return await UserModel.deleteOne({userName: req.body.userName, isRegistered: false}).exec().then((deletionResponse) => {
                    return {success: 1, content: false};
                }).catch((error) => {
                    return {success: 0, content: error};
                });
            }
        }
    }).catch((error) => {
        return {success: 0, content: error};
    });

    // if request for user was successful
    if(isUserRegistered.success) {
        //if there is (content !== null) in the response, i.e. if an user was found
        if(isUserRegistered.content) {
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
            req.session.userId = newlyCreatedUser.content._id;

            const options = generateRegistrationOptions({
                rpName: rpName,
                rpID: rpId,
                userID: newlyCreatedUser.content._id,
                userName: req.body.userName,
                attestationType: "none",
                excludeCredentials: [],
                authenticatorSelection: {
                    userVerification: "discouraged"
                }
            });
            req.session.currentChallenge = options.challenge;
            return res.status(200).send(options);
        }
    } else {
        return res.status(500).send("Internal Server Error: \n\n" + isUserRegistered.content);
    }
}

// PUBLIC
const completeRegistration =  async (req, res) => {
    if (!req.body) {
        return res.status(400).send("Fehlerhafte Anfrage: Es wurde eine leere Registration-Response übermittelt.");
    }
    const currentChallenge = req.session.currentChallenge;

    let registrationVerification;
    try {
        registrationVerification = await verifyRegistrationResponse({
            response: req.body,
            expectedChallenge: currentChallenge,
            expectedOrigin: origin,
            expectedRPID: rpId,
            requireUserVerification: false
        });
    } catch (verificationError) {
        console.log(verificationError);
        return res.status(400).send("Fehler beim Verifizieren der Registration-Response: \n" + verificationError.message);
    }

    const registrationVerified = registrationVerification.verified;
    const registrationInformation = registrationVerification.registrationInfo;

    if(registrationVerified && registrationInformation) {
        const credentialPublicKey = registrationInformation.credentialPublicKey;
        const credentialId = registrationInformation.credentialID;
        const counter = registrationInformation.counter;

        // set corresponding user as registered
        const setUserRegistered = await UserModel.updateOne({
            _id: req.session.userId,
            isRegistered: false
        }, {$set: {
            isRegistered: true
        }}).exec().then((databaseResponse) => {
            return {success: 1, content: databaseResponse};
        }).catch((error) => {
            return {success: 0, content: error};
        });

        if(!setUserRegistered.success) {
            return res.status(500).send("Fehler bei der Kommunikation mit der Datenbank beim Abschluss der Nutzerregistrierung.");
        } else {
            if(setUserRegistered.content.matchedCount === 0) {
                return res.status(403).send("Ein Nutzer mit dem angegebenen Benutzernamen existiert entweder nicht oder hat die Registrierung bereits abgeschlossen. Wenn Sie Ihrem Konto einen weiteren Authenticator hinzufügen möchten, können Sie dies nach einem Login in Ihrem persönlichen Bereich tun.");
            } else {
                try {
                    // Add authenticator to database if the specified user is not already registered
                    const newWebAuthnAuthenticator = await WebAuthnAuthenticatorModel.create({
                        userReference: req.session.userId,
                        credentialId: Buffer.from(credentialId),
                        credentialPublicKey: Buffer.from(credentialPublicKey),
                        counter: counter,
                        transports: req.body.response.transports
                    });
                    return res.status(201).send("Der Benutzer" + req.session.userName + " wurde registriert. \n" + registrationVerified);
                } catch(error) {
                    return res.status(500).send("Interner Server Fehler beim Hinzufügen des Authenticators zur Datenbank." + error);
                }
            }
        }
    } else return res.status(400).send("Fehler beim Auslesen der Informationen aus der Registration-Response des Authenticators.");
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

/*
Authentication
 */
const authenticationOptions = async (req, res) => {
    if(!req.body.userName) {
        return res.status(400).send("Kein Benutzername angegeben. Bitte geben Sie einen Benutzernamen an.");
    }

    // fetch user information from database
    const fetchedUserInformation = await UserModel.findOne({
        userName: req.body.userName,
        isRegistered: true
    }).exec().then((databaseResponse) => {
        return {success: 1, content: databaseResponse};
    }).catch((databaseError) => {
        return {success: 0, content: databaseError};
    });

    // handle errors in fetched user information
    if(fetchedUserInformation.success === 0) {
        return res.status(500).send("Interner Server Fehler - Abruf von Benutzerinformationen aus der Datenbank nicht möglich. \nFehlerbeschreibung:\n"+ fetchedUserInformation.content);
    }
    if(fetchedUserInformation.success === 1 && fetchedUserInformation.content === null) {
        return res.status(404).send("Ein registrierter Benutzer mit dem angegebenen Benutzernamen konnte nicht gefunden werden. Bitte überprüfen Sie den angegebenen Benutzernamen.");
    }
    const user = fetchedUserInformation.content;

    // fetch authenticator information of the authenticators registered by the provided user
    const fetchedAuthenticatorInformation = await WebAuthnAuthenticatorModel.find({
        userReference: user._id
    }).exec().then((databaseResponse) => {
        return {success: 1, content: databaseResponse};
    }).catch((databaseError) => {
        return {success: 0, content: databaseError};
    });

    // handle errors in fetched authenticator information
    if(fetchedAuthenticatorInformation.success === 0) {
        return res.status(500).send("Interner Server Fehler - Abruf von Authenticator-Informationen aus der Datenbank nicht möglich. \nFehlerbeschreibung:\n" + fetchedAuthenticatorInformation.content);
    }
    if(fetchedAuthenticatorInformation.success === 1 && fetchedAuthenticatorInformation.content === []) {
        return res.status(404).send("Für den angegebenen Benutzer wurden keine Authenticators in der Datenbank gefunden.");
    }
    const userAuthenticators = fetchedAuthenticatorInformation.content;

    const authenticationOptions = generateAuthenticationOptions({
        allowCredentials: userAuthenticators.map((userAuthenticator) => ({
            // reconvert the credentialId of the authenticator which is stored as Buffer in the DB back to UInt8Array
            id: new Uint8Array(userAuthenticator.credentialId.buffer),
            type: "public-key",
            transports: userAuthenticator.transports,
        })),
        userVerification: "discouraged",
    });

    req.session.userName = req.body.userName;
    req.session.userId = user._id;
    req.session.currentChallenge = authenticationOptions.challenge;

    return res.status(200).send(authenticationOptions);
}

module.exports = {
    registrationOptions,
    completeRegistration,
    authenticationOptions
}
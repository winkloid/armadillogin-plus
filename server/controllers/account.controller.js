const UserModel = require("../models/user.model");
const LoginSessionModel = require("../models/loginSession.model");
const WebAuthnAuthenticatorModel = require("../models/webauthn_authenticator.model")
const mongoose= require("mongoose");

const getCurrentUserInformation = async (req, res) => {
    if(req.session?.userId && req.session?.userName) {
        return res.status(200).send({
            userName: req.session.userName
        });
    } else {
        return res.status(404).send("Es wurde kein aktuell authentifizierter Benutzer gefunden.");
    }
}

const setUserTimeStamps = async (req, res) => {
    return UserModel.updateOne({
        _id: req.session.userId,
        userName: req.session.userName,
        isRegistered: true
    }, {
        $set: {
            time_startFido2Registration: ((req.session.time_startFido2Registration) ? req.session.time_startFido2Registration : undefined),
            time_endFido2Registration: ((req.session.time_endFido2Registration) ? req.session.time_endFido2Registration : undefined),
            time_startFido2Authentication: ((req.session.time_startFido2Authentication) ? req.session.time_startFido2Authentication : undefined),
            time_endFido2Authentication: ((req.session.time_endFido2Authentication) ? req.session.time_endFido2Authentication : undefined),
            time_startShortcode: ((req.session.time_startShortcode) ? req.session.time_startShortcode : undefined),
            time_endShortcode: ((req.session.time_endShortcode) ? req.session.time_endShortcode : undefined),
            time_startShortcodeFido2Authentication: ((req.session.time_startShortcodeFido2Authentication) ? req.session.time_startShortcodeFido2Authentication : undefined),
            time_endShortcodeFido2Authentication: ((req.session.time_endShortcodeFido2Authentication) ? req.session.time_endShortcodeFido2Authentication : undefined),
            time_startEIdRegistration: ((req.session.time_startEIdRegistration) ? req.session.time_startEIdRegistration : undefined),
            time_endEIdRegistration: ((req.session.time_endEIdRegistration) ? req.session.time_endEIdRegistration : undefined),
            time_startEIdAuthentication: ((req.session.time_startEIdAuthentication) ? req.session.time_startEIdAuthentication : undefined),
            time_endEIdAuthentication: ((req.session.time_endEIdAuthentication) ? req.session.time_endEIdAuthentication : undefined),
        }
    }, {ignoreUndefined: true}).then(databaseResponse => {
        return res.status(200).send("Zeitstempel für den Benutzer wurden erfolgreich aktualisiert.");
    }).catch(error => {
        console.log(error);
        return res.status(500).send("Interner Serverfehler: Die Zeitstempel konnten für den angegebenen Benutzer nicht aktualisiert werden.");
    })
}

const deleteUser = async (req, res) => {
    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();
    try {
        await LoginSessionModel.deleteMany({
            "session.userId": req.session.userId
        }).session(mongooseSession);
        await WebAuthnAuthenticatorModel.deleteMany({
            userReference: req.session.userId,
        }).session(mongooseSession);
        await UserModel.deleteOne({
            _id: req.session.userId,
        }).session(mongooseSession);
        await mongooseSession.commitTransaction();
        await mongooseSession.endSession();
        return res.status(204).send("Erfolgreich gelöscht.");
    } catch(transActionError) {
        console.error("Aborted deleteUser transaction!");
        await mongooseSession.abortTransaction();
        await mongooseSession.endSession();
        return res.status(500).send("Es konnten nicht alle Daten des Nutzers " + req.session.userId + " gelöscht werden. Die Löschung wurde daher abgebrochen und rückgängig gemacht. Es wurden keine Benutzerdaten gelöscht.");
    }
}

const logOutUser = (req, res) => {
    req.session.destroy();
    return res.status(200).send("Benutzer wurde erfolgreich ausgeloggt.");
}

module.exports = {
    getCurrentUserInformation,
    deleteUser,
    logOutUser,
    setUserTimeStamps
}
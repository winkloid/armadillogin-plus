const UserModel = require("../models/user.model");
const LoginSessionModel = require("../models/loginSession.model");
const WebAuthnAuthenticatorModel = require("../models/webauthn_authenticator.model")
const mongoose= require("mongoose");

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
    deleteUser,
    logOutUser
}
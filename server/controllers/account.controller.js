const UserModel = require("../models/user.model");
const LoginSessionModel = require("../models/loginSession.model");
const WebAuthnAuthenticatorModel = require("../models/webauthn_authenticator.model")
const mongoose= require("mongoose");

/*
@desc Returns personal user information. Since the personal information requested by ArmadilLogin-PLUS by now is an username, only the username of the currently logged in user is returned.
@route GET /api/account/currentUserInformation
@access Private
 */
const getCurrentUserInformation = async (req, res) => {
    if(req.session?.userId && req.session?.userName) {
        return res.status(200).send({
            userName: req.session.userName
        });
    } else {
        return res.status(404).send("Es wurde kein aktuell authentifizierter Benutzer gefunden.");
    }
}

/*
@desc Deletes all user Sessions, authenticators connected to the currently logged-in user account and all other information linked to the user account.
@route DELETE /api/account/deleteUser
@access Private
 */
const deleteUser = async (req, res) => {
    // use a transaction to delete all user information because this operation shall not affect any user data if any of the deletion operations do not succeed
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

/*
@desc Deletes the current user session without affecting any other user information.
@route POST /api/account/logOutUser
@access Private
 */
const logOutUser = (req, res) => {
    req.session.destroy();
    return res.status(200).send("Benutzer wurde erfolgreich ausgeloggt.");
}

module.exports = {
    getCurrentUserInformation,
    deleteUser,
    logOutUser
}
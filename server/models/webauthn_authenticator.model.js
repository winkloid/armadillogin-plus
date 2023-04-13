const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WebAuthnAuthenticatorSchema = new Schema({
    userReference: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    },
    credentialId: {type: Buffer},
    credentialPublicKey: {type: Buffer},
    counter: {type: Number},
    credentialDeviceType: {type: String},
    credentialBackup: {type: Boolean},
    transports: [{type: String}]

});

module.exports = mongoose.model("WebAuthnAuthenticatorModel", WebAuthnAuthenticatorSchema, "authenticators_webauthn");
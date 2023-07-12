const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: {type: String, default: function generateUUID() { return uuidv4(); }},
    userName: {type: String, required: true, unique: true},
    isRegistered: {type: Boolean, default: false, required:true},
    eIdentifier: {type: String, required: false},
    time_startFido2RegistrationWithUserName: {type: Number, default: null},
    time_startFido2Registration: {type: Number, default: null},
    time_endFido2Registration: {type: Number, default: null},
    time_startFido2AuthenticationWithUserName: {type: Number, default: null},
    time_startFido2Authentication: {type: Number, default: null},
    time_endFido2Authentication: {type: Number, default: null},
    time_startShortcode: {type: Number, default: null},
    time_endShortcode: {type: Number, default: null},
    time_startShortcodeFido2Authentication: {type: Number, default: null},
    time_endShortcodeFido2Authentication: {type: Number, default: null},
    time_startEIdRegistration: {type: Number, default: null},
    time_endEIdRegistration: {type: Number, default: null},
    time_startEIdAuthentication: {type: Number, default: null},
    time_endEIdAuthentication: {type: Number, default: null},
});

module.exports = mongoose.model("UserModel", UserSchema, "users");
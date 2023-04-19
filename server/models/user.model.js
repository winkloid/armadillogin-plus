const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: {type: String, default: function generateUUID() { return uuidv4(); }},
    userName: {type: String, required: true, unique: true},
    isRegistered: {type: Boolean, default: false, required:true},
    currentUserChallenge: {type: String},
});

module.exports = mongoose.model("UserModel", UserSchema, "users");
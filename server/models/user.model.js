const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: {type: String, required: true},
    currentUserChallenge: {type: String},
});

module.exports = mongoose.model("UserModel", UserSchema, "users");
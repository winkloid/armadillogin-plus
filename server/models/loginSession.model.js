const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoginSessionSchema = new Schema({
    _id: {type: String},
    expires: {type: Date},
    session: {
        isAuthenticated: {type: Boolean},
        userName: {type: String},
        userId: {type: String},
        currentChallenge: {type: String},
        time_endShortcode: {type: Number}
    },
});

module.exports = mongoose.model("LoginSessionModel", LoginSessionSchema, "loginSessions");
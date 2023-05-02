const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoginSessionSchema = new Schema({
    expires: {type: Date},
    session: {
        isAuthenticated: {type: Boolean},
        userName: {type: String},
        userId: {type: String},
        currentChallenge: {type: String},
    },
});

module.exports = mongoose.model("LoginSessionModel", LoginSessionSchema, "loginSessions");
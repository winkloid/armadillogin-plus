const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortcodeLength = 6;
const possibleCharsArray = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
]

// helper function to generate pseudo-random shortcodes made of letters and numbers
const generateShortcode = () => {
    let shortcode = "";
    for(let i= 0; i < shortcodeLength; i++) {
        // append the value to the shortcode string that can be found on a randomly generated index of @possibleCharsArray
        let currentChar = possibleCharsArray[Math.floor(Math.random() * (possibleCharsArray.length - 1))];
        shortcode = shortcode.concat(currentChar);
    }
    return shortcode;
}

const ShortcodeSessionSchema = new Schema({
    _id: {type: String, default: function shortCodeGen() { return generateShortcode(); }},
    createdAt: {type: Date, expires: 600, default: Date.now()},
    sessionId: {type: String},
    verifyingString: {type: String, default: function generateVerifyingString() {}},
    userAgentInfo: {type: Object},
    isAuthorized: {type: Boolean},
});

module.exports = mongoose.model("ShortcodeSessionModel", ShortcodeSessionSchema, "shortcodeSessions");
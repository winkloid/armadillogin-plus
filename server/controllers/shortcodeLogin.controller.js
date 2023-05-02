const ShortcodeSessionModel = require("../models/shortcodeSession.model");
const emoji = require("emoji-dictionary");

const maxRetriesOnError = 10;
const verifyingEmojiStringLength = 3;

const getShortcode = async (req, res) => {
    req.session.regenerate(function (err) {});
    let verifyingString = emojiStringGenerator();
    let newlyCreatedShortcodeSession = await createNewShortcodeSession(req.session.id, verifyingString);

    // if we have a collision of 2 shortcode sessions in the database: try it again as often as specified in @maxRetriesOnError
    if(!newlyCreatedShortcodeSession.success) {
        for(let iterator = 0; (!newlyCreatedShortcodeSession.success) && (iterator < maxRetriesOnError); iterator) {
            newlyCreatedShortcodeSession = await createNewShortcodeSession(req.session.id, verifyingString);
        }
    }
    // if after this procedure there are still collisions (or other database errors): cancel the procedure and request the user to try again later
    if(!newlyCreatedShortcodeSession.success) {
        return res.status(500).send("Aktuell sind keine temporären Sitzungen mehr frei. Bitte probieren Sie es später erneut.");
    }

    return res.status(201).send(newlyCreatedShortcodeSession);
}

// Private helper functions
async function createNewShortcodeSession(sessionId, verifyingString) {
    return await ShortcodeSessionModel.create({
        sessionId: sessionId,
        verifyingString: verifyingString
    }).then((databaseResponse) => {
        return {success: 1, content: databaseResponse};
    }).catch((error) => {
        return {success: 0, content: error};
    });
}

function emojiStringGenerator() {
    let verifyingString = "";
    for(let i= 0; i < verifyingEmojiStringLength; i++) {
        // append the value to the shortcode string that can be found on a randomly generated index of @possibleCharsArray
        let currentChar = emoji.unicode[Math.floor(Math.random() * (emoji.unicode.length - 1))];
        verifyingString = verifyingString.concat(currentChar);
    }
    return verifyingString;
}
module.exports = {
    getShortcode,
}
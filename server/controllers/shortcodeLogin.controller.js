const ShortcodeSessionModel = require("../models/shortcodeSession.model");
const emoji = require("emoji-dictionary");
const parser = require("ua-parser-js");

const maxRetriesOnError = 10;
const verifyingEmojiStringLength = 3;
const maxTimeUntilTimeoutMS = 600000; // 10 minutes

/*
// @desc    generate shortcode. This shortcode can be used to login from another device. Also, this endpoints returns a verifying string and stores userAgent information to the database which can be helpful for users to verify whether they are actually authorizing the right device
// @route   GET /api/shortcodeLogin/getShortcode
// @access  Public
 */
const getShortcode = async (req, res) => {
    req.session.regenerate(async function (sessionRegenerationError) {
        if(sessionRegenerationError) {
            return res.status(500).send("Fewhler beim Erstellen einer neuen Sitzung.");
        }

        const userAgentInfo = parser(req.headers["user-agent"]);
        let verifyingString = emojiStringGenerator();
        let newlyCreatedShortcodeSession = await createNewShortcodeSession(req.session.id, verifyingString, userAgentInfo);

        // if we have a collision of 2 shortcode sessions in the database: try it again as often as specified in @maxRetriesOnError
        if (!newlyCreatedShortcodeSession.success) {
            for (let iterator = 0; (!newlyCreatedShortcodeSession.success) && (iterator < maxRetriesOnError); iterator) {
                newlyCreatedShortcodeSession = await createNewShortcodeSession(req.session.id, verifyingString, userAgentInfo);
            }
        }
        // if after this procedure there are still collisions (or other database errors): cancel the procedure and request the user to try again later
        if (!newlyCreatedShortcodeSession.success) {
            return res.status(500).send("Aktuell sind keine temporären Sitzungen mehr frei. Bitte probieren Sie es später erneut.");
        }

        return res.status(201).send({
            shortcode: newlyCreatedShortcodeSession.content._id,
            verifyingString: newlyCreatedShortcodeSession.content.verifyingString
        });
    });
}

/*
// @desc    An User client will be notified via this endpoint if their loginSession has been authorized via the shortcode generated before
// @route   GET /api/shortcodeLogin/getShortcodeAuthorizationNotification
// @access  Public
 */
const getShortcodeAuthorizationNotification = async (req, res) => {
    if(!req.session.id) {
        return res.status(400).send("Ihrem Browser ist bisher noch keine Sitzung zugeordnet worden. Bitte wiederholen Sie den Shortcode-Login-Prozess von vorn, um eine Sitzung zu eröffnen.");
    }

    // check whether the shortcode actually exists in the database and return HTTP404 status if not
    const shortcodeSessionResponse = await ShortcodeSessionModel.findOne({
        sessionId: req.session.id
    }).then((databaseResponse) => {
        return {success: 1, content: databaseResponse};
    }).catch((error) => {
        return {success: 0, content: error};
    });
    if(!shortcodeSessionResponse.success) {
        return res.status(500).send("Interner Server Fehler: Der Abruf der Shortcode-Sitzung aus der Datenbank ist fehlgeschlagen.");
    }
    if(shortcodeSessionResponse.success && shortcodeSessionResponse.content === null) {
        return res.status(404).send("Offenbar haben Sie bisher entweder keine Shortcode-Sitzung eröffnet oder diese ist bereits abgelaufen. Bitte wiederholen Sie den Shortcode-Login-Prozess von vorn.");
    }

    // create watcher in shortcodeSessions collection, always watch for changes of the isAuthorized value of the document that corresponds to the current user; also generate a response on document deletion
    const shortcodeWatchPipeline = [
        {
            $match: {
                $or: [
                    {
                        "fullDocument.sessionId": req.session.id,
                        "fullDocument._id": shortcodeSessionResponse.content._id,
                        "updateDescription.updatedFields.isAuthorized": true
                    }, {
                        "documentKey._id": shortcodeSessionResponse.content._id,
                        "operationType": "delete"
                    }
                ]
            }
        }
    ];
    const watchResult = await ShortcodeSessionModel.watch(shortcodeWatchPipeline, {fullDocument: 'updateLookup'});

    // after at most @maxTimeUntilTimeout Minutes the shortcode notification session times out - if there was no answer before that, the user will get a timeout message
    const watchTimeout = setTimeout(async () => {
        await watchResult.close();
        return res.status(408).send("Timeout: Sie haben die maximale Zeit für den Login via Shortcode überschritten. Bitte beginnen Sie den Shortcode-Login-Prozess erneut, wenn Sie sich weiterhin via Shortcode einloggen möchten.");
    }, maxTimeUntilTimeoutMS);

    // once the event specified in the pipeline above occurs, handle the change response emitted by it
    watchResult.once("change", (change) => {
        clearTimeout(watchTimeout);
        if(change.operationType === "delete") {
            return res.status(410).send("Die Shortcode-Login-Sitzung wurde inzwischen beendet. Wahrscheinlich haben Sie die maximale Zeit für den Login via Shortcode überschritten.");
        } else {
            return res.status(200).send("Erfolgreich autorisiert.");
        }
    });
}

// Private helper functions
async function createNewShortcodeSession(sessionId, verifyingString, userAgentInfo) {
    return await ShortcodeSessionModel.create({
        sessionId: sessionId,
        verifyingString: verifyingString,
        userAgentInfo: userAgentInfo,
        isAuthorized: false,
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
    getShortcodeAuthorizationNotification
}
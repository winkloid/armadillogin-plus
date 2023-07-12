const ShortcodeSessionModel = require("../models/shortcodeSession.model");
const LoginSessionModel = require("../models/loginSession.model");
const emoji = require("emoji-dictionary");
const parser = require("ua-parser-js");
const mongoose = require("mongoose");

const maxRetriesOnError = 10;
const verifyingEmojiStringLength = 3;
const maxTimeUntilTimeoutMS = 600000; // 10 minutes
const numberOfVerifyingChallenges = 4;

/*
// @desc    generate shortcode. This shortcode can be used to login from another device. Also, this endpoints returns a verifying string and stores userAgent information to the database which can be helpful for users to verify whether they are actually authorizing the right device
// @route   POST /api/shortcodeLogin/setShortcode
// @access  Public
 */
const setShortcode = async (req, res) => {
     return req.session.regenerate(async function (sessionRegenerationError) {
        if(sessionRegenerationError) {
            return res.status(500).send("Fehler beim Erstellen einer neuen Sitzung.");
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

        // measure time on start of the shortcode authorization process
        req.session.time_startShortcode = new Date().getTime();

        return res.status(201).send({
            shortcode: newlyCreatedShortcodeSession.content._id,
            verifyingString: newlyCreatedShortcodeSession.content.verifyingString,
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
        return res.status(400).set('Cache-Control', 'no-store').send("Ihrem Browser ist bisher noch keine Sitzung zugeordnet worden. Bitte wiederholen Sie den Shortcode-Login-Prozess von vorn, um eine Sitzung zu eröffnen.");
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
        return res.status(500).set('Cache-Control', 'no-store').send("Interner Server Fehler: Der Abruf der Shortcode-Sitzung aus der Datenbank ist fehlgeschlagen.");
    }
    if(shortcodeSessionResponse.success && shortcodeSessionResponse.content === null) {
        return res.status(404).set('Cache-Control', 'no-store').send("Offenbar haben Sie bisher entweder keine Shortcode-Sitzung eröffnet oder diese ist bereits abgelaufen. Bitte wiederholen Sie den Shortcode-Login-Prozess von vorn.");
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
        return res.status(408).set('Cache-Control', 'no-store').send("Timeout: Sie haben die maximale Zeit für den Login via Shortcode überschritten. Bitte beginnen Sie den Shortcode-Login-Prozess erneut, wenn Sie sich weiterhin via Shortcode einloggen möchten.");
    }, maxTimeUntilTimeoutMS);

    // once the event specified in the pipeline above occurs, handle the change response emitted by it
    watchResult.once("change", (change) => {
        clearTimeout(watchTimeout);
        if(change.operationType === "delete") {
            return res.status(410).set('Cache-Control', 'no-store').send("Die Shortcode-Login-Sitzung wurde inzwischen beendet. Wahrscheinlich haben Sie die maximale Zeit für den Login via Shortcode überschritten.");
        } else {
            return res.status(200).set('Cache-Control', 'no-store').send("Erfolgreich autorisiert.");
        }
    });
}

/*
// @desc    Retrieve the details of a shortcode session, including information about the browser to be authorized, sessionId of the loginSession currently active via this browser and a challenge containing multiple emoji string where only one is the verifying string of the shortcode Session
// @route   GET /api/shortcodeLogin/getShortcodeSessionInfo
// @access  Public
 */
const getShortcodeSessionInfo = async (req, res) => {
    if(!req.body.shortcode) {
        return res.status(400).send("Fehlerhafte Anfrage: Bitte geben Sie einen Shortcode an.");
    }

    // check whether the shortcode actually exists in the database and return HTTP404 status if not
    const shortcodeSessionResponse = await ShortcodeSessionModel.findOne({
        _id: req.body.shortcode
    }).then((databaseResponse) => {
        return {success: 1, content: databaseResponse};
    }).catch((error) => {
        return {success: 0, content: error};
    });

    if(!shortcodeSessionResponse.success) {
        return res.status(500).send("Interner Server-Fehler beim Abrufen der Shortcode-Sitzungsinformationen aus der Datenbank");
    }
    if(shortcodeSessionResponse.success && shortcodeSessionResponse.content === null) {
        return res.status(404).send("Eine Shortcode-Sitzung mit dem angegebenen Shortcode als Identifier wurde nicht gefunden. Bitte stellen Sie sicher, dass Sie den richtigen Shortcode angegebenen haben und dass die dazugehöroge Sitzung noch nicht abgelaufen ist. Jede Sitzung ist nur maximal zehn Minuten aktiv. Beginnen Sie die Shortcode-Login-Prozedur ansonsten von vorn.");
    }

    // create array of @numberOfVerifyingChallenges challenges and insert the correct challenge at a random index
    let challengeArray = [];
    const indexOfCorrectString = Math.round(Math.random() * (numberOfVerifyingChallenges - 1));
    for(let i = 0; i < numberOfVerifyingChallenges; i++) {
        if(i === indexOfCorrectString) {
            challengeArray[i] = shortcodeSessionResponse.content.verifyingString;
        } else {
            challengeArray[i] = emojiStringGenerator();
        }
    }

    return res.status(200).send({
        verifyingChallenges: challengeArray,
        clientInfo: shortcodeSessionResponse.content.userAgentInfo,
    });
}

/*
// @desc    Send the verifying string challenge response back to this endpoint; this endpoint checks whether the response actually equals the verifying string set before and if so, copies the session information of the authenticated loginSession to the loginSession of the browser that needs to be authorized and notifies this browser by setting the isAuthorized value inside the corresponding shortcodeSession document to true
// @route   POST /api/shortcodeLogin/setShortcodeSessionAuthorized
// @access  Public
 */
const setShortcodeSessionAuthorized = async (req, res) => {
    if(!req.body.verifyingChallengeResponse || !req.body.shortcode) {
        return res.status(400).send("Fehlerhafte Anfrage: Bitte geben Sie die korrekte Zeichenkette zum verifizieren der Geräte-Autorisierung an.");
    }

    const mongooseSession = await mongoose.startSession();
    mongooseSession.startTransaction();
    try {
        const shortcodeSessionResponse = await ShortcodeSessionModel.findOne({
            _id: req.body.shortcode
        }).session(mongooseSession);
        if(!shortcodeSessionResponse) {
            await mongooseSession.abortTransaction();
            await mongooseSession.endSession();
            return res.status(404).send("Eine Sitzung mit dem angegebenen Shortcode wurde nicht gefunden.");
        }
        if((shortcodeSessionResponse.verifyingString) && shortcodeSessionResponse.verifyingString !== req.body.verifyingChallengeResponse) {
            await mongooseSession.abortTransaction();
            await mongooseSession.endSession();
            return res.status(403).send("Das andere Gerät wurde nicht autorisiert, da die von Ihnen angegebene Antwort auf die Verifizierungs-Frage nicht korrekt war.");
        }

        await LoginSessionModel.updateOne({
            _id: shortcodeSessionResponse.sessionId
        }, {
            $set: {
                "session.isAuthenticated": true,
                "session.userName": req.session.userName,
                "session.userId": req.session.userId,
                "session.time_endShortcode": new Date().getTime()
            }
        }).session(mongooseSession);

        await ShortcodeSessionModel.updateOne({
            _id: req.body.shortcode
        }, {
            $set: {
                isAuthorized: true
            }
        }).session(mongooseSession);
        await mongooseSession.commitTransaction();
        await mongooseSession.endSession();
        return res.status(200).send("Die Sitzung auf dem anderen Gerät wurde erfolgreich autorisiert.");
    } catch(error) {
        await mongooseSession.abortTransaction();
        await mongooseSession.endSession();
        console.log(error);
        return res.status(500).send("Es ist ein interner Serverfehler beim Autorisierung der Sitzung auf dem anderen Gerät aufgetreten.");
    }
}

// Private helper functions
async function createNewShortcodeSession(sessionId, verifyingString, userAgentInfo) {
    return await ShortcodeSessionModel.create({
        sessionId: sessionId,
        verifyingString: verifyingString,
        userAgentInfo: userAgentInfo,
        isAuthorized: false,
        createdAt: Date.now()
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
    setShortcode,
    getShortcodeAuthorizationNotification,
    getShortcodeSessionInfo,
    setShortcodeSessionAuthorized
}
const UserModel = require("../models/user.model");

const timeStampTypes = Object.freeze({
    registration: "registration",
    authentication: "authentication",
    shortcodeAuthentication: "shortcodeAuthentication"
});

/*
 @desc Saves timestamps for different defined events in using the application. The timestamps are measured on client-side, e.g. when user initiates the FIDO2 registration dialogue. These timestamps are then saved into the user's session. This method gets called automatically when users access their private area. It reads out the time values from the user's session and writes them to the users collection of the database. This method only writes timestamps that are not null.
 @route PUT /api/timeStamps/updateAll
 @access Private
 */
const setUserTimeStamps = async (req, res) => {
    return UserModel.updateOne({
        _id: req.session.userId,
        userName: req.session.userName,
        isRegistered: true
    }, {
        $set: {
            time_startFido2RegistrationWithUserName: ((req.session.time_startFido2RegistrationWithUserName) ? req.session.time_startFido2RegistrationWithUserName : undefined),
            time_startFido2Registration: ((req.session.time_startFido2Registration) ? req.session.time_startFido2Registration : undefined),
            time_endFido2Registration: ((req.session.time_endFido2Registration) ? req.session.time_endFido2Registration : undefined),
            time_startFido2AuthenticationWithUserName: ((req.session.time_startFido2AuthenticationWithUserName) ? req.session.time_startFido2AuthenticationWithUserName : undefined),
            time_startFido2Authentication: ((req.session.time_startFido2Authentication) ? req.session.time_startFido2Authentication : undefined),
            time_endFido2Authentication: ((req.session.time_endFido2Authentication) ? req.session.time_endFido2Authentication : undefined),
            time_startShortcode: ((req.session.time_startShortcode) ? req.session.time_startShortcode : undefined),
            time_endShortcode: ((req.session.time_endShortcode) ? req.session.time_endShortcode : undefined),
            time_startShortcodeFido2Authentication: ((req.session.time_startShortcodeFido2Authentication) ? req.session.time_startShortcodeFido2Authentication : undefined),
            time_endShortcodeFido2Authentication: ((req.session.time_endShortcodeFido2Authentication) ? req.session.time_endShortcodeFido2Authentication : undefined),
            time_startEIdRegistration: ((req.session.time_startEIdRegistration) ? req.session.time_startEIdRegistration : undefined),
            time_endEIdRegistration: ((req.session.time_endEIdRegistration) ? req.session.time_endEIdRegistration : undefined),
            time_startEIdAuthentication: ((req.session.time_startEIdAuthentication) ? req.session.time_startEIdAuthentication : undefined),
            time_endEIdAuthentication: ((req.session.time_endEIdAuthentication) ? req.session.time_endEIdAuthentication : undefined),
        }
    }, {ignoreUndefined: true}).then(databaseResponse => {
        return res.status(200).send("Zeitstempel für den Benutzer wurden erfolgreich aktualisiert.");
    }).catch(error => {
        console.log(error);
        return res.status(500).send("Interner Serverfehler: Die Zeitstempel konnten für den angegebenen Benutzer nicht aktualisiert werden.");
    })
}

/*
 @desc Sets timestamps in the user's session. When a user gets logged in and enters their private area the {@link setUserTimeStamps} method can be called via the /api/timeStamps/updateAll endpoint to read out all the timestamps from the user session and store them inside the database.
 @route PUT /api/timeStamps/setFido2TimeStamps
 @access Private
 */
const setFido2TimeStamps = async (req, res) => {
    const timeStampType = req.body?.timeStampType;
    const timeStampStartWithUserName = req.body?.timeStampStartWithUserName;
    const timeStampStart = req.body?.timeStampStart;
    const timeStampEnd = req.body?.timeStampEnd;
    if(!timeStampType || !timeStampStartWithUserName || !timeStampStart || !timeStampEnd) {
        return res.status(400).send("In der Anfrage fehlte der Typ, die Start- oder die Endzeit der hinzuzufügenden Zeitmessung.");
    }
    try {
        if(timeStampType === timeStampTypes.registration) {
            req.session.time_startFido2RegistrationWithUserName = timeStampStartWithUserName;
            req.session.time_startFido2Registration = timeStampStart;
            req.session.time_endFido2Registration = timeStampEnd;
        } else if(timeStampType === timeStampTypes.authentication) {
            req.session.time_startFido2AuthenticationWithUserName = timeStampStartWithUserName;
            req.session.time_startFido2Authentication = timeStampStart;
            req.session.time_endFido2Authentication = timeStampEnd;
        } else if (timeStampType === timeStampTypes.shortcodeAuthentication) {
            req.session.time_startShortcodeFido2Authentication = timeStampStart;
            req.session.time_endShortcodeFido2Authentication = timeStampEnd;
        } else {
            return res.status(400).send("Es wurde kein gültiger Typ der Zeitmessung in der Anfrage angegeben.");
        }
        return res.status(201).send("Die Zeitmessung wurde erfolgreich mit der aktuellen Sitzung verknüpft.");
    } catch(error) {
        return res.status(500).send("Interner Serverfehler beim Eintragen der Zeitmessung in die Benutzersitzung.");
    }
}

module.exports = {
    setUserTimeStamps,
    setFido2TimeStamps
}
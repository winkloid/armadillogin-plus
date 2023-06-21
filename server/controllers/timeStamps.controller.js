const UserModel = require("../models/user.model");

const timeStampTypes = Object.freeze({
    registration: "registration",
    authentication: "authentication",
    shortcodeAuthentication: "shortcodeAuthentication"
});

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
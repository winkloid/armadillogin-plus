const MongoWatchTest = require("../models/mongowatchtest.model");

const testMongoWatch = async (req, res) => {
    console.log("Aufgerufen.")

    const watchPipeline = [
        {
            $match: {
                $or: [
                    {"fullDocument.sessionId": 123456789, "updateDescription.updatedFields.userName": "active"},
                    {"fullDocument.sessionId": 123456789, "operationType": "insert"}
                ]
            }
        }
    ]
    MongoWatchTest.watch(watchPipeline, { fullDocument: 'updateLookup' }).once("change", change => {
        console.log(JSON.stringify(change));
        return res.status(200).send(change);
    });
}

const writeMongoData = async (req, res) => {
    let newMongoData = new MongoWatchTest({
        sessionId: req.body.sessionId,
        userName: req.body.userName,
    });
    newMongoData.save()
        .then(res.status(201).send("Funktionierte."))
        .catch(error => {
            return res.status(201).send("Person was created.");
        });
}

module.exports = {
    testMongoWatch,
    writeMongoData
}
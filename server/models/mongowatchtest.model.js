const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MongoWatchTestSchema = new Schema({
    sessionId: {type: Number},
    userName: {type: String},
});

module.exports = mongoose.model("MongoWatchTest", MongoWatchTestSchema, "mongowatchtest");
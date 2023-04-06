const express = require("express");
const router = express.Router();
const {
    testMongoWatch,
    writeMongoData,
} = require("../controllers/webauthn.controller");

router.get("/testMongoChangeStream", testMongoWatch);
router.post("/writeData", writeMongoData);

module.exports = router;
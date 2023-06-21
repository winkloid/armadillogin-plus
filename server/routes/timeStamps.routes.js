const express = require("express");
const router = express.Router();
const {isAuthenticatedMiddleware} = require("../middleware/isAuthenticatedMiddleware");
const {setUserTimeStamps, setFido2TimeStamps} = require("../controllers/timeStamps.controller");

router.put("/updateAll", isAuthenticatedMiddleware, setUserTimeStamps);
router.put("/setFido2TimeStamps", setFido2TimeStamps);

module.exports = router;
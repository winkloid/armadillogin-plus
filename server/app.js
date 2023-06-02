require('dotenv').config();
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const webauthn = require("./routes/webauthn.routes");
const account = require("./routes/account.routes");
const shortcodeLogin = require("./routes/shortcodeLogin.routes");
const eidSaml = require("./routes/eid-saml.routes");

const app = express();
const httpPort = 5000;
const httpsPort = 5001;
let corsOptions = {
    credentials: true,
    origin: ['http://' + process.env.rpId + ":" + process.env.clientPort, "http://192.168.100.25:5173", "https://armadillogin.winkloid.de:5173"]
}

mongoose.connect(process.env.MONGODB_BASE_STRING, {useNewUrlParser:true,useUnifiedTopology:true,directConnection: true})
    .then((connectionResult) => {
        console.log("MongoDB connected ... here:" + process.env.MONGODB_BASE_STRING);
    })
    .catch(error => {
        console.log(error);
});

app.use(cors(corsOptions));
// handle application/json
app.use(express.json());
//handle application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));

app.use(session({
    name: "armadillogin_login",
    secret: process.env.SESSION_SECRET_LOGINSESSION,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.ISPRODUCTION === "yes", // describes whether cookies are only sent via https or not, Only works if https is used
        maxAge: 3600000, // 1 hour
        sameSite: true,
        httpOnly: true,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_BASE_STRING,
        mongoOptions: {useNewUrlParser:true,useUnifiedTopology:true,directConnection: true},
        stringify: false,
        ttl: 60 * 60, // 1 hour
        collectionName: "loginSessions",
    })
}));

app.use(passport.initialize());

app.use("/api/webauthn", webauthn);
app.use("/api/account", account);
app.use("/api/shortcodeLogin", shortcodeLogin);
app.use("/api/eid-saml", eidSaml);

const sslCredentials = {
    key: fs.readFileSync("./armadillogin.winkloid.de.key"),
    cert: fs.readFileSync("./armadillogin.winkloid.de.crt")
}
const httpServer = http.createServer(app);
const httpsServer = https.createServer(sslCredentials, app);

httpServer.listen(httpPort, () => {
    console.log("Express-HTTP-Server gestartet: localhost:" + httpPort);
});

httpsServer.listen(httpsPort, () => {
    console.log("Express-HTTPS-Server gestartet: localhost:" + httpsPort);
});
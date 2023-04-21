require('dotenv').config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cors = require("cors");
const webauthn = require("./routes/webauthn.routes");

const app = express();
const port = 5000;
let corsOptions = {
    credentials: true,
    origin: 'http://' + process.env.rpId + ":" + process.env.clientPort
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
        ttl: 60 * 60, // 1 hour
        collectionName: "loginSessions",
        stringify: true
    })
}));

app.use("/api/webauthn", webauthn);

app.listen(port, () => {
    console.log("Express-Server gestartet: localhost:" + port);
});
require('dotenv').config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const cors = require("cors");
const webauthn = require("./routes/webauthn.routes");

const app = express();
const port = 5000;
var corsOptions = {
    credentials: true,
    origin: 'http://localhost:5173'
}

mongoose.connect("mongodb://127.0.0.1:27017/armadillogin_plus?replicaSet=rs0", {useNewUrlParser:true,useUnifiedTopology:true,directConnection: true})
    .then((connectionResult) => {
        console.log("MongoDB connected ... here:" + "mongodb://127.0.0.1:27017/armadillogin_plus?replicaSet=rs0");
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
        mongoUrl: "mongodb://127.0.0.1:27017/armadillogin_plus?replicaSet=rs0",
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
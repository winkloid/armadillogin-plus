require('dotenv').config();
const express = require("express");
const loginSession = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const webauthn = require("./routes/webauthn.routes");

const app = express();
const port = 5000;

mongoose.connect("mongodb://127.0.0.1:27017/armadillogin_plus?replicaSet=rs0", {useNewUrlParser:true,useUnifiedTopology:true,directConnection: true})
    .then(console.log("MongoDB connected ... here:" + "mongodb://127.0.0.1:27017/armadillogin_plus?replicaSet=rs0"))
    .catch(error => {
        console.log(error);
});

app.use(cors());
// handle application/json
app.use(express.json());
//handle application/x-www-form-urlencoded
app.use(express.urlencoded({extended:true}));

app.use(loginSession({
    name: "armadillogin_login",
    secret: process.env.SESSION_SECRET_LOGINSESSION,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.ISPRODUCTION === "yes", // describes whether cookies are only sent via https or not, Only works if https is used
        maxAge: 1440000  // 1 day
    },
}));

app.use("/api/webauthn", webauthn);

app.listen(port, () => {
    console.log("Express-Server gestartet: localhost:" + port);
});
require('dotenv').config();
const express = require("express");
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

app.use("/api/webauthn", webauthn);

app.listen(port, () => {
    console.log("Express-Server gestartet: localhost:" + port);
});
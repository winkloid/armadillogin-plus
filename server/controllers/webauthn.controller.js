const UserModel = require("../models/user.model");

const isUserInDatabase = (req, res) => {
    UserModel.exists({
        userName: req.body.userName
    }).then((databaseResponse) => {
        if(databaseResponse) {
            return res.status(200).send("User exists.");
        } else {
            return res.status(404).send("User does not exist.");
        }
    }).catch((error) => {
        return res.status(500).send("Server error:\n" + error);
    });
}

// only for debugging
const writeUserToDb = (req, res) => {
    const newUser = new UserModel({
        userName: req.body.userName,
    }).save().then((databaseResponse) => {
        return res.status(200).send("User saved.\n" + databaseResponse);
    }).catch((error) => {
        return res.status(500).send("Server error:\n" + error);
    });
} 

module.exports = {
    isUserInDatabase,
    writeUserToDb
}
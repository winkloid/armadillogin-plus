const fs = require("fs");
const saml = require("passport-saml");
const {samlStrategy} = require("../middleware/passportSamlMiddleware");


const getMetadata = (req, res) => {
    return res.type("application/xml")
        .status(200)
        .send(
            samlStrategy.generateServiceProviderMetadata(
                fs.readFileSync("./armadillogin.winkloid.de.crt", "utf8"),
                fs.readFileSync("./armadillogin.winkloid.de.crt", "utf8")
            )
        );
}

const getMainpage = (req, res) => {
    if(req.isAuthenticated) {
        return res.status(200).send("Authentifiziert unter dem Pseudonym " + req.session?.passport?.user["http://www.skidentity.de/att/eIdentifier"]);
    } else {
        return res.status(403).send("Nicht authentifiziert");
    }
}

module.exports = {
    getMetadata,
    getMainpage
}
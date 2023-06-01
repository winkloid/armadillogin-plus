const fs = require("fs");

module.exports = {
    passport: {
        strategy: 'samlStrategy',
        saml: {
            callbackUrl: process.env.BACKEND_BASE_URL + "/api/eid-saml/callback",
            entryPoint: "https://service.skidentity.de/fs/saml/remoteauth/",
            issuer: "ArmadilLogin-PLUS-Webapp",
            cert: process.env.SAML_IDP_CERT,
            privateKey: fs.readFileSync("./armadillogin.winkloid.de.key", "utf8"),
        }
    }
}
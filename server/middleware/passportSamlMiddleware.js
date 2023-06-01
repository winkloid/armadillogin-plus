const saml = require("passport-saml");
const config = require("../config/config");
const samlStrategy = new saml.Strategy(
    config.passport.saml,
    function (profile, done) {
        return done(null, profile);
    }
);

module.exports = {
    samlStrategy
}
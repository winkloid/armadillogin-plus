const fs = require("fs");
const saml2 = require("saml2-js");

const samlSpOptions = {
    assert_endpoint: process.env.BACKEND_BASE_URL + "/api/eid-saml/callback",
    entity_id: "ArmadilLogin-PLUS-Webapp",
    certificate: fs.readFileSync("./armadillogin.winkloid.de.crt", "utf8"),
    private_key: fs.readFileSync("./armadillogin.winkloid.de.key", "utf8"),
}
const samlIdpOptions = {
    sso_login_url: "https://service.skidentity.de/fs/saml/remoteauth/",
    sso_logout_url: "https://service.skidentity.de/fs/saml/remoteauth/",
    certificates: process.env.SAML_IDP_CERT,
    force_authn: true,
    sign_get_request: false,
    allow_unencrypted_assertion: true,
}

let armadilLoginSp = new saml2.ServiceProvider(samlSpOptions);
let eIdIdp = new saml2.IdentityProvider(samlIdpOptions);

const getMetadata = (req, res) => {
    return res
        .type("application/xml")
        .status(200)
        .send(
            armadilLoginSp.create_metadata()
        );
}

const samlLogin = (req, res) => {
    console.log(req.session);
    armadilLoginSp.create_login_request_url(eIdIdp, {}, (err, login_url, request_id) => {
        if(err != null) {
            return res.status(500).send("Interner Server Fehler bei der Weiterleitung zum Ausweis-Login-Dienst");
        }
        res.redirect(login_url);
    })
}

const samlCallback = (req, res) => {
    console.log(req.session);
    let options = {
        request_body: req.body,
        require_session_index: false
    };
    return res.status(200).send(
        "<html><body><form style=\"display: none\" action=\"/api/eid-saml/assert\" method=\"POST\" id=\"samlForm\">" +
        "<input type=\"hidden\" id=\"samlOptions\" name=\"samlOptions\" value='" + escape(JSON.stringify(options)) + "'/>" +
        "</form>" +
        "<script>document.getElementById(\"samlForm\").submit();</script>" +
        "</body></html>"
    );
}

const assertSaml = (req, res) => {
    console.log(req.session);
    console.log(req.body);
    let samlOptions = null;
    if (req.body) {
        console.log(JSON.parse(unescape(req.body?.samlOptions)));
        samlOptions = JSON.parse(unescape(req.body?.samlOptions))
    } else {
        return res.status(400).send("Fehler: Keine Antwort vom Ausweis-Login-Dienst erkannt");
    }
    armadilLoginSp.post_assert(eIdIdp, samlOptions, (err, saml_response) => {
            if (err != null) {
                return res.status(500).send("Interner Server Fehler beim Überprüfen der Antwort desAusweis-Anmelde-Dienstes: " + err);
            } else {
                req.session.eIdentifier = saml_response.user.name_id;
                req.session.eIdentifierIssuer = saml_response.user.attributes["http://www.skidentity.de/att/IDIssuer"];
                return res.status(200).send("Assertion ausgelöst");
            }
        }
    );
}

const getMainpage = (req, res) => {
    if(req.isAuthenticated()) {
        return res.status(200).send("Authentifiziert unter dem Pseudonym " + req.user.eIdentifier);
    } else {
        return res.status(403).send("Nicht authentifiziert");
    }
}

module.exports = {
    getMetadata,
    samlLogin,
    samlCallback,
    assertSaml,
    getMainpage
}
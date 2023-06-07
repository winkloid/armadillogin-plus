const fs = require("fs");
const saml2 = require("saml2-js");
const UserModel = require("../models/user.model");

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
    armadilLoginSp.create_login_request_url(eIdIdp, {}, (err, login_url, request_id) => {
        if(err != null) {
            return res.status(500).send("Interner Server Fehler bei der Weiterleitung zum Ausweis-Login-Dienst");
        }
        res.redirect(login_url);
    })
}

const samlCallback = (req, res) => {
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
    let samlOptions = null;
    if (req.body) {
        samlOptions = JSON.parse(unescape(req.body?.samlOptions))
    } else {
        return res.status(400).send("Fehler: Keine Antwort vom Ausweis-Login-Dienst erkannt");
    }
    armadilLoginSp.post_assert(eIdIdp, samlOptions, (err, saml_response) => {
            if (err != null) {
                return res.status(500).send("Interner Server Fehler beim Überprüfen der Antwort desAusweis-Anmelde-Dienstes: " + err);
            } else {
                if(req.session.isAuthenticated && req.session.userId && req.session.userName) {
                    req.session.eIdentifier = saml_response.user.name_id;
                    req.session.eIdentifierIssuer = saml_response.user.attributes["http://www.skidentity.de/att/IDIssuer"];
                    return res.status(200).redirect(process.env.FRONTEND_BASE_URL + "/eId/registration");
                }
            }
        }
    );
}

const linkEIdToAccount = async (req, res) => {
    if(!req.session.eIdentifier) {
        return res.status(400).send("Mit Ihrer aktuellen Sitzung ist noch kein Ausweis verknüpft. Bitte stellen Sie sicher, dass Sie zunächst den Ausweis-Login-Prozess abschließen, bevor Sie fortfahren.");
    }

    let linkEIdResponse = await UserModel.updateOne({
        _id: req.session.userId,
        userName: req.session.userName,
        isRegistered: true,
    }, {
        $set: {
            eIdentifier: req.session.eIdentifier
        }
    }).then((response) => {
        return {success: 1, content: response};
    }).catch((error) => {
        return {success: 0, content: error};
    });

    if (linkEIdResponse.success) {
        if(linkEIdResponse.content.modifiedCount) {
            return res.status(200).send("Hinzufügen des Ausweises zu Ihrem Benutzerkonto war erfolgreich.");
        } else {
            return res.status(404).send("Das in der Anfrage angegebene Benutzerkonto konnte nicht gefunden oder der verwendete Ausweis ist bereits mit dem Konto verknüpft. Der Ausweis konnte dem Konto demnach nicht neu hinzugefügt werden.");
        }
    } else {
        return res.status(500).send("Interner Server Fehler beim Verknüpfen des Ausweises mit Ihrem Benutzerkonto in der Benutzerdatenbank");
    }
}

module.exports = {
    getMetadata,
    samlLogin,
    samlCallback,
    assertSaml,
    linkEIdToAccount
}
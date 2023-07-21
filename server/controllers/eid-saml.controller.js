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


/*
@desc Returns XML description of the ArmadilLogin-PLUS service provider.
@route GET /api/eid-saml/metadata
@access Public
 */
const getMetadata = (req, res) => {
    return res
        .type("application/xml")
        .status(200)
        .send(
            armadilLoginSp.create_metadata()
        );
}

/*
@desc Creates a valid SAML2-Login-URL for the specified Identity-Provider SkIDentity. ArmadilLogin-PLUS uses SkIDentity as SAML-IdP in order to be able to demonstrate the eID login procedure. Depending on whether this method is called to start the registration or the login process this method also stores an appropriate value in the user session so that {@link assertSaml} can redirect the user to the right frontend URL after the authentication procedure with SkIDentity has been completed.
@route GET /api/eid-saml/initiateSaml/:loginOrRegistration
@access Public
 */
const samlLogin = (req, res) => {
    armadilLoginSp.create_login_request_url(eIdIdp, {}, (err, login_url, request_id) => {
        if(err != null) {
            return res.status(500).send("Interner Server Fehler bei der Weiterleitung zum Ausweis-Login-Dienst");
        }
        if(req.params.loginOrRegistration === "registration") {
            if(!req.session.time_startEIdRegistration) {
                req.session.time_startEIdRegistration = new Date().getTime();
            }
        } else {
            if(!req.session.time_startEIdAuthentication) {
                req.session.time_startEIdAuthentication = new Date().getTime();
            }
        }
        res.redirect(login_url);
    })
}

/*
@desc Callback URL of the SAML2 authentication procedure. Since this method is called after a server-side redirect this method is not able to access the current user session. For this reason the method sends HTML code containing an auto-submitting form to the user agent so that the user agent gets automatically redirected to "/api/eid-saml/assert" which initiates the {@link assertSaml} method.
@route POST /api/eid-saml/callback
@access Public
 */
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

/*
@desc Reads the SAML response that was redirected by {@link samlCallback}. In the SAML response an eIdentifier is included which is an unique alias that can be used by ArmadilLogin-PLUS to later recognize the user again. Depending on whether the user wanted to link the used eID passport to their account or whether the user wanted to authenticate using an already registered eID passport, they gets redirected to the next registration or authentication step inside the frontend.
@route POST /api/eid-saml/assert
@access Public
 */
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
                req.session.eIdentifier = saml_response.user.name_id;
                req.session.eIdentifierIssuer = saml_response.user.attributes["http://www.skidentity.de/att/IDIssuer"];
                if(req.session?.isAuthenticated && req.session?.userId && req.session?.userName) {
                    if(!req.session.time_endEIdRegistration) {
                        req.session.time_endEIdRegistration = new Date().getTime();
                    }
                    return res.redirect(process.env.FRONTEND_BASE_URL + "/eId/registration");
                } else {
                    if(!req.session.time_endEIdAuthentication) {
                        req.session.time_endEIdAuthentication = new Date().getTime();
                    }
                    return res.redirect(process.env.FRONTEND_BASE_URL + "/eId/login/completion");
                }
            }
        }
    );
}

/*
@desc Completes the eID passport registration with an already logged-in user account. In {@link assertSaml} the eIdentifier from the SAML response has already been written to the current user session. After confirmation by the user, this method writes the eIdentifier to the user profile inside the database and thus completes the registration process.
@route PUT /api/eid-saml/linkEIdToAccount
@access Private
 */
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

/*
@desc When a user wants to start the authentication process using their eID passport, they first have to provide their username. This method will check whether an user with the specified username actually exists (using {@link fetchEIdUserInformation}) and if so, set username in user session and if not reply with an error message.
@route POST /api/eid-saml/loginUserNameInput
@access Public
 */
const loginUserNameInput = async (req, res) => {
    if(!req.body.userName) {
        return req.status(400).send("Sie haben keinen Benutzernamen angegeben. Bitte geben Sie einen Benutzernamen an.");
    }

    const fetchedEIdUserInformation = await fetchEIdUserInformation(req.body.userName);
    // handle errors in fetched user information
    if(fetchedEIdUserInformation.success === 0) {
        return res.status(500).send("Interner Server Fehler - Abruf von Benutzerinformationen aus der Datenbank nicht möglich. \nFehlerbeschreibung:\n"+ fetchedEIdUserInformation.content);
    }
    if(!fetchedEIdUserInformation.content || !fetchedEIdUserInformation.content?.eIdentifier) {
        return res.status(404).send("Ein Benutzerkonto mit dem angegebenen Benutzernamen und einem mit dem Konto verknüpften Ausweis konnte nicht gefunden werden. Bitte überprüfen Sie den angegebenen Benutzernamen.");
    }

    // if no errors occur: Add userName to session; reset session to unauthenticated when changing username
    req.session.isAuthenticated = false;
    req.session.userName = req.body.userName;
    return res.status(201).send("Eine Sitzung mit dem angegebenen Benutzernamen wurde erzeugt.");
}

/*
@desc Looks up whether there is an user in the database that has the specified username and the eIdentifier linked with it that was read out from the SAML response in {@link samlCallback}. If so, the user gets logged in by setting the session's "isAuthenticated" value to "true" and if not, an error message is returned.
@route POST /api/eid-saml/loginCompletion
@access Public
 */
const loginCompletion = async (req, res) => {
    if(req.session?.userName && req.session?.eIdentifier) {
        let findEIdUserQuery = await UserModel.findOne({
            isRegistered: true,
            userName: req.session.userName,
            eIdentifier: req.session.eIdentifier
        }).then((response) => {
            return {success: 1, content: response};
        }).catch((error) => {
            return {success: 0, content: error};
        });
        // if query was not successful
        if(findEIdUserQuery.success === 0) {
            return res.status(500).send("Bei der Suche des angegebenen Benutzers in der Benutzerdatenbank ist ein Fehler aufgetreten.");
        }
        // if query was successful but nothing found
        if(!findEIdUserQuery.content) {
            return res.status(404).send("Ein Benutzer mit dem angegebenen Benutzernamen '" + req.session.userName + "' und dem verwendeten Ausweis konnte nicht gefunden werden.");
        }
        // if query was successful and user was found: create authenticated session
        req.session.userId = findEIdUserQuery.content._id;
        req.session.isAuthenticated = true;
        return res.status(201).send("Sie wurden erfolgreich eingeloggt.");
    } else {
        // req.session.isAuthenticated is being reset to false so that a user can start with a fresh session even if there are any inconsistencies with it
        req.session.isAuthenticated = false;
        return res.status(400).send("Die Authentifizierung konnte nicht abgeschlossen werden, da die Anfrage nicht die notwendigen Bedingungen erfüllt hat. Um den Login bei ArmadilLogin PLUS abzuschließen, müssen Sie zuvor die Eingabe des Benutzernamen und den Login mithilfe des Ausweises beim elektronischen Ausweisdienst durchgeführt haben.");
    }
}

/*
@desc Returns personal information of the user - this includes the username and the eIdentifier which was linked to the user's account during the eID registration process.
@route GET /api/eid-saml/userInformation
@access Private
 */
const getUserInformation = async (req, res) => {
    let userInformation = await fetchEIdUserInformation(req.session.userName);
    if(userInformation.success === 0) {
        return res.status(500).send("Die Benutzerinformationen konnten aufgrund eines internen Serverfehlers nicht aus der Benutzerdatenbank abgerufen werden.");
    }
    if(!userInformation.content) {
        return res.status(404).send("Der Benutzer konnte in der Benutzerdatenbank nicht gefunden werden.");
    }
    return res.status(200).send({
        userName: req.session.userName,
        eIdentifier: !!(userInformation.content.eIdentifier)
    });
}

// ------------------------
// PRIVATE HELPER FUNCTIONS

/*
@desc Retrieves user information from the database by username.
@param userNameToFetch - The username of the user for whom the information is to be retrieved.
 */
const fetchEIdUserInformation = async (userNameToFetch) => {
    // fetch user information from database
    return await UserModel.findOne({
        userName: userNameToFetch,
        isRegistered: true
    }).exec().then((databaseResponse) => {
        return {success: 1, content: databaseResponse};
    }).catch((databaseError) => {
        return {success: 0, content: databaseError};
    });
}


module.exports = {
    getMetadata,
    samlLogin,
    samlCallback,
    assertSaml,
    linkEIdToAccount,
    loginUserNameInput,
    loginCompletion,
    getUserInformation
}
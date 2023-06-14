import {Link, useLocation} from "react-router-dom";
import {NavigationState} from "../types/navigationState.js";
import terminal from "virtual:terminal";
import {useEffect, useState} from "react";

export default function AuthenticationSuccessfulComponent({privateState}) {
    const [currentPrivateState, setCurrentPrivateState] = useState("");

    useEffect(() => {
        if(privateState === NavigationState.welcome_shortcode_completed) {
            setCurrentPrivateState("welcome_shortcode_completed");
        } else {
            setCurrentPrivateState("welcome_login_completed");
        }
    }, []);

    return(
        <div className={"card p-0"}>
            <div className={"card-header bg-success bg-gradient text-white"}>
                <h1 className={"display-5"}>Login erfolgreich!</h1>
            </div>
            <div className={"card-body"}>
                <p>Herzlichen Glückwunsch!</p>
                <p className={"mb-0"}>Sie haben sich erfolgreich mittels FIDO2/WebAuthn in das Benutzerkonto eingeloggt, das Sie im Registrierungsvorgang erstellt haben. Betätigen Sie die Schaltfläche "Navigiere in meinen persönlichen Bereich", um sich in Ihrem persönlichen Bereich weitere Informationen zu Ihrem Benutzerkonto anzeigen zu lassen.</p>
                {privateState === NavigationState.welcome_shortcode_completed && <p>Sie können Ihr Benutzerkonto nun von diesem Gerät aus normal nutzen, ohne dass Sie sich direkt auf diesem Gerät eingeloggt haben. Das ist beispielsweise für Geräte sinnvoll, die FIDO2 nicht unterstützen oder keine geeigneten Anschlüsse für FIDO2-Authenticators besitzen.</p>}
            </div>
            <div className={"card-footer bg-success bg-opacity-25"}>
                <Link to={"/private/" + (currentPrivateState ? currentPrivateState : "")} className={"btn btn-primary"}>Navigiere in meinen persönlichen Bereich</Link>
            </div>
        </div>
    );
}
import {ErrorState} from "../types/errorState.js";
import ErrorComponent from "./ErrorComponent.jsx";
import {useState} from "react";
import {startAuthentication} from "@simplewebauthn/browser";
import terminal from "virtual:terminal";

export default function AuthenticationCompletion ( {authenticationOptions, setAuthenticationSuccess}) {
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");

    const completeAuthentication = async () => {
        let asseResp;
        try {
            // Pass the options to the authenticator and wait for a response
            asseResp = await startAuthentication(authenticationOptions);
        } catch (error) {
            setCurrentError(error);
            setErrorState(ErrorState.completeAuthenticationError);
            return;
        }
        terminal.log(asseResp);
    }

    return (
        <>
            <h1>Login mit Ihrem FIDO2/WebAuthn-Authenticator</h1>
            <p>Damit nur Sie sich in Ihren persönlichen Mitgliederbereich einloggen können, muss ArmadilLogin PLUS Ihre Identität nachvollziehen können. Bisher verwendet ein Großteil der heute verfügbaren Software dazu Passwörter. ArmadilLogin PLUS erlaubt es Ihnen, Ihre Identität passwortlos nachzuweisen. Hierzu ist ein sogenannter "Authenticator" erforderlich. Ein Authenticator kann entweder bereits in Ihrem Gerät verbaut sein und über biometrische Merkmale wie Fingerabdrücke, Iris-Scan, etc. entsperrt werden oder in Form eines Hardware-Sicherheitsschlüssels vorliegen.</p>
            <p>Um sich mithilfe des Authenticators anzumelden, den Sie zuvor in der Registrierung oder in Ihrem Mitgliederbereich mit Ihrem Konto verknüpft haben, drücken Sie den Knpof "Los geht's".</p>
            <button onClick={completeAuthentication} type={"button"} className={"btn btn-primary mb-3"}>
                Los geht's
            </button>

            {(errorState !== ErrorState.success) && <ErrorComponent errorState = {errorState} errorMessage={currentError}/>}
        </>
    );
}
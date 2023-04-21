import {ErrorState} from "../types/errorState.js";
import ErrorComponent from "./ErrorComponent.jsx";
import {useState} from "react";
import {startAuthentication} from "@simplewebauthn/browser";
import terminal from "virtual:terminal";
import axios from "axios";

export default function AuthenticationCompletion ( {authenticationOptions, setAuthenticationSuccess}) {
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");

    const completeAuthentication = async () => {
        let authenticationResponse;
        try {
            // Pass the options to the authenticator and wait for a response
            authenticationResponse = await startAuthentication(authenticationOptions);
        } catch (startRegistrationError) {
            if(startRegistrationError.name === "NotAllowedError") {
                setCurrentError(startRegistrationError.name + ": Der Benutzer hat den Authentifizierungsvorgang nicht erlaubt. Das kann passieren, wenn Sie die Meldung zum Verbinden des Authenticators mit Ihrem Gerät vorzeitig schließen. Bitte versuchen Sie es erneut.");
            } else if(startRegistrationError.name === "InvalidStateError"){
                setCurrentError(startRegistrationError.name + ": Der Authenticator, den Sie zum Login verwendet haben, scheint nicht mit dem angegebenen Benutzerkonto verknüpft zu sein. Falls Sie ihn zu Ihrem Benutzerkonto hinzufügen möchten, loggen Sie sich mit einem bereits verknüpften Authenticator in Ihr Konto ein und fügen Sie ihn innerhalb Ihrer Kontoeinstellungen hinzu.");
            }
            setErrorState(ErrorState.completeAuthenticationError);
            return;
        }
        terminal.log(authenticationResponse);

        try {
            let completeAuthenticationResponse = await axios({
                method: 'post',
                url: 'http://localhost:5000/api/webauthn/completeAuthentication',
                data: authenticationResponse
            }).then((response) => {
                return response;
            });

            if(completeAuthenticationResponse.status !== 200) {
                setCurrentError(completeAuthenticationResponse.data);
                setErrorState(ErrorState.completeAuthenticationError);
            } else {
                setAuthenticationSuccess(true);
                setErrorState(ErrorState.success);
            }
        } catch (error) {
            setCurrentError("Fehler bei der Verbindung mit dem Backend. Bitte prüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
        }

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
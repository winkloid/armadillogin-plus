import {ErrorState} from "../types/errorState.js";
import ErrorComponent from "./ErrorComponent.jsx";
import {useState} from "react";
import {startAuthentication} from "@simplewebauthn/browser";
import axios from "axios";

export default function AuthenticationCompletion ( {authenticationOptions, setAuthenticationSuccess}) {
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const completeAuthentication = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
            return;
        }

        try {
            let completeAuthenticationResponse = await axios({
                method: 'post',
                url: import.meta.env.VITE_BACKEND_BASE_URL + '/api/webauthn/completeAuthentication',
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
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={"card p-0"}>
            <div className={"card-header"}>
                <h1 className={"display-5 m-0"}>Login mit Ihrem FIDO2/WebAuthn-Authenticator</h1>
            </div>
            <div className={"card-body"}>
                <p>Damit nur Sie sich in Ihren persönlichen Mitgliederbereich einloggen können, muss ArmadilLogin PLUS Ihre Identität nachvollziehen können. Bisher verwendet ein Großteil der heute verfügbaren Software dazu Passwörter. ArmadilLogin PLUS erlaubt es Ihnen, <strong>Ihre Identität passwortlos nachzuweisen</strong>. Hierzu ist ein sogenannter <strong>"Authenticator"</strong> erforderlich. Ein Authenticator kann entweder bereits in Ihrem Gerät verbaut sein und über biometrische Merkmale wie Fingerabdrücke, Iris-Scan, etc. entsperrt werden oder in Form eines Hardware-Sicherheitsschlüssels vorliegen. Er <strong>dient dazu, jegliche zum Login erforderliche Informationen sicher aufzubewahren</strong>.</p>
                <p className={"mb-0"}>Um sich mithilfe des Authenticators anzumelden, den Sie zuvor in der Registrierung oder in Ihrem Mitgliederbereich mit Ihrem Konto verknüpft haben, betätigen Sie die Schaltfläche "Bestätige Login mittels Authenticator".</p>
            </div>
            <div className={"card-footer"}>
                {!isLoading ? (
                <button onClick={completeAuthentication} type={"button"} className={"btn btn-primary"}>
                    Bestätige Login mittels Authenticator
                </button>) : (
                <button type={"button"} disabled={true} className={"btn btn-primary"}>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span> Warte auf Abschluss des Logins...</span>
                </button>)
                }
            </div>

            <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
        </div>
    );
}
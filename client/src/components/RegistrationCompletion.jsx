import {startRegistration} from "@simplewebauthn/browser";
import terminal from "virtual:terminal";
import {ErrorState} from "../types/errorState.js";
import {useEffect, useState} from "react";
import axios from "axios";
import ErrorComponent from "./ErrorComponent.jsx";
import {useOutletContext} from "react-router-dom";
import {NavigationState} from "../types/navigationState.js";

export default function RegistrationCompletion({registrationOptions, setRegistrationSuccess}) {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [customAuthenticatorName, setCustomAuthenticatorName] = useState("");

    const completeRegistration = async () => {
        setIsLoading(true);
        // request response from the WebAuthn authenticator for registration
        // the Authenticator will now create a key pair consisting of public and private key
        // the Authenticator's response will include the public key of this key pair and a signature of the challenge that was included in the registrationOptions-JSON
        let registrationResponse;
        try {
            // Pass the options to the authenticator and wait for a response
            registrationResponse = await startRegistration(registrationOptions);
            terminal.log("RegistrationResponse: \n\n" + registrationResponse.rawId);
        } catch (startRegistrationError) {
            setRegistrationSuccess(false);
            if (startRegistrationError.name === "InvalidStateError") {
                setCurrentError("Fehler: Der Authenticator scheint bereits mit dem angegebenen Benutzer verknüpft zu sein.");
            } else {
                setCurrentError("Ein unerwarteter Fehler ist beim Start der Registrierung aufgetreten: " + startRegistrationError);
            }
            setErrorState(ErrorState.completeRegistrationError);
            setIsLoading(false);
            return;
        }

        try {
            let completeRegistrationResponse = await axios({
                method: 'post',
                url: import.meta.env.VITE_BACKEND_BASE_URL + '/api/webauthn/completeRegistration',
                data: {
                    authenticatorName: customAuthenticatorName,
                    registrationResponse: registrationResponse
                }
            }).then((response) => {
                return response;
            });

            if(completeRegistrationResponse.status !== 201) {
                setRegistrationSuccess(false);
                setCurrentError(completeRegistrationResponse.data);
                setErrorState(ErrorState.completeRegistrationError);
            } else {
                setRegistrationSuccess(true);
                setErrorState(ErrorState.success);
            }
        } catch (error) {
            setCurrentError("Fehler bei der Verbindung mit dem Backend. Bitte prüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
            setIsLoading(false);
        }
    }
    return(
        <div className={"card p-0"}>
            <div className={"card-header"}>
                <h1 className={"display-5"}>Registrierung Ihres FIDO2/WebAuthn-Authenticators</h1>
            </div>
            <div className={"card-body"}>
                <p>Damit nur Sie sich in Ihren persönlichen Mitgliederbereich einloggen können, muss ArmadilLogin PLUS Ihre Identität nachvollziehen können. Bisher verwendet ein Großteil der heute verfügbaren Software dazu Passwörter. ArmadilLogin PLUS erlaubt es Ihnen, <strong>Ihre Identität passwortlos nachzuweisen</strong>. Hierzu ist ein sogenannter <strong>"Authenticator"</strong> erforderlich. Ein Authenticator kann entweder bereits in Ihrem Gerät verbaut sein und über biometrische Merkmale wie Fingerabdrücke, Iris-Scan, etc. entsperrt werden oder in Form eines Hardware-Sicherheitsschlüssels vorliegen. Er dient dazu, alle <strong>geheimen Informationen für den Login sicher für Sie aufzubewahren</strong>.</p>
                <p>Um Ihr Konto bei ArmadilLogin PLUS mit einem Authenticator zu verknüpfen, betätigen Sie die Schaltfläche "Verknüpfe meinen Authenticator".</p>
                <p>Optional können Sie hier auch einen Namen für den neu zu registrierenden Authenticator vergeben. Das kann später helfen, den Überblick über alle Ihrem Konto hinzugefügten Authenticators zu behalten.</p>
                <div className={"input-group"}>
                    <span className={"input-group-text"} id={"authenticatorName-addon"}>🔑</span>
                    <input value={customAuthenticatorName}
                           onChange={(authenticatorNameChange) => setCustomAuthenticatorName(authenticatorNameChange.target.value)}
                           type={"text"}
                           disabled={isLoading}
                           className={"form-control border-primary"} placeholder={"Authenticator-Name (optional)"}
                           aria-label={"Name Ihres Authenticators"} aria-describedby={"authenticatorName-addon"}/>
                </div>
            </div>
            <div className={"card-footer"}>
                {!isLoading ? (
                    <button onClick={completeRegistration} disabled={isLoading} type={"button"} className={"btn btn-primary"}>
                        Verknüpfe meinen Authenticator
                    </button>
                ) : (
                    <button type={"button"} disabled={true} className={"btn btn-primary"}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span> Warte Auf Abschluss der Registrierung...</span>
                    </button>
                )}
            </div>

            <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
        </div>
    );
}
import {browserSupportsWebAuthn, startRegistration} from "@simplewebauthn/browser";
import terminal from "virtual:terminal";
import {ErrorState} from "../types/errorState.js";
import {useState} from "react";
import axios from "axios";
import ErrorComponent from "./ErrorComponent.jsx";

export default function RegistrationCompletion({registrationOptions, setRegistrationSuccess}) {
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
                url: 'http://localhost:5000/api/webauthn/completeRegistration',
                data: registrationResponse
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
        <>
            <h1>Registrierung Ihres FIDO2/WebAuthn-Authenticators</h1>
            <p>Damit nur Sie sich in Ihren persönlichen Mitgliederbereich einloggen können, muss ArmadilLogin PLUS Ihre Identität nachvollziehen können. Bisher verwendet ein Großteil der heute verfügbaren Software dazu Passwörter. ArmadilLogin PLUS erlaubt es Ihnen, Ihre Identität passwortlos nachzuweisen. Hierzu ist ein sogenannter "Authenticator" erforderlich. Ein Authenticator kann entweder bereits in Ihrem Gerät verbaut sein und über biometrische Merkmale wie Fingerabdrücke, Iris-Scan, etc. entsperrt werden oder in Form eines Hardware-Sicherheitsschlüssels vorliegen.</p>
            <p>Um Ihr Konto bei ArmadilLogin PLUS mit einem Authenticator zu verknüpfen, drücken Sie den Knpof "Los geht's".</p>
            <button onClick={completeRegistration} type={"button"} className={"btn btn-primary mb-3"}>
                Los geht's
            </button>

            {(errorState !== ErrorState.success) && <ErrorComponent errorState = {errorState} errorMessage={currentError}/>}
        </>
    );
}
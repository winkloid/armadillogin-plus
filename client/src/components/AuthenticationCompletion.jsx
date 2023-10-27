import {ErrorState} from "../types/errorState.js";
import ErrorComponent from "./ErrorComponent.jsx";
import {useState} from "react";
import {startAuthentication} from "@simplewebauthn/browser";
import axios from "axios";

export default function AuthenticationCompletion ( {authenticationOptions, setAuthenticationSuccess, authenticationState, timeStampStartWithUserName}) {
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const setFido2TimeStamp = async (timeStampStart, timeStampEnd) => {
        try {
            let setTimeStampResponse = await axios({
                method: 'put',
                url: import.meta.env.VITE_BACKEND_BASE_URL + '/api/timeStamps/setFido2TimeStamps',
                data: {
                    timeStampType: (authenticationState?.isShortcodeLogin ? "shortcodeAuthentication" : "authentication"),
                    timeStampStartWithUserName: timeStampStartWithUserName,
                    timeStampStart: timeStampStart,
                    timeStampEnd: timeStampEnd
                }
            }).then((response) => {
                return response;
            });

            if(setTimeStampResponse.status === 201) {
                setErrorState(ErrorState.success);
                return true;
            } else {
                setCurrentError("Server meldet: " + setTimeStampResponse.data);
                if (setTimeStampResponse.status === 400) {
                    setErrorState(ErrorState.badRequestError);
                } else if (setTimeStampResponse.status === 500) {
                    setErrorState(ErrorState.serverError);
                } else {
                    setErrorState(ErrorState.connectionError);
                }
                return false;
            }
        } catch(error) {
            setCurrentError("Verbindungsproblem beim Senden der Zeitmessungsergebnisse an den Server. " + error);
            setErrorState(ErrorState.connectionError);
            return false;
        }
    }

    const completeAuthentication = async () => {
        setIsLoading(true);
        const authenticationStartTimeMS = new Date().getTime();
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
                const authenticationEndTimeMS = new Date().getTime();
                let isTimeStampSettingSuccessful = await setFido2TimeStamp(authenticationStartTimeMS, authenticationEndTimeMS);
                if(isTimeStampSettingSuccessful) {
                    setAuthenticationSuccess(true);
                    setErrorState(ErrorState.success);
                }
            }
        } catch (error) {
            setCurrentError("Fehler bei der Verbindung mit dem Backend. Bitte prüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={"card p-0 mb-5"}>
            <div className={"card-header"}>
                <h1 className={"display-5 m-0"}>Login mit Ihrem FIDO2/WebAuthn-Authenticator</h1>
            </div>
            <div className={"card-body"}>
                <p>Über die untenstehende Schaltfläche können Sie nun den Dialog zum Login mithilfe Ihres registrierten Authenticators initiieren.</p>
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
import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorState} from "../../types/errorState.js";
import {startRegistration} from "@simplewebauthn/browser";
import terminal from "virtual:terminal";
import AuthenticatorList from "./AuthenticatorList.jsx";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function AuthenticatorSettings({setIsLoggedIn, setErrorState, setCurrentError, isGlobalLoading, setIsGlobalLoading}) {
    const [isLoading, setIsLoading] = useState(true);
    const [customAuthenticatorName, setCustomAuthenticatorName] = useState("");
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // set by useEffect
    const [authenticatorList, setAuthenticatorList] = useState([]);

    useEffect( () => {
        fetchAuthenticatorList();
    }, []);

    const fetchAuthenticatorList = async () => {
        setIsGlobalLoading(true);
        setIsLoading(true);
        let authenticatorListResponse;
        try {
            authenticatorListResponse = await axios({
                method: "get",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/webauthn/getUserAuthenticatorList"
            }).then((backendResponse) => {
                return backendResponse;
            });

            if(authenticatorListResponse.status === 200) {
                setAuthenticatorList(authenticatorListResponse.data);
                setErrorState(ErrorState.success);
            } else if(authenticatorListResponse.status === 401) {
                setIsLoggedIn(false);
            } else if(authenticatorListResponse.status === 500){
                setCurrentError(authenticatorListResponse.data);
                setErrorState(ErrorState.serverError);
            } else {
                setCurrentError(authenticatorListResponse.data);
                setErrorState(ErrorState.connectionError);
            }
        } catch (error) {
            setCurrentError("Fehler bei der Kommunikation mit dem Server. Bitte überprüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
            setIsGlobalLoading(false);
        }
    }

    const handleAuthenticatorDeletion = async (credentialId) => {
        terminal.log("credentialId:" + credentialId);
        setIsGlobalLoading(true);
        setIsLoading(true);
        try {
            const authenticatorDeletionResponse = await axios({
                method: "delete",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/webauthn/deleteAuthenticator",
                data: {
                    credentialId: credentialId
                }
            }).then((response) => {
                return response;
            });

            if(authenticatorDeletionResponse.status === 200) {
                await fetchAuthenticatorList();
                setErrorState(ErrorState.success);
            } else if(authenticatorDeletionResponse.status === 401) {
                setIsLoggedIn(false);
            } else if(authenticatorDeletionResponse.status === 400) {
                setCurrentError(authenticatorDeletionResponse.data);
                setErrorState(ErrorState.authenticatorDeletionError);
            } else if(authenticatorDeletionResponse.status === 500) {
                setCurrentError(authenticatorDeletionResponse.data);
                setErrorState(ErrorState.serverError);
            } else {
                setCurrentError("Unerwarteter Fehler bei der Kommunikation mit dem Server. Bitte prüfen Sie Ihre Eingaben und Ihre Verbindung.");
                setErrorState(ErrorState.authenticatorDeletionError);
            }
        } catch(error) {
            setCurrentError("Fehler bei der Kommunikation mit dem Server. Bitte überprüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
            setIsGlobalLoading(false);
        }
    }

    const handleAuthenticatorAddition = async () => {
        setIsGlobalLoading(true);
        setIsLoading(true);

        let registrationOptions;
        try {
            let optionsResponse = await axios({
                method: 'get',
                url: import.meta.env.VITE_BACKEND_BASE_URL + '/api/webauthn/addNewAuthenticatorOptions',
            }).then((response) => {
                return response;
            });

            if (optionsResponse.status === 200) {
                // Debug: terminal.log(optionsResponse.data);
                registrationOptions = optionsResponse.data;

            // Error handling
            } else if (optionsResponse.status === 401) {
                setIsLoggedIn(false);
                setIsGlobalLoading(false);
                return;
            }
            else {
                setCurrentError("Fehler: " + optionsResponse.data);
                setErrorState(ErrorState.registrationOptionsError);
                setIsLoading(false);
                setIsGlobalLoading(false);
                return;
            }
        } catch (error) {
            if(axios.isAxiosError(error)) {
                setCurrentError("Fehler bei der Verbindung mit dem Backend. Bitte prüfen Sie Ihre Internetverbindung.");
            } else {
                setCurrentError("Ein unerwarteter Fehler ist aufgetreten: " + error);
            }
            setErrorState(ErrorState.connectionError);
            setIsLoading(false);
            setIsGlobalLoading(false);
            return;
        }

        // request response from the WebAuthn authenticator for registration
        // the Authenticator will now create a key pair consisting of public and private key
        // the Authenticator's response will include the public key of this key pair and a signature of the challenge that was included in the registrationOptions-JSON
        let registrationResponse;
        try {
            // Pass the options to the authenticator and wait for a response
            registrationResponse = await startRegistration(registrationOptions);
        } catch (startRegistrationError) {
            if (startRegistrationError.name === "InvalidStateError") {
                setCurrentError("Fehler: Der Authenticator scheint bereits mit dem angegebenen Benutzer verknüpft zu sein.");
            } else {
                setCurrentError("Ein unerwarteter Fehler ist beim Start der Registrierung aufgetreten: " + startRegistrationError);
            }
            setErrorState(ErrorState.completeRegistrationError);
            setIsLoading(false);
            setIsGlobalLoading(false);
            return;
        }

        try {
            let completeRegistrationResponse = await axios({
                method: 'post',
                url: import.meta.env.VITE_BACKEND_BASE_URL + '/api/webauthn/addNewAuthenticatorCompletion',
                data: {
                    authenticatorName: customAuthenticatorName,
                    registrationResponse: registrationResponse
                }
            }).then((response) => {
                return response;
            });

            if(completeRegistrationResponse.status !== 201) {
                setCurrentError(completeRegistrationResponse.data);
                setErrorState(ErrorState.completeRegistrationError);
            } else {
                setRegistrationSuccess(true);
                setErrorState(ErrorState.success);
                setCustomAuthenticatorName("");
                fetchAuthenticatorList();
            }
        } catch (error) {
            setCurrentError("Fehler bei der Verbindung mit dem Backend. Bitte prüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
            setIsLoading(false);
            setIsGlobalLoading(false);
        }
    }

    return (
        <div className="card p-0 mb-3 border-secondary">
            <div className="card-header border-secondary">
                <h4 className={"m-0"}>Authenticators</h4>
            </div>
            <div className="card-body">
                <h5>Liste aller aktuell mit Ihrem Benutzerkonto verknüpfter Authenticators:</h5>
                {isLoading &&
                <div className={"d-flex justify-content-center"}>
                    <div className="spinner-border text-primary m-5"  role="status">
                        <span className="visually-hidden">Lade Authenticator-Liste...</span>
                    </div>
                </div>
                }
                {!isLoading && <AuthenticatorList authenticatorList={authenticatorList} handleAuthenticatorDeletion={handleAuthenticatorDeletion}/>}
            </div>
            <div className={"card-footer"}>
                <h5>Weiteren Authenticator hinzufügen</h5>
                <p>Hier können Sie weitere Authenticators hinzufügen, um bei Authenticator-Verlust den Zugang zu Ihrem Konto nicht zu verlieren.</p>
                <form>
                    <div className={"input-group mb-3"}>
                        <span className={"input-group-text"} id={"authenticatorName-addon"}>🔑</span>
                        <input value={customAuthenticatorName}
                               onChange={(authenticatorNameChange) => setCustomAuthenticatorName(authenticatorNameChange.target.value)}
                               type={"text"}
                               disabled={isLoading}
                               className={"form-control"} placeholder={"Authenticator-Name (optional)"}
                               aria-label={"Name Ihres Authenticators"}
                               aria-describedby={"authenticatorName-addon"}/>
                    </div>
                </form>
                <button className="btn btn-secondary" type={"button"} onClick={handleAuthenticatorAddition} disabled={isGlobalLoading}>
                    <span>➕ </span>Füge weiteren hinzu
                </button>
                {registrationSuccess && (<><p>Authenticator wurde erfolgreich hinzugefügt</p></>)}
            </div>
        </div>
    );
}
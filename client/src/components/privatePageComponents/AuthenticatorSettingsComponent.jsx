import {useState} from "react";
import axios from "axios";
import {ErrorState} from "../../types/errorState.js";
import {startRegistration} from "@simplewebauthn/browser";
import terminal from "virtual:terminal";
import {useNavigate} from "react-router-dom";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function AuthenticatorSettings({setIsLoggedIn}) {
    const [customAuthenticatorName, setCustomAuthenticatorName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);


    const handleAuthenticatorAddition = async () => {
        setIsLoading(true);

        terminal.log("Aufgerufen.");
        let registrationOptions;
        try {
            let optionsResponse = await axios({
                method: 'get',
                url: 'http://localhost:5000/api/webauthn/addNewAuthenticatorOptions',
            }).then((response) => {
                return response;
            });

            if (optionsResponse.status === 200) {
                // Debug: terminal.log(optionsResponse.data);
                registrationOptions = optionsResponse.data;

            // Error handling
            } else if (optionsResponse.status === 401) {
                setIsLoggedIn(false);
                return;
            }
            else {
                setCurrentError("Fehler: " + optionsResponse.data);
                setErrorState(ErrorState.registrationOptionsError);
                setIsLoading(false);
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
            return;
        }

        // request response from the WebAuthn authenticator for registration
        // the Authenticator will now create a key pair consisting of public and private key
        // the Authenticator's response will include the public key of this key pair and a signature of the challenge that was included in the registrationOptions-JSON
        let registrationResponse;
        try {
            // Pass the options to the authenticator and wait for a response
            registrationResponse = await startRegistration(registrationOptions);
            terminal.log("RegistrationResponse: \n\n" + registrationResponse.rawId);
        } catch (startRegistrationError) {
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
                url: 'http://localhost:5000/api/webauthn/addNewAuthenticatorCompletion',
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
            }
        } catch (error) {
            setCurrentError("Fehler bei der Verbindung mit dem Backend. Bitte prüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
            setIsLoading(false);
        }
    }

    return(
        <div className={"container"}>
            <div className="row">
                <div className="card p-0 mb-3">
                    <div className="card-header col">
                        <h4>Authenticators</h4>
                    </div>
                    <div className="card-body">
                        <h5>Aktuell mit Ihrem Benutzerkonto verknüpfte Authenticators</h5>
                        <p>AuthenticatorListe</p>
                    </div>
                    <div className={"card-footer"}>
                        <h5>Weiteren Authenticator hinzufügen</h5>
                        <p>Auch wenn Sie das Gerät, mit dem Sie sich normalerweise in Ihr Benutzerkonto einloggen verloren geht, sollten Sie den Zugang zu Ihrem Konto nicht verlieren. Daher ist es ratsam, mehrere Geräte mit Ihrem Benutzerkonto zu verknüpfen, um sich im Falle eines Geräteverlusts mit einem Alternativgerät anmelden zu können.</p>
                        <p>Sie können in diesem Abschnitt einen optionalen Namen für einen weiteren Authenticator vergeben und ihn mit Ihrem Konto verknüpfen. </p>
                        <form>
                            <div className={"input-group mb-3"}>
                                <span className={"input-group-text"} id={"authenticatorName-addon"}>🔑</span>
                                <input value={customAuthenticatorName}
                                       onChange={(authenticatorNameChange) => setCustomAuthenticatorName(authenticatorNameChange.target.value)}
                                       type={"text"}
                                       disabled={isLoading}
                                       className={"form-control"} placeholder={"Authenticator-Name (optional)"}
                                       aria-label={"Name Ihres Authenticators"} aria-describedby={"authenticatorName-addon"}/>
                            </div>
                        </form>
                        <button className="btn btn-primary" type={"button"} onClick={handleAuthenticatorAddition}><span>➕ </span>Füge weiteren hinzu</button>

                        {registrationSuccess && (<><p>Authenticator wurde erfolgreich hinzugefügt</p></>)}
                    </div>
                </div>
            </div>
        </div>
    );
}
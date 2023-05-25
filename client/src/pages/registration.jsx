import {useEffect, useState} from "react";
import {browserSupportsWebAuthn} from "@simplewebauthn/browser";
import axios from "axios";
import ErrorComponent from "../components/ErrorComponent.jsx";
import {ErrorState} from "../types/errorState.js";
import RegistrationCompletion from "../components/RegistrationCompletion.jsx";
import {useOutletContext} from "react-router-dom";
import {NavigationState} from "../types/navigationState.js";
import RegistrationSuccessfulComponent from "../components/RegistrationSuccessfulComponent.jsx";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function Registration() {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingRegistrationOptionsSuccess, setFetchingRegistrationOptionsSuccess] = useState(false);
    const [completeRegistrationSuccess, setCompleteRegistrationSuccess] = useState(false);
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [registrationOptions, setRegistrationOptions] = useState({});

    useEffect(() => {
        if(!fetchingRegistrationOptionsSuccess) {
            setCurrentNavigationState(NavigationState.registration.userNameInput);
        } else if(fetchingRegistrationOptionsSuccess && !completeRegistrationSuccess) {
            setCurrentNavigationState(NavigationState.registration.authenticatorRegistration);
        } else {
            setCurrentNavigationState(NavigationState.welcome_registration_completed);
        }
    });

    const getRegistrationOptions = async () => {
        setIsLoading(true);
        try {
            let optionsResponse = await axios({
                method: 'post',
                url: import.meta.env.VITE_BACKEND_BASE_URL + '/api/webauthn/registrationOptions',
                data: {"userName": userName}
            }).then((response) => {
                return response;
            });

            if (optionsResponse.status === 200) {
                // Debug: terminal.log(optionsResponse.data);
                setRegistrationOptions(optionsResponse.data);
                setFetchingRegistrationOptionsSuccess(true);
                setErrorState(ErrorState.success);
                setIsLoading(false);
            } else if(optionsResponse.status === 400) {
                setCurrentError("Fehler: " + optionsResponse.data);
                setErrorState(ErrorState.badRequestError);
                setIsLoading(false);
            }
            else {
                setCurrentError("Fehler: " + optionsResponse.data);
                setErrorState(ErrorState.registrationOptionsError);
                setIsLoading(false);
            }
        } catch (error) {
            if(axios.isAxiosError(error)) {
                setCurrentError("Fehler bei der Verbindung mit dem Backend. Bitte prüfen Sie Ihre Internetverbindung.");
            } else {
                setCurrentError("Ein unerwarteter Fehler ist aufgetreten: " + error);
            }
            setErrorState(ErrorState.connectionError);
            setIsLoading(false);
        }
    }

    if(!fetchingRegistrationOptionsSuccess) {
        return (
            <div className={"card p-0"}>
                <div className={"card-header"}>
                    <h1 className={"display-5 m-0"}>Registrierung</h1>
                </div>
                <div className={"card-body"}>
                    <p>Bitte vergeben Sie hier einen Benutzernamen, den Sie später verwenden möchten, um Ihr Konto bei
                        ArmadilLogin PLUS aufzurufen.</p>
                    <div className={"input-group mb-3"}>
                        <span className={"input-group-text"} id={"userName-addon"}>@</span>
                        <input value={userName}
                               onChange={(userNameChangeEvent) => setUserName(userNameChangeEvent.target.value)}
                               onKeyUp={(keyEvent) => {
                                   if (keyEvent.key === "Enter") {
                                       getRegistrationOptions();
                                   }
                               }}
                               type={"text"}
                               disabled={isLoading}
                               className={"form-control border-primary"} placeholder={"Benutzername"}
                               aria-label={"Benutzername"} aria-describedby={"userName-addon"}/>
                    </div>
                    {/* Show the button as disabled and with a loading animation only if data are currently fetched from the backend */}
                    {!isLoading ? (
                    <button onClick={getRegistrationOptions} type={"button"} disabled={!browserSupportsWebAuthn() || isLoading} className={"btn btn-primary mb-3"}>
                        Bestätigen
                    </button>
                    ) : (
                    <button type={"button"} disabled={true} className={"btn btn-primary mb-3"}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Kontaktiere Server...
                    </button>
                    )}

                    {browserSupportsWebAuthn()?
                        (<div className={"alert alert-success"}>
                            <div className={"row d-inline-flex"}>
                                <div className={"col-1"}>🟢</div>
                                <div className={"col-11"}>Sehr gut! Dieser Browser unterstützt FIDO2/WebAuthn!</div>
                            </div>
                        </div>) : (
                        <div className={"alert alert-success"}>
                            <div className={"row d-inline-flex"}>
                                <div className={"col-1"}>🔴</div>
                                <div className={"col-11"}>Bitte verwenden Sie einen anderen Browser. Dieser Browser unterstützt FIDO2/WebAuthn nicht. <strong>Sie können den Registrierungvorgang daher nicht starten.</strong></div>
                            </div>
                        </div>)
                    }
                </div>
                <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
            </div>
        )
    } else if(fetchingRegistrationOptionsSuccess && !completeRegistrationSuccess) {
        return(
            <RegistrationCompletion registrationOptions={registrationOptions} setRegistrationSuccess={setCompleteRegistrationSuccess} />
        );
    } else {
        return(<RegistrationSuccessfulComponent />);
    }
}
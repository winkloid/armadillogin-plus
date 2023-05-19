import {useEffect, useRef, useState} from "react";
import {browserSupportsWebAuthn, startRegistration} from "@simplewebauthn/browser";
import axios from "axios";
import terminal from "virtual:terminal";
import ErrorComponent from "../components/ErrorComponent.jsx";
import {ErrorState} from "../types/errorState.js";
import RegistrationCompletion from "../components/RegistrationCompletion.jsx";
import {Navigate} from "react-router-dom";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function Registration() {
    const [userName, setUserName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingRegistrationOptionsSuccess, setFetchingRegistrationOptionsSuccess] = useState(false);
    const [completeRegistrationSuccess, setCompleteRegistrationSuccess] = useState(false);
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [registrationOptions, setRegistrationOptions] = useState({});

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
            <>
                <h1>Registrierung</h1>
                <p>Bitte vergeben Sie hier einen Benutzernamen, den Sie später verwenden möchten, um Ihr Konto bei
                    ArmadilLogin PLUS aufzurufen.</p>
                {browserSupportsWebAuthn()?
                    (<p className={"text-bg-success"}>Sehr gut! Dieser Browser unterstützt FIDO2/WebAuthn!</p>)
                    : (<p className={"text-bg-danger"}>Bitte verwenden Sie einen anderen Browser. Dieser Browser unterstützt FIDO2/WebAuthn nicht.</p>)}
                <form>
                    <div className={"input-group mb-3"}>
                        <span className={"input-group-text"} id={"userName-addon"}>@</span>
                        <input value={userName}
                               onChange={(userNameChangeEvent) => setUserName(userNameChangeEvent.target.value)}
                               type={"text"}
                               disabled={isLoading}
                               className={"form-control"} placeholder={"Benutzername"}
                               aria-label={"Benutzername"} aria-describedby={"userName-addon"}/>
                    </div>

                    {/* Show the button as disabled and with a loading animation only if data are currently fetched from the backend */}
                    {!isLoading ? (
                    <button onClick={getRegistrationOptions} type={"button"} disabled={!browserSupportsWebAuthn()} className={"btn btn-primary mb-3"}>
                        Bestätigen
                    </button>
                    ) : (
                    <button type={"button"} disabled={true} className={"btn btn-primary mb-3"}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Kontaktiere Server...
                    </button>
                    )}
                </form>
                <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
            </>
        )
    } else if(fetchingRegistrationOptionsSuccess && !completeRegistrationSuccess) {
        return(
            <RegistrationCompletion registrationOptions={registrationOptions} setRegistrationSuccess={setCompleteRegistrationSuccess} />
        );
    } else {
        return(<Navigate to={"/private"} />);
    }
}
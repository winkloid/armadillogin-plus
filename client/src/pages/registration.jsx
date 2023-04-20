import {useState} from "react";
import {browserSupportsWebAuthn, startRegistration} from "@simplewebauthn/browser";
import axios from "axios";

import terminal from "virtual:terminal";
import ErrorComponent from "../components/ErrorComponent.jsx";
import {ErrorState} from "../types/errorState.js";
import RegistrationCompletion from "../components/RegistrationCompletion.jsx";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with statuscode !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function Registration() {
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingRegistrationOptionsSuccess, setFetchingRegistrationOptionsSuccess] = useState(false);
    const [completeRegistrationSuccess, setCompleteRegistrationSuccess] = useState(false);
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [registrationOptions, setRegistrationOptions] = useState({});

    const getRegistrationOptions = async () => {
        setLoading(true);
        try {
            let optionsResponse = await axios({
                method: 'post',
                url: 'http://localhost:5000/api/webauthn/registrationOptions',
                data: {"userName": userName}
            }).then((response) => {
                return response;
            });

            if (optionsResponse.status === 200) {
                // Debug: terminal.log(optionsResponse.data);
                setRegistrationOptions(optionsResponse.data);
                setFetchingRegistrationOptionsSuccess(true);
                setErrorState(ErrorState.success);
                setLoading(false);
            } else {
                setCurrentError("Fehler: " + optionsResponse.data);
                setErrorState(ErrorState.registrationOptionsError);
                setFetchingRegistrationOptionsSuccess(false);
                setLoading(false);
            }
        } catch (error) {
            setFetchingRegistrationOptionsSuccess(false);
            if(axios.isAxiosError(error)) {
                setCurrentError("Fehler bei der Verbindung mit dem Backend. Bitte prüfen Sie Ihre Internetverbindung.");
            } else {
                setCurrentError("Ein unerwarteter Fehler ist aufgetreten: " + error);
            }
            setErrorState(ErrorState.connectionError);
            setLoading(false);
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
                               disabled={loading}
                               className={"form-control"} placeholder={"Benutzername"}
                               aria-label={"Benutzername"} aria-describedby={"userName-addon"}/>
                    </div>

                    {/* Show the button as disabled and with a loading animation only if data are currently fetched from the backend */}
                    {!loading ? (
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
                {(errorState !== ErrorState.success) && <ErrorComponent errorState = {errorState} errorMessage={currentError}/>}
            </>
        )
    } else if(fetchingRegistrationOptionsSuccess && !completeRegistrationSuccess) {
        return(
            <RegistrationCompletion registrationOptions={registrationOptions} setRegistrationSuccess={setCompleteRegistrationSuccess} />
        );
    } else {
        return(<></>);
    }
}
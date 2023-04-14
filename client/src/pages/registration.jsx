import {useState} from "react";
import {browserSupportsWebAuthn, startRegistration} from "@simplewebauthn/browser";
import axios from "axios";

import terminal from "virtual:terminal";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;

export default function Registration() {
    const [userName, setUserName] = useState("");
    const [registrationBegin, setRegistrationBegin] = useState(true);
    const [fetchingRegistrationOptions, setFetchingRegistrationOptions] = useState(false);
    const [fetchingRegistrationOptionsSuccess, setFetchingRegistrationOptionsSuccess] = useState(false);
    const [registrationOptions, setRegistrationOptions] = useState({});

    const getRegistrationOptions = async () => {
        terminal.log(userName);
        setFetchingRegistrationOptions(true);

        let optionsResponse = await axios({
            method: 'post',
            url: 'http://localhost:5000/api/webauthn/registrationOptions',
            data: {"userName": userName}
        }).then((response) => {
            return response;
        }).catch((error) => {
            return error.response;
        });
        if (optionsResponse.status === 200) {
            terminal.log(optionsResponse.data);
            setRegistrationOptions(optionsResponse.data);
            setFetchingRegistrationOptions(false);
            setFetchingRegistrationOptionsSuccess(true);

            let attResp;
            try {
                // Pass the options to the authenticator and wait for a response
                attResp = await startRegistration(optionsResponse.data);
            } catch (error) {
                throw error;
            }
        } else {
            setFetchingRegistrationOptions(false);
            setFetchingRegistrationOptionsSuccess(false);
        }
    }

    if(registrationBegin) {
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
                               disabled={fetchingRegistrationOptions}
                               className={"form-control"} placeholder={"Benutzername"}
                               aria-label={"Benutzername"} aria-describedby={"userName-addon"}/>
                    </div>

                    {/* Show the button as disabled and with a loading animation only if data are currently fetched from the backend */}
                    {!fetchingRegistrationOptions ? (
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
            </>
        )
    }
}
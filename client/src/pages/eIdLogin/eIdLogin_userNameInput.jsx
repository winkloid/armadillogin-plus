import {browserSupportsWebAuthn} from "@simplewebauthn/browser";
import {useEffect, useState} from "react";
import {ErrorState} from "../../types/errorState.js";
import ErrorComponent from "../../components/ErrorComponent.jsx";
import axios from "axios";
import {useOutletContext} from "react-router-dom";
import {NavigationState} from "../../types/navigationState.js";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function EIdLogin_userNameInput() {
    const [userName, setUserName] = useState("");
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [isLoading, setIsLoading] = useState(false);
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    const addUserNameToSession = async () => {
        try {
            setIsLoading(true);
            let userNameToSessionResponse = await axios({
                    method: "post",
                    url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/eid-saml/loginUserNameInput",
                    data: {
                        userName: userName
                    }
                }
            ).then((response) => {
                return response;
            });

            if(userNameToSessionResponse.status === 201) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                window.location.href = import.meta.env.VITE_BACKEND_BASE_URL + "/api/eid-saml/login";
            } else {
                setCurrentError("Server meldet: " + userNameToSessionResponse.data);
                if (userNameToSessionResponse.status === 400) {
                    setErrorState(ErrorState.badRequestError);
                } else if (userNameToSessionResponse.status === 500) {
                    setErrorState(ErrorState.serverError);
                } else if (userNameToSessionResponse.status === 404) {
                    setErrorState(ErrorState.notFoundError);
                } else {
                    setErrorState(ErrorState.connectionError);
                }
            }
        } catch(error) {
            setCurrentError("Ein unerwarteter Fehler ist aufgetreten: " + error);
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setCurrentNavigationState(NavigationState.eid_login);
    }, []);

    return(
        <div className={"card p-0"}>
            <div className={"card-header"}>
                <h1 className={"display-5 m-0"}>Login / Authentifizierung mittels Ausweis/eID</h1>
            </div>
            <div className={"card-body"}>
                <p className={"mb-2"}>Bitte geben Sie im folgenden Texteingabefeld den Benutzernamen ein, mit dem Sie sich registriert
                    haben. Verwenden Sie anschließend Ihren Ausweis, um Zugang zu Ihrem Konto zu erhalten. Neben einer PIN müssen Sie sich hierbei keinerlei passwortbasierte Zugangsdaten merken. Stattdessen sind im Ausweis bereits alle kryptografischen Informationen hinterlegt, die der elektronische Ausweisdienst benötigt, um Benutzerinformationen abzurufen.
                    Die Web-Anwendung erhält vom elektronischen Ausweisdienst anschließend nur ein Pseudonym, das für jede Person einzigartig ist und somit auch vonseiten ArmadilLogins verwendet werden kann, um Benutzer voneinander zu unterscheiden.</p>
                <div className={"input-group mb-3"}>
                    <span className={"input-group-text"} id={"userName-addon"}>@</span>
                    <input value={userName}
                           onChange={(userNameChangeEvent) => setUserName(userNameChangeEvent.target.value)}
                           onKeyUp={(keyEvent) => {
                               if (keyEvent.key === "Enter") {
                                   addUserNameToSession();
                               }
                           }}
                           type={"text"}
                           disabled={isLoading}
                           className={"form-control border-primary"} placeholder={"Benutzername"}
                           aria-label={"Benutzername"} aria-describedby={"userName-addon"}
                    />
                </div>
                <button onClick={addUserNameToSession} type={"button"} disabled={isLoading}
                        className={"btn btn-primary mb-3"}>
                    Bestätigen
                </button>
            </div>
            <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError} />
        </div>
    );
}
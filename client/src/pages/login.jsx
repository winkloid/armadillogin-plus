import {browserSupportsWebAuthn} from "@simplewebauthn/browser";
import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorState} from "../types/errorState.js";
import ErrorComponent from "../components/ErrorComponent.jsx";
import AuthenticationCompletion from "../components/AuthenticationCompletion.jsx";
import {Navigate, useLocation, useOutletContext} from "react-router-dom";
import {NavigationState} from "../types/navigationState.js";
import AuthenticationSuccessfulComponent from "../components/AuthenticationSuccessfulComponent.jsx";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function Login() {
    const { state } = useLocation();
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    const [userName, setUserName] = useState("");
    const [authenticationOptions, setAuthenticationOptions] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [fetchingAuthenticationOptionsSuccess, setFetchingAuthenticationOptionsSuccess] = useState(false);
    const [completeAuthenticationSuccess, setCompleteAuthenticationSuccess] = useState(false);
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [timeStampStartWithUserName, setTimeStampStartWithUserName] = useState(null);

    useEffect(() => {
        if(state?.isShortcodeLogin) {
            setCurrentNavigationState(NavigationState.shortcodeAuthorization_shortcodeInput);
        } else {
            setCurrentNavigationState(NavigationState.login);
        }
        // measure authenticationStartTime with start of username input
        if(!timeStampStartWithUserName) {
            setTimeStampStartWithUserName(new Date().getTime());
        }
    }, []);

    const getAuthenticationOptions = async () => {
        setIsLoading(true);

        let optionsResponse;
        try {
            optionsResponse = await axios({
                method: 'post',
                url: import.meta.env.VITE_BACKEND_BASE_URL + '/api/webauthn/authenticationOptions',
                data: {
                    "userName": userName,
                }
            }).then((response) => {
                return response;
            });
        } catch (error) {
            setCurrentError("Verbindungsfehler! Bitte prüfen Sie Ihre Internetverbindung!\n" + error);
            setErrorState(ErrorState.connectionError);
            setIsLoading(false);
            return;
        }

        if(optionsResponse.status === 200) {
            setAuthenticationOptions(optionsResponse.data);
            setErrorState(ErrorState.success);
            setIsLoading(false);
            setFetchingAuthenticationOptionsSuccess(true);
        } else {
            if(optionsResponse.status === 404) {
                setCurrentError(optionsResponse.data);
                setErrorState(ErrorState.notFoundError);
            } else if(optionsResponse.status === 500) {
                setCurrentError(optionsResponse.data);
                setErrorState(ErrorState.serverError);
            } else {
                setCurrentError(optionsResponse.data);
                setErrorState(ErrorState.authenticationOptionsError);
            }
            setIsLoading(false);
        }
    }

    if(!fetchingAuthenticationOptionsSuccess) {
        return (
            <div className={"card p-0"}>
                <div className={"card-header"}>
                    <h1 className={"display-5 m-0"}>Login / Authentifizierung</h1>
                </div>
                <div className={"card-body"}>
                    <p className={"mb-2"}>Bitte geben Sie im folgenden Texteingabefeld den Benutzernamen ein, mit dem Sie sich registriert
                        haben.</p>
                    <div className={"input-group mb-3"}>
                        <span className={"input-group-text"} id={"userName-addon"}>@</span>
                        <input value={userName}
                               onChange={(userNameChangeEvent) => setUserName(userNameChangeEvent.target.value)}
                               onKeyUp={(keyEvent) => {
                                   if (keyEvent.key === "Enter") {
                                       getAuthenticationOptions();
                                   }
                               }}
                               type={"text"}
                               disabled={isLoading}
                               className={"form-control border-primary"} placeholder={"Benutzername"}
                               aria-label={"Benutzername"} aria-describedby={"userName-addon"}
                        />
                    </div>
                    <button onClick={getAuthenticationOptions} type={"button"} disabled={!browserSupportsWebAuthn() || isLoading}
                            className={"btn btn-primary mb-3"}>
                        Bestätigen
                    </button>
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
    } else if(fetchingAuthenticationOptionsSuccess && !completeAuthenticationSuccess) {
        return(<AuthenticationCompletion authenticationOptions = {authenticationOptions} setAuthenticationSuccess = {setCompleteAuthenticationSuccess} authenticationState = {state} timeStampStartWithUserName={timeStampStartWithUserName}/>);
    } else {
        if(state) {
            if(state.isShortcodeLogin) {
                return (<Navigate to={"/shortcodeLogin/authorize"} state={{shortcode: state.shortcode}}/>);
            } else {
                return(<Navigate to={"/private"} />);
            }
        } else {
            return(<AuthenticationSuccessfulComponent privateState={NavigationState.welcome_login_completed}/>);
        }
    }
}
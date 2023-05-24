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

    useEffect(() => {
        if(state?.isShortcodeLogin) {
            if(!fetchingAuthenticationOptionsSuccess) {
                setCurrentNavigationState(NavigationState.shortcodeAuthorization.authentication_userNameInput);
            } else if(fetchingAuthenticationOptionsSuccess && !completeAuthenticationSuccess) {
                setCurrentNavigationState(NavigationState.shortcodeAuthorization.authentication_authenticatorAuthentication);
            } else {
                setCurrentNavigationState(NavigationState.shortcodeAuthorization.authorizationScreen);
            }
        } else {
            if(!fetchingAuthenticationOptionsSuccess) {
                setCurrentNavigationState(NavigationState.login.userNameInput);
            } else if(fetchingAuthenticationOptionsSuccess && !completeAuthenticationSuccess) {
                setCurrentNavigationState(NavigationState.login.authenticatorAuthentication);
            } else {
                setCurrentNavigationState(NavigationState.private);
            }
        }
    })

    const getAuthenticationOptions = async () => {
        setIsLoading(true);

        let optionsResponse;
        try {
            optionsResponse = await axios({
                method: 'post',
                url: import.meta.env.VITE_BACKEND_BASE_URL + '/api/webauthn/authenticationOptions',
                data: {"userName": userName}
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
                        haben. Verwenden Sie anschließend Ihren FIDO2-/WebAuthn-Authenticator, um Zugang zu Ihrem Konto zu
                        erhalten. Durch die Daten, die auf Ihrem persönlichen Authenticator gespeichert sind, kann dieser
                        Ihre Identität dem System gegenüber bestätigen.</p>
                    <div className={"input-group"}>
                        <span className={"input-group-text"} id={"userName-addon"}>@</span>
                        <input value={userName}
                               onChange={(userNameChangeEvent) => setUserName(userNameChangeEvent.target.value)}
                               type={"text"}
                               disabled={isLoading}
                               className={"form-control border-primary"} placeholder={"Benutzername"}
                               aria-label={"Benutzername"} aria-describedby={"userName-addon"}
                        />
                    </div>
                </div>
                <div className={"card-footer"}>
                    <button onClick={getAuthenticationOptions} type={"button"} disabled={!browserSupportsWebAuthn()}
                            className={"btn btn-primary"}>
                        Bestätigen
                    </button>
                </div>
                <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
            </div>
        )
    } else if(fetchingAuthenticationOptionsSuccess && !completeAuthenticationSuccess) {
        return(<AuthenticationCompletion authenticationOptions = {authenticationOptions} setAuthenticationSuccess = {setCompleteAuthenticationSuccess}/>);
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
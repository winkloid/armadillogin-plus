import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorState} from "../../types/errorState.js";
import {Link, useNavigate, useOutletContext} from "react-router-dom";
import Button from "bootstrap/js/src/button.js";
import ErrorComponent from "../../components/ErrorComponent.jsx";
import {NavigationState} from "../../types/navigationState.js";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function EIdRegistration() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    const [currentUserInformation, setCurrentUserInformation] = useState(null);

    const navigate = useNavigate();

    const getCurrentUserInformation = async () => {
        try {
            setIsLoading(true);
            let userInformationResponse = await axios({
                method: "get",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/account/currentUserInformation"
            }).then((response) => {
                return response;
            });
            if(userInformationResponse.status === 200) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                setCurrentUserInformation(userInformationResponse.data);
            } else if(userInformationResponse.status === 401) {
                setCurrentError(userInformationResponse.data);
                setErrorState(ErrorState.notAuthorizedError);
            } else if(userInformationResponse.status === 404) {
                setCurrentError(userInformationResponse.data);
                setErrorState(ErrorState.notFoundError);
            } else {
                setCurrentError(userInformationResponse.data);
                setErrorState(ErrorState.connectionError);
            }
        } catch(error) {
            setCurrentError("Unerwarteter Fehler: " + error);
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
        }
    }

    const linkEIdToAccount = async () => {
        try {
            setIsLoading(true);
            let linkingResponse = await axios({
                method: "put",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/eid-saml/linkEIdToAccount"
            }).then((response) => {
                return response;
            });
            if(linkingResponse.status === 200) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                navigate("/private/eid_registration_completed");
            } else {
                setCurrentError("Server meldet: " + linkingResponse.data);
                if (linkingResponse.status === 401) {
                    setCurrentUserInformation(null);
                    setErrorState(ErrorState.notAuthorizedError);
                } else if(linkingResponse.status === 400) {
                    setErrorState(ErrorState.badRequestError);
                } else if (linkingResponse.status === 500) {
                    setErrorState(ErrorState.serverError);
                } else if (linkingResponse.status === 404) {
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
        setCurrentNavigationState(NavigationState.eid_registration);
        getCurrentUserInformation()
    }, []);

    if(!isLoading) {
        if(!currentUserInformation) {
            return(
                <div className={"card p-0"}>
                    <div className={"card-header bg-danger bg-gradient"}>
                        <h1 className={"display-5 text-white"}>Bestätigung der Verknüpfung Ihres Ausweises</h1>
                    </div>
                    <div className={"card-body bg-danger bg-opacity-10"}>
                        <p>Offenbar sind Sie aktuell nicht eingeloggt. Um Ihren Ausweis zu Ihrem Benutzerkonto hinzufügen zu können, ist ein vorheriger Login in Ihr Benutzerkonto allerdings zwingend erforderlich, da ArmadilLogin PLUS sonst nicht sicherstellen kann, dass Sie dazu berechtigt sind, die Login-Einstellungen eines Benutzerkontos zu ändern.</p>
                        <p>Bitte kehren Sie zur Startseite zurück und loggen Sie sich erneut in Ihr Benutzerkonto ein. Innerhalb Ihres Benutzerkontos erhalten Sie dann die Option, Ihren Ausweis als Loginmöglichkeit hinzuzufügen.</p>
                    </div>
                    <div className={"card-footer bg-danger bg-opacity-25"}>
                        <Link to={"/"} className={"btn btn-primary"}>Navigiere zur Startseite</Link>
                    </div>
                    <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError} />
                </div>
            );
        } else {
            return (
                <div className={"card p-0"}>
                    <div className={"card-header"}>
                        <h1 className={"display-5"}>Bestätigung der Verknüpfung Ihres Ausweises</h1>
                    </div>
                    <div className={"card-body"}>
                        <p>Möchten Sie den Ausweis, mit dem Sie sich soeben gegenüber dem elektronischen Ausweisdienst identifiziert haben, wirklich als Login-Möglichkeit für Ihr Benuterkonto mit dem Benutzernamen <strong>{currentUserInformation?.userName}</strong> hinzufügen? Damit haben Sie in Zukunft die freie Wahl, ob Sie sich über einen Ihrer FIDO2-/WebAuthn-Authenticators oder über Ihren Ausweis in Ihr Benutzerkonto einloggen.</p>
                    </div>
                    <div className={"card-footer"}>
                        <button className={"btn btn-primary m-2 ms-0"} onClick={linkEIdToAccount}>Bestätige die Verknüpfung des Ausweises mit meinem Konto</button>
                        <Link to={"/private/welcome_login_completed"} className={"btn btn-secondary"}>Breche die Verknüpfung des Ausweises ab und navigiere in den Privatbereich</Link>
                    </div>
                    <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError} />
                </div>
            );
        }
    } else {
        return (
            <div className={"card p-0"}>
                <div className={"card-header"}>
                    <h1 className={"display-5"}>Bestätigung der Verknüpfung Ihres Ausweises</h1>
                </div>
                <div className={"card-body"}>
                    <div className={"d-flex justify-content-center"}>
                        <div className="spinner-border text-primary m-5 mb-3" role="status">
                            <span className="visually-hidden">Lade Benutzer-Informationen...</span>
                        </div>
                    </div>
                    <p className={"text-primary mb-5 text-center fst-italic"}>Lade Benutzer-Informationen...</p>
                </div>
                <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError} />
            </div>
        );
    }
}
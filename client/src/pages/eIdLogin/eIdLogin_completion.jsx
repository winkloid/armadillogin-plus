import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorState} from "../../types/errorState.js";
import {NavigationState} from "../../types/navigationState.js";
import {Link} from "react-router-dom";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function EIdLogin_completion() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [authenticationFailed, setAuthenticationFailed] = useState(false);

    const completeAuthentication = async () => {
        try {
            setIsLoading(true);
            let authenticationCompletionResponse = await axios({
                    method: "post",
                    url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/eid-saml/loginCompletion",
                }
            ).then((response) => {
                return response;
            });

            if(authenticationCompletionResponse.status === 201) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                setAuthenticationFailed(false);
            } else {
                setAuthenticationFailed(true);
                setCurrentError("Server meldet: " + authenticationCompletionResponse.data);
                if (authenticationCompletionResponse.status === 400) {
                    setErrorState(ErrorState.badRequestError);
                } else if (authenticationCompletionResponse.status === 500) {
                    setErrorState(ErrorState.serverError);
                } else if (authenticationCompletionResponse.status === 404) {
                    setErrorState(ErrorState.notFoundError);
                } else {
                    setErrorState(ErrorState.connectionError);
                }
            }
        } catch(error) {
            setAuthenticationFailed(true);
            setCurrentError("Ein unerwarteter Fehler ist aufgetreten: " + error);
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        completeAuthentication();
    }, []);

    if(isLoading) {
        return (
            <div className={"card p-0"}>
                <div className={"card-header"}>
                    <h1 className={"display-5 m-0"}>Login abschließen</h1>
                </div>
                <div className={"card-body"}>
                    <div className={"d-flex justify-content-center"}>
                        <div className="spinner-border text-primary m-5 mb-3" role="status">
                            <span className="visually-hidden">Schließe Authentifizierung ab...</span>
                        </div>
                    </div>
                    <p className={"text-primary mb-5 text-center fst-italic"}>Schließe Authentifizierung ab...</p>
                </div>
            </div>
        );
    }
    if(authenticationFailed) {
        return(
            <div className={"card p-0"}>
                <div className={"card-header bg-danger text-white bg-gradient"}>
                    <h1 className={"display-5 m-0"}>Login mittels Ausweis fehlgeschlagen</h1>
                </div>
                <div className={"card-body bg-danger bg-opacity-10"}>
                    <p>Der Login mithilfe Ihres Ausweises ist leider gescheitert. Ein Grund hierfür kann sein, dass Sie noch nicht alle Schritte abgeschlossen haben, die notwendig sind, um sich in Ihr ArmadilLogin-Konto einzuloggen.</p>
                    <p>Bitte stellen Sie sicher, dass Sie den verwendeten Ausweis tatsächlich mit Ihrem Konto verknüpft, den richtigen Benutzernamen angegeben und bereits den Identifizierungsprozess mit dem elektronischen Ausweisdienst durchlaufen haben.</p>
                    <p>Sie können nun entweder den Login-Prozess mittels Ausweis neu starten oder zur Startseite zurückkehren.</p>
                </div>
                <div className={"card-footer bg-danger bg-opacity-25"}>
                    <Link to={"/eId/login"} className={"btn btn-primary m-2 ms-0"}>Wiederhole den Login-Prozess</Link>
                    <Link to={"/"} className={"btn btn-secondary"}>Navigiere zur Startseite</Link>
                </div>
            </div>
        );
    }

    return(
        <div className={"card p-0"}>
            <div className={"card-header bg-success bg-gradient text-white"}>
                <h1 className={"display-5"}>Login mittels Ausweis erfolgreich!</h1>
            </div>
            <div className={"card-body"}>
                <p>Herzlichen Glückwunsch!</p>
                <p className={"mb-0"}>Sie haben sich erfolgreich mittels Ausweis/eID in das Benutzerkonto eingeloggt, das Sie im Registrierungsvorgang erstellt haben. Betätigen Sie die Schaltfläche "Navigiere in meinen persönlichen Bereich", um sich in Ihrem persönlichen Bereich weitere Informationen zu Ihrem Benutzerkonto anzeigen zu lassen.</p>
            </div>
            <div className={"card-footer bg-success bg-opacity-25"}>
                <Link to={"/private/eIdLoginCompleted"}className={"btn btn-primary"}>Navigiere in meinen persönlichen Bereich</Link>
            </div>
        </div>
    );
}
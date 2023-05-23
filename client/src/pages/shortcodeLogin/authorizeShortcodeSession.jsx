import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {ErrorState} from "../../types/errorState.js";
import terminal from "virtual:terminal";
import SessionInformationDisplayComponent
    from "../../components/shortcodeLoginComponents/SessionInformationDisplayComponent.jsx";
import VerifyingChallengeSelectionComponent
    from "../../components/shortcodeLoginComponents/VerifyingChallengeSelectionComponent.jsx";
import ErrorComponent from "../../components/ErrorComponent.jsx";

export default function AuthorizeShortcodeSession() {
    const { state } = useLocation();

    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [sessionInformation, setSessionInformation] = useState(null);
    const [currentShortcode, setCurrentShortcode] = useState((state.shortcode) ? state.shortcode : "");
    const [lastConfirmedShortcode, setLastConfirmedShortcode] = useState((state.shortcode) ? state.shortcode : "");
    const [shortcodeEditActive, setShortcodeEditActive] = useState(false);

    const [currentlySelectedChallengeResponse, setCurrentlySelectedChallengeResponse] = useState(null);

    const [sessionNotFound, setSessionNotFound] = useState(false);
    const [challengeResponseIncorrect, setChallengeResponseIncorrect] = useState(true);
    const [authorizationAttempted, setAuthorizationAttempted] = useState(false);

    useEffect(() => {
        if(state && state.shortcode) {
            fetchShortcodeSessionInformation();
        }
    }, []);

    const fetchShortcodeSessionInformation = async () => {
        setIsLoading(true);
        setLastConfirmedShortcode(currentShortcode);
        try {
            const sessionInformationResponse = await axios({
                method: "post",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/shortcodeLogin/getShortcodeSessionInfo",
                data: {
                    "shortcode": currentShortcode
                }
            });

            if(sessionInformationResponse.status === 200) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                setSessionNotFound(false);
                setSessionInformation(sessionInformationResponse.data);
            } else {
                setCurrentError("Server meldet: " + sessionInformationResponse.data);
                if (sessionInformationResponse.status === 401) {
                    setErrorState(ErrorState.notAuthorizedError);
                } else if (sessionInformationResponse.status === 400) {
                    setErrorState(ErrorState.badRequestError);
                } else if (sessionInformationResponse.status === 500) {
                    setErrorState(ErrorState.serverError);
                } else if (sessionInformationResponse.status === 404) {
                    setSessionNotFound(true);
                } else {
                    setErrorState(ErrorState.connectionError);
                }
            }
        } catch(error) {
            setCurrentError("Verbindungsfehler! Bitte prüfen Sie Ihre Internetverbindung!\n" + error);
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
        }
    }
    const handleShortcodeSessionAuthorization = async () => {
        try {
            setIsLoading(true);
            let authorizationResponse = await axios({
                method: "post",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/shortcodeLogin/setShortcodeSessionAuthorized",
                data: {
                    shortcode: lastConfirmedShortcode,
                    verifyingChallengeResponse: currentlySelectedChallengeResponse
                }
            });

            if(authorizationResponse.status === 200) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                setSessionNotFound(false);
                setChallengeResponseIncorrect(false);
            } else {
                setCurrentError("Server meldet: " + authorizationResponse.data);
                if (authorizationResponse.status === 401) {
                    setErrorState(ErrorState.notAuthorizedError);
                } else if (authorizationResponse.status === 400) {
                    setErrorState(ErrorState.badRequestError);
                } else if (authorizationResponse.status === 500) {
                    setErrorState(ErrorState.serverError);
                } else if (authorizationResponse.status === 404) {
                    setSessionNotFound(true);
                } else if(authorizationResponse.status === 403) {
                    setChallengeResponseIncorrect(true);
                } else {
                    setErrorState(ErrorState.connectionError);
                }
            }
        } catch(error) {
            setCurrentError("Verbindungsfehler! Bitte prüfen Sie Ihre Internetverbindung!\n" + error);
            setErrorState(ErrorState.connectionError);
        } finally {
            setAuthorizationAttempted(true);
            setIsLoading(false);
        }
    }

    if(!state) {
        return(
            <div className="card p-0 mb-3">
                <div className="card-header bg-danger text-white">
                    <h1 className={"display-5 m-0 p-0"}>Kein Code gefunden</h1>
                </div>
                <div className={"card-body"}>
                    <p>Offenbar haben Sie noch keinen Shortcode eingegeben. Um dies zu tun, besuchen Sie bitte <Link to={"/shortcode"}>die entsprechende Shortcode-Eingabeseite</Link> und geben Sie den Shortcode dort ein, den Sie zuvor auf einem anderen Gerät generiert haben.</p>
                    <p>Falls Sie einen neuen Code generieren lassen möchten, um eine Sitzung über ein anderes Gerät zu autorisieren, können Sie dies <Link to={"/shortcodeLogin/generateShortcode"}>hier</Link> tun.</p>
                </div>
                <div className={"card-footer"}>
                    <div className={"row"}>
                        <Link className={"btn btn-primary col m-2"} to={"/shortcode"}>Navigiere zur <strong>Code-Eingabeseite</strong></Link>
                        <Link className={"btn btn-primary col m-2"} to={"/shortcodeLogin/generateShortcode"}>Navigiere zur <strong>Code-Generierungsseite</strong></Link>
                    </div>
                </div>
            </div>
        );
    } else {
        if(isLoading) {
            return(
                <p>Lade Shortcode-Sitzungsinformationen...</p>
            );
        } else {
            if (sessionNotFound) {
                return(
                    <div>
                        <div className="card p-0 mb-3">
                            <div className="card-header bg-danger text-white">
                                <h1 className={"display-5 m-0 p-0"}>Shortcode-Sitzung mit dem Code {lastConfirmedShortcode} nicht gefunden.</h1>
                            </div>
                            <div className={"card-body"}>
                                <p>Eine Sitzung mit dem von Ihnen angegebenen Sitzungs-Code <code>{lastConfirmedShortcode}</code> konnte nicht gefunden werden. Bitte generieren Sie entweder einen neuen Shortcode auf dem zu autorisierenden Gerät und tragen Sie ihn in das untenstehende Eingabefeld ein oder überprüfen Sie den bereits angegebenen Code auf Tippfehler. Bestätigen Sie die Eingabe anschließend mit "Bestätigen".</p>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">🔡</span>
                                    <div className="form-floating">
                                        <input type="text"
                                               className="form-control"
                                               id="shortcodeInput"
                                               value={currentShortcode}
                                               onChange={shortcodeInputChange => setCurrentShortcode(shortcodeInputChange.target.value)}
                                               placeholder={"Login-Code"}
                                               aria-label={"Code Ihrer Kurzcode-Sitzung"}/>
                                        <label htmlFor="shortcodeInput">Login-Code</label>
                                    </div>
                                    <button type={"button"} className={"btn btn-primary"} onClick={fetchShortcodeSessionInformation}>
                                        Bestätigen
                                    </button>
                                </div>
                            </div>
                        </div>
                        <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
                    </div>
                );
            } else if(authorizationAttempted) {
                if(challengeResponseIncorrect) {
                    return(
                        <div className={"card p-0 bg-danger text-white"}>
                            <div className={"card-header"}>
                                <h1 className={"mx-1 display-5"}>Autorisierung fehlgeschlagen</h1>
                            </div>
                            <div className={"card-body"}>
                                <p className={"mx-1"}>Leider war die ausgewählte Zeichenkette nicht korrekt oder die Verbindung zum Server is fehlgeschlagen. Das zu autorisierende Gerät wurde daher nicht autorisiert. Bitte überprüfen Sie den angegebenen Sitzungscode und die Zeichenkette, die zum Bestätigen der Autorisierung erforderlich ist und versuchen Sie es erneut.</p>
                            </div>
                            <div className={"card-footer"}>
                                <div className={"row mx-1"}>
                                    <button className={"btn btn-primary col me-1"} type={"button"} onClick={() => {
                                        setAuthorizationAttempted(false);
                                    }}>Navigiere zurück zur Geräte-Autorisierungsseite</button>
                                    <Link className={"btn btn-secondary col ms-1"} to={"/"}>Breche Geräte-Autorisierung ab und kehre zur Startseite zurück</Link>
                                </div>
                            </div>
                        </div>
                    );
                } else {
                    return(
                        <div className={"card p-0 bg-success text-white"}>
                            <div className={"card-header"}>
                                <h1 className={"mx-1 display-5"}>Autorisierung erfolgreich!</h1>
                            </div>
                            <div className={"card-body"}>
                                <p className={"mx-1"}>Sie haben die richtige Zeichenkette ausgewählt und damit die Autorisierung des Geräts mit dem Sitzungscode {lastConfirmedShortcode} erfolgreich bestätigt.</p>
                            </div>
                            <div className={"card-footer"}>
                                <div className={"row mx-1"}>
                                    <Link className={"btn btn-primary col me-1"} to={"/private"}>Navigiere in meinen Privatbereich</Link>
                                    <Link className={"btn btn-secondary col ms-1"} to={"/"}>Kehre zur Startseite zurück</Link>
                                </div>
                            </div>
                        </div>
                    );
                }
            } else {
                return (
                    <div>
                        <div className="card p-0 mb-3">
                            <div className="card-header">
                                <h1 className={"display-5 m-0 p-0"}>Geräte-Autorisierung</h1>
                            </div>
                            <div className={"card-body"}>
                                <h2 className={"display-6 mx-1"}>Geräte-Informationen des zu autorisierenden Geräts</h2>
                                {!shortcodeEditActive &&
                                    <div>
                                        <p className={"mx-1"}>Sie haben folgenden Sitzungs-Code eingegeben: </p>
                                        <div className={"row mx-1 d-inline-flex"}>
                                            <kbd className={"font-monospace fs-1 col"}>{currentShortcode}</kbd>
                                            <button className={"btn btn-primary col mx-2 fw-semibold"} type={"button"} onClick={() => setShortcodeEditActive(true)}>Bearbeite Shortcode</button>
                                        </div>
                                    </div>
                                }
                                {shortcodeEditActive &&
                                    <div className={"mx-1"}>
                                        <p>Hier können Sie Ihren Sitzungscode bei Bedarf bearbeiten - aktuell lautet ihr Sitzungs-Code <code>{lastConfirmedShortcode}</code></p>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text">🔡</span>
                                            <div className="form-floating">
                                                <input type="text"
                                                       className="form-control"
                                                       id="shortcodeInput"
                                                       value={currentShortcode}
                                                       onChange={shortcodeInputChange => setCurrentShortcode(shortcodeInputChange.target.value)}
                                                       placeholder={"Login-Code"}
                                                       aria-label={"Code Ihrer Kurzcode-Sitzung"}/>
                                                <label htmlFor="shortcodeInput">Login-Code</label>
                                            </div>
                                            <button type={"button"} className={"btn btn-primary"} onClick={() => {
                                                setShortcodeEditActive(false);
                                                fetchShortcodeSessionInformation();
                                            }}>
                                                Bestätigen
                                            </button>
                                        </div>
                                    </div>
                                }
                                <p className={"mx-1 mt-3"}>Sie sind demnach im Begriff, ein Gerät zu autorisieren, das folgende
                                    Informationen
                                    zusammen mit seiner Autorisierungs-Anfrage gesendet hat.</p>
                                <div className={"alert alert-danger mx-1"}>
                                    <p>Bitte beachten Sie, dass diese Informationen manipuliert sein könnten und
                                        autorisieren
                                        Sie nur Geräte, für die Sie den Autorisierungscode entweder selbst generiert haben
                                        oder
                                        für die Sie anderweitig sicherstellen können, dass es sich tatsächlich um diejenigen
                                        Geräte handelt, die Sie autorisieren möchten.</p>
                                    <p>Die hier angezeigten Geräteinformationen dienen lediglich einer erneuten Überprüfung,
                                        damit Sie sicherstellen können, dass Sie sich bei der Code-Eingabe nicht vertippt
                                        haben.</p>
                                    <p className={"fw-bold"}>Ein über ein autorisiertes Gerät angemeldeter Benutzer besitzt
                                        dieselben Berechtigungen für Ihr Benutzerkonto wie Sie selbst!</p>
                                </div>
                                {sessionInformation?.clientInfo &&
                                    <SessionInformationDisplayComponent sessionInformation={sessionInformation}/>
                                }
                                {!sessionInformation?.clientInfo &&
                                    <div className={"mx-1 alert alert-secondary"}>
                                        <p>Es scheinen keine Informationen über das zu autorisierende Gerät vorzuliegen oder
                                            die
                                            Informationen konnten nicht geladen werden.</p>
                                    </div>
                                }
                            </div>
                            {sessionInformation?.verifyingChallenges &&
                                <div className={"card-footer"}>
                                    <h2 className={"display-6 mx-1"}>Auswahl der richtigen Zeichenkette</h2>
                                    <p className={"mx-1"}>Auf der Seite zur Generierung eines neuen Sitzungs-Codes wurde Ihnen eine Zeichenkette angezeigt. Wählen Sie hier die richtige aus.</p>
                                    <p className={"mx-1 fw-semibold"}>Sie erkennen keine der Zeichenketten wieder? Überprüfen Sie den eingegebenen Sitzungs-Code erneut. Möglicherweise haben Sie sich vertippt! Sie können den Code oben auf dieser Seite bearbeiten.</p>
                                    <VerifyingChallengeSelectionComponent sessionInformation={sessionInformation} currentlySelectedChallengeResponse={currentlySelectedChallengeResponse} setCurrentlySelectedChallengeResponse={setCurrentlySelectedChallengeResponse}/>
                                    <div className={"row mx-1"}>
                                        <button className={"btn btn-primary col"} type={"button"} data-bs-toggle="modal" data-bs-target="#confirmAuthorizationModal" disabled={isLoading}>Bestätige die Auswahl und autorisiere das Gerät mit dem Sitzungscode <strong>{lastConfirmedShortcode}</strong></button>

                                        <div className="modal warning" tabIndex="-1" id={"confirmAuthorizationModal"}>
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header bg-warning">
                                                        <h5 className="modal-title">Achtung!</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                                aria-label="Schließen"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <p>Bitte versichern Sie sich, dass Sie nur Geräte für den Zugang zu Ihrem Benutzerkonto autorisieren, für die Sie den Autorisierungscode entweder selbst generiert haben
                                                            oder für die Sie anderweitig sicherstellen können, dass es sich tatsächlich um diejenigen
                                                            Geräte handelt, die Sie autorisieren möchten. <strong>Ein über ein autorisiertes Gerät angemeldeter Benutzer besitzt dieselben Berechtigungen für Ihr Benutzerkonto wie Sie selbst!</strong></p>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary"
                                                                data-bs-dismiss="modal">Abbrechen
                                                        </button>
                                                        <button type="button" className="btn btn-warning" onClick={handleShortcodeSessionAuthorization} data-bs-dismiss="modal">Bestätige die Autorisierung</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
                    </div>
                );
            }
        }
    }
}
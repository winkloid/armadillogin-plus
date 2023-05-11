import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {ErrorState} from "../../types/errorState.js";
import terminal from "virtual:terminal";
import SessionInformationDisplayComponent
    from "../../components/shortcodeLoginComponents/SessionInformationDisplayComponent.jsx";

export default function AuthorizeShortcodeSession() {
    const { state } = useLocation();

    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [sessionInformation, setSessionInformation] = useState(null);
    const [currentShortcode, setCurrentShortcode] = useState((state.shortcode) ? state.shortcode : "");

    const [sessionNotFound, setSessionNotFound] = useState(false);

    const [currentServerResponse, setCurrentServerResponse] = useState(null);

    useEffect(() => {
        if(state && state.shortcode) {
            fetchShortcodeSessionInformation();
        }
    }, []);

    const fetchShortcodeSessionInformation = async () => {
        setIsLoading(true);
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
        let authorizationResponse = axios({
            method: "post",
            url: "http://localhost:5000/api/shortcodeLogin/setShortcodeSessionAuthorized",
            data: {
                shortcode: "dvu656",
                verifyingChallengeResponse: "🚶🆎↗️"
            }
        });
        setCurrentServerResponse(authorizationResponse.data);
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
                    <div className="card p-0 mb-3">
                        <div className="card-header bg-danger text-white">
                            <h1 className={"display-5 m-0 p-0"}>Shortcode-Sitzung mit dem Code {state.shortcode} nicht gefunden.</h1>
                        </div>
                        <div className={"card-body"}>
                            <p>Eine Sitzung mit dem von Ihnen angegebenen Sitzungs-Code <code>{state.shortcode}</code> konnte nicht gefunden werden. Bitte generieren Sie entweder einen neuen Shortcode auf dem zu autorisierenden Gerät und tragen Sie ihn in das untenstehende Eingabefeld ein oder überprüfen Sie den bereits angegebenen Code auf Tippfehler. Bestätigen Sie die Eingabe anschließend mit "Bestätigen".</p>
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
                );
            } else {
                return (
                    <div className="card p-0 mb-3">
                        <div className="card-header">
                            <h1 className={"display-5 m-0 p-0"}>Geräte-Autorisierung</h1>
                        </div>
                        <div className={"card-body"}>
                            <h2 className={"display-6 mx-1"}>Geräte-Informationen des zu autorisierenden Geräts</h2>
                            <p className={"mx-1"}>Sie sind im Begriff, ein Gerät zu autorisieren, das folgende
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
                                <div className={"alert alert-secondary"}>
                                    <p>Es scheinen keine Informationen über das zu autorisierende Gerät vorzuliegen oder
                                        die
                                        Informationen konnten nicht geladen werden.</p>
                                </div>
                            }
                        </div>
                    </div>
                );
            }
        }
    }
}
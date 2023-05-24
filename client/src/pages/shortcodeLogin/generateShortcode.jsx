import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorState} from "../../types/errorState.js";
import ShortcodeAsTextComponent from "../../components/shortcodeLoginComponents/ShortcodeAsTextComponent.jsx";
import terminal from "virtual:terminal";
import {Link, Navigate, useOutletContext} from "react-router-dom";
import ShortcodeAsQrComponent from "../../components/shortcodeLoginComponents/ShortcodeAsQrComponent.jsx";
import ErrorComponent from "../../components/ErrorComponent.jsx";
import {NavigationState} from "../../types/navigationState.js";
import AuthenticationSuccessfulComponent from "../../components/AuthenticationSuccessfulComponent.jsx";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function GenerateShortcode () {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);

    const [shortcodeInformation, setShortcodeInformation] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [hookAlreadyCalled, setHookAlreadyCalled] = useState(false);

    useEffect( () => {
        fetchShortcode();
    }, []);

    useEffect(() => {
        setCurrentNavigationState(NavigationState.shortcodeGeneration);
    }, []);

    const fetchShortcode = async () => {
        setIsLoading(true);
        try {
            const shortcodeResponse = await axios({
                method: "get",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/shortcodeLogin/setShortcode"
            });

            // handling of different HTTP statuses
            if(shortcodeResponse.status === 201) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                setShortcodeInformation(shortcodeResponse.data);
                getNotifiedOnAuthorization();
            } else if(shortcodeResponse.status === 500) {
                setCurrentError(shortcodeResponse.data);
                setErrorState(ErrorState.serverError);
            } else {
                setCurrentError("Unerwarteter Fehler bei der Kommunikation mit dem Server: " + shortcodeResponse.data);
                setErrorState(ErrorState.notFoundError);
            }
        } catch (error) {
            setCurrentError("Verbindungsfehler! Bitte prüfen Sie Ihre Internetverbindung!\n" + error);
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
        }
    }

    const getNotifiedOnAuthorization = async () => {
        try {
            const authorizationResponse = await axios({
                method: "get",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/shortcodeLogin/getShortcodeAuthorizationNotification"
            });
            if(authorizationResponse.status === 200) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                setIsAuthorized(true);
            } else if(authorizationResponse.status === 400) {
                setCurrentError("Ungültige Anfrage an den Server: " + authorizationResponse.data);
                setErrorState(ErrorState.badRequestError);
            } else if(authorizationResponse.status === 500) {
                setCurrentError("Server meldet: " + authorizationResponse.data);
                setErrorState(ErrorState.serverError);
            } else if(authorizationResponse.status === 404) {
                setCurrentError("Shortcode nicht gefunden: " + authorizationResponse.data);
                setErrorState(ErrorState.notFoundError);
            } else if(authorizationResponse.status === 408) {
                setCurrentError("Server meldet: " + authorizationResponse.data);
                setErrorState(ErrorState.timeoutError);
            } else if(authorizationResponse.status === 410) {
                setCurrentError("Server meldet: " + authorizationResponse.data);
                setErrorState(ErrorState.timeoutError);
            } else {
                setCurrentError("Ein unerwarteter Fehler ist aufgetreten, als abgerufen werden sollte, ob dieses Gerät bereits authorisiert wurde.");
                setErrorState(ErrorState.connectionError);
            }
        } catch(error) {
            setCurrentError("Verbindungsfehler! Bitte prüfen Sie Ihre Internetverbindung!\n" + error);
            setErrorState(ErrorState.connectionError);
        }
    }

    if(!isAuthorized) {
        return (
            <div className="card p-0 mb-3">
                <div className="card-header col">
                    <h1 className={"display-5 m-0"}>Ihr Shortcode</h1>
                </div>
                <div className="card-body">
                    <p>Mit diesem Code können Sie diese Sitzung über ein anderes Gerät autorisieren. Dabei
                        stehen Ihnen verschiedene Möglichkeiten offen:</p>
                    {isLoading &&
                        <div className={"d-flex justify-content-center"}>
                            <div className="spinner-border text-primary m-5" role="status">
                                <span className="visually-hidden">Lade Shortcode...</span>
                            </div>
                        </div>
                    }
                    {(shortcodeInformation !== null) &&
                        <div>
                            <div className={"row mx-1"}>
                                <ShortcodeAsQrComponent shortcodeInformation={shortcodeInformation}/>
                                <ShortcodeAsTextComponent shortcodeInformation={shortcodeInformation}/>
                            </div>
                        </div>
                    }
                    {!isLoading && (shortcodeInformation === null) &&
                        <div className="alert alert-danger" role="alert">
                            Die Informationen der Shortcode-Sitzung konnten noch nicht abgerufen werden. Bitte
                            prüfen Sie Ihre Internetverbindung.
                        </div>
                    }
                </div>
                {(shortcodeInformation !== null) &&
                    <div className={"card-footer"}>
                        <p className={"display-6"}>Wählen Sie bei der Autorisierung folgende Zeichenkette
                            aus</p>
                        <div className={"text-center m-3"}><span className={"display-1"} style={{
                            "paddingTop": "1rem",
                            "letterSpacing": "1rem"
                        }}>{shortcodeInformation.verifyingString}</span></div>
                        <div className={"card m-0 mx-1 border-info card-body"}>
                            <span className={"visually-hidden"}>Information zur Bestätigung der Autorisierung mittels Zeichenkette</span>
                            <p className={"m-0 p-0 "}>Um sicherzustellen, dass Sie nicht versehentlich (z.B.
                                aufgrund eines Tippfehlers bei der Codeeingabe) ein falsches Gerät für den
                                Zugriff auf Ihr Benutzerkonto autorisieren, werden Sie während der Autorisierung
                                nach einer Zeichenkette gefragt. Nur, wenn Sie diejenige wählen, die hier angezeigt wird, wird die Autorisierung akzeptiert.</p>
                        </div>
                        <div className={"card mt-3 mx-1 border-primary p-3"}>
                            <div className={"card-body d-flex justify-content-center"}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Warte auf Autorisierung dieses Geräts mithilfe des Shortcodes...</span>
                                </div>
                            </div>
                            <p className={"text-primary mb-2 text-center fst-italic"}>...Warte auf
                                Autorisierung...</p>
                            <p className={"text-primary m-0"}>Verwenden Sie den angezeigten Text-Code oder den
                                QR-Code wie beschrieben, um diese Sitzung über ein anderes Gerät zu
                                autorisieren. <strong>Sie werden anschließend hier automatisch eingeloggt.</strong></p>
                        </div>

                        <div className={"card mt-3 mx-1 border-danger p-0"}>
                            <div className={"card-body"}>
                                <p className={"text-danger"}>Die automatische Weiterleitung hat nicht funktioniert? Kein Problem! Betätigen Sie die folgende Schaltfläche, um in Ihren persönlichen Bereich weitergeleitet zu werden, <strong>nachdem</strong> Sie diese Sitzung auf dem anderen Gerät autorisiert haben.</p>
                                <Link to={"/private"} className={"btn btn-secondary opacity-50"}>Navigiere in meinen Privatbereich <strong>(nur auswählen, wenn Weiterleitungsprobleme auftreten)</strong></Link>
                            </div>
                        </div>
                    </div>
                }
                <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
            </div>
        );
    } else {
        return(<AuthenticationSuccessfulComponent privateState={NavigationState.welcome_shortcode_completed}/>);
    }
}
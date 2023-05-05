import {useEffect, useState} from "react";
import axios from "axios";
import {ErrorState} from "../../types/errorState.js";
import ShortcodeAsTextComponent from "../../components/shortcodeLoginComponents/ShortcodeAsTextComponent.jsx";
import terminal from "virtual:terminal";

export default function GenerateShortcode () {
    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);

    const [shortcodeInformation, setShortcodeInformation] = useState(null);

    useEffect( () => {
        fetchShortcode();
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

    return(
        <div className={"container"}>
            <div className={"row"}>
                <div className="card p-0 mb-3">
                    <div className="card-header col">
                        <h1 className={"display-5 m-0"}>Ihr Shortcode</h1>
                    </div>
                    <div className="card-body">
                        <p>Mit diesem Code können Sie diese Sitzung über ein anderes Gerät autorisieren. Dabei stehen Ihnen verschiedene Möglichkeiten offen:</p>
                        {isLoading &&
                        <div className={"d-flex justify-content-center"}>
                            <div className="spinner-border text-primary m-5"  role="status">
                                <span className="visually-hidden">Lade Shortcode...</span>
                            </div>
                        </div>
                        }
                        {(shortcodeInformation !== null) &&
                            <div className={"row"}>
                                <ShortcodeAsTextComponent shortcodeInformation = {shortcodeInformation}/>
                            </div>
                        }
                        {!isLoading && (shortcodeInformation === null) &&
                            <div className="alert alert-danger" role="alert">
                                Die Informationen der Shortcode-Sitzung konnten noch nicht abgerufen werden. Bitte prüfen Sie Ihre Internetverbindung.
                            </div>
                        }
                    </div>
                    {(shortcodeInformation !== null) &&
                        <div className={"card-footer"}>
                            <p className={"display-6"}>Wählen Sie bei der Autorisierung folgende Zeichenkette aus</p>
                            <div className={"text-center m-3"}> <span className={"display-1"} style={{"paddingTop": "1rem", "letterSpacing": "1rem"}}>{shortcodeInformation.verifyingString}</span></div>
                            <div className={"card m-0 border-info card-body"}>
                                <span className={"visually-hidden"}>Information zur Bestätigung der Autorisierung mittels Zeichenkette</span>
                                <p className={"m-0 p-0 "}>Um sicherzustellen, dass Sie nicht versehentlich (z.B. aufgrund eines Tippfehlers bei der Codeeingabe) ein falsches Gerät für den Zugriff auf Ihr Benutzerkonto autorisieren, werden Sie während der Autorisierung nach einer Zeichenkette gefragt. Nur, wenn Sie diejenige wählen, die im Folgenden angezeigt wird, wird die Autorisierung akzeptiert.</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
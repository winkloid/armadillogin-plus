import {useState} from "react";
import axios from "axios";
import {ErrorState} from "../../types/errorState.js";
import terminal from "virtual:terminal";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function AccountSettings({setIsLoggedIn, setAccountDeletionTried, setAccountDeletionSuccess, setErrorState, setCurrentError}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogOut = async () => {
        setIsLoading(true);
        try {
            await axios({
                method: "post",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/account/logOutUser"
            });
            setIsLoggedIn(false);
            setErrorState(ErrorState.success);
        } catch(error) {
            setCurrentError("Fehler bei der Herstellung einer Verbindung zum Backend-Server. Bitte überprüfen Sie Ihre Internetverbindung: \n" + error);
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsLoading(false);
        }
    }

    const handleAccountDeletion = async () => {
        setIsLoading(true);
        try {
            const accountDeletionResponse = await axios({
                method: "DELETE",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/account/deleteUser"
            }).then((response) => {
                return response;
            });
            if (accountDeletionResponse.status === 204) {
                setCurrentError("");
                setErrorState(ErrorState.success);
                setAccountDeletionSuccess(true);
                setIsLoggedIn(false);
            } else if (accountDeletionResponse.status === 401) {
                setIsLoggedIn(false);
            } else if (accountDeletionResponse.status === 500) {
                setCurrentError("Internes Serverproblem: " + accountDeletionResponse.data);
                setErrorState(ErrorState.serverError);
            } else {
                setCurrentError("Unerwarteter Fehler beim Herstellen einer Verbindung zum Backend-Server: " + accountDeletionResponse.data);
                setCurrentError(ErrorState.connectionError);
            }
            setIsLoading(false);
            setAccountDeletionTried(true);
        } catch(error) {
            setCurrentError("Fehler bei der Verbindung zum Backend-Server. Bitte überprüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
            setIsLoading(false);
            setAccountDeletionTried(true);
        }
    }

    return (
        <div className={"container"}>
            <div className="row">
                <div className="card p-0 mb-3">
                    <div className="card-header col">
                        <h4>Benutzerkonto-Einstellungen</h4>
                    </div>
                    <div className={"card-body"}>
                        {/* TODO: Benutzername mit angeben */}
                        <p>Aktuell sind Sie in Ihrem persönlichen Bereich angemeldet.</p>
                    </div>
                    <div className={"card-footer"}>
                        <h5 className={"my-3"}>Optionen</h5>
                        <div className={"row"}>
                            <div className={"card p-0 ms-md-2 me-md-1 mb-2 col-sm col-lg"}>
                                <div className={"card-header text-bg-warning"}>
                                    <h6 className={"m-0"}>Ausloggen</h6>
                                </div>
                                <div className={"card-body m-0"}>
                                    <p>Wenn Sie Ihren Benutzerbereich verlassen und die aktuelle Sitzung beenden möchten, können Sie sich hier abmelden. Nach der Abmeldung müssen Sie sich erneut anmelden, um in Ihren persönlichen Benutzerbereich zurückkehren zu können. Durch diesen Vorgang werden keine Daten aus Ihrem Benutzerkonto gelöscht.</p>
                                </div>
                                <div className={"card-footer"}>
                                    <button className={"btn btn-warning"} type={"button"} onClick={handleLogOut}>Melde mich ab</button>
                                </div>
                            </div>
                            <div className={"card p-0 me-md-2 ms-md-1 mb-2 col-sm col-lg"}>
                                <div className={"card-header text-bg-danger"}>
                                    <h6 className={"m-0"}>Konto löschen</h6>
                                </div>
                                <div className={"card-body m-0"}>
                                    <p>Hier können Sie Ihr Benutzerkonto bei Bedarf löschen. Dabei werden alle mit Ihrem Konto
                                        verknüpften Informationen, Authenticators und alle bis dahin aktiven Sessions gelöscht.
                                        Der bisher mit Ihrem Konto verknüpfte Benutzername ist anschließend wieder verfügbar und
                                        kann zum Anlegen eines neuen Benutzerkontos verwendet werden.</p>
                                </div>
                                <div className={"card-footer"}>
                                    <button className={"btn btn-danger"} type={"button"} onClick={handleAccountDeletion}>Lösche
                                        mein Benutzerkonto und alle verknüpften Daten
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
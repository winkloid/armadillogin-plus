import axios from "axios";
import {ErrorState} from "../../types/errorState.js";
import {NavigationState} from "../../types/navigationState.js";
import {useOutletContext} from "react-router-dom";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function AccountSettings({setIsLoggedIn, setAccountDeletionTried, setAccountDeletionSuccess, setErrorState, setCurrentError, isGlobalLoading, setIsGlobalLoading, privateState}) {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    const handleLogOut = async () => {
        setIsGlobalLoading(true);
        try {
            await axios({
                method: "post",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/account/logOutUser"
            });

            // check which value was assigned to privateState inside AuthenticationSuccessfulComponent
            if(privateState === "welcome_login_completed") {
                setCurrentNavigationState(NavigationState.welcome_login_completed);
            } else if(privateState === "welcome_shortcode_completed") {
                setCurrentNavigationState(NavigationState.welcome_shortcode_completed);
            } else if(privateState === "eid_registration_completed") {
                setCurrentNavigationState(NavigationState.welcome_eid_registration_completed);
            } else if(privateState === "eid_login_completed"){
                setCurrentNavigationState(NavigationState.welcome_eid_login_completed);
            } else {
                setCurrentNavigationState(NavigationState.welcome_init);
            }
            setIsLoggedIn(false);
            setErrorState(ErrorState.success);
        } catch(error) {
            setCurrentError("Fehler bei der Herstellung einer Verbindung zum Backend-Server. Bitte überprüfen Sie Ihre Internetverbindung: \n" + error);
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsGlobalLoading(false);
        }
    }

    const handleAccountDeletion = async () => {
        setIsGlobalLoading(true);
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
                setCurrentNavigationState(NavigationState.welcome_init);
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
            setIsGlobalLoading(false);
            setAccountDeletionTried(true);
        } catch(error) {
            setCurrentError("Fehler bei der Verbindung zum Backend-Server. Bitte überprüfen Sie Ihre Internetverbindung.");
            setErrorState(ErrorState.connectionError);
            setIsGlobalLoading(false);
            setAccountDeletionTried(true);
        }
    }

    return (
        <div className={"card p-0 mb-3 " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "border-primary" : "border-secondary")}>
            <div className={"card-header " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "bg-primary border-primary" : "border-secondary")}>
                <h4 className={"m-0 " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "text-white" : "")}>Benutzerkonto-Einstellungen</h4>
            </div>
            <div className={"card-body " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "bg-primary bg-opacity-10" : "")}>
                <p>Aktuell sind Sie in Ihrem persönlichen Bereich angemeldet.</p>
            </div>
            <div className={"card-footer " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "bg-primary bg-opacity-25" : "")}>
                <h5 className={"mb-2"}>Optionen</h5>
                <div className={"row m-0"}>
                    <div className={"card p-0 me-sm-1 mb-2 col-sm col-lg " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "border-primary" : "")}>
                        <div className={"card-header " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "bg-primary text-white" : "bg-warning")}>
                            <h6 className={"m-0"}>Ausloggen</h6>
                        </div>
                        <div className={"card-body " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "bg-primary bg-opacity-10" : "bg-warning bg-opacity-10")}>
                            <p>Wenn Sie Ihren Benutzerbereich verlassen und die aktuelle Sitzung beenden möchten, können Sie sich hier abmelden. Nach der Abmeldung müssen Sie sich erneut anmelden, um in Ihren persönlichen Benutzerbereich zurückkehren zu können. Durch diesen Vorgang werden keine Daten aus Ihrem Benutzerkonto gelöscht.</p>
                        </div>
                        <div className={"card-footer " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "bg-primary bg-opacity-25" : "bg-warning bg-opacity-25")}>
                            <button className={"btn " + ((currentNavigationState === NavigationState.private_eid_registration_completed || currentNavigationState === NavigationState.private_login_completed) ? "btn-primary" : "btn-warning")} type={"button"} onClick={handleLogOut} disabled={isGlobalLoading}>Melde mich ab</button>
                        </div>
                    </div>
                    <div className={"card p-0 ms-sm-1 mb-2 col-sm col-lg"}>
                        <div className={"card-header bg-danger text-white"}>
                            <h6 className={"m-0"}>Konto löschen</h6>
                        </div>
                        <div className={"card-body m-0 bg-danger bg-opacity-10"}>
                            <p>Hier können Sie Ihr Benutzerkonto bei Bedarf löschen. Dabei werden alle mit Ihrem Konto
                                verknüpften Informationen, Authenticators und alle bis dahin aktiven Sessions gelöscht.
                                Der bisher mit Ihrem Konto verknüpfte Benutzername ist anschließend wieder verfügbar und
                                kann zum Anlegen eines neuen Benutzerkontos verwendet werden.</p>
                        </div>
                        <div className={"card-footer bg-danger bg-opacity-25"}>
                            <button className={"btn btn-danger"} type={"button"} data-bs-toggle="modal" data-bs-target="#confirmAccountDeletionModal" disabled={isGlobalLoading}>Lösche
                                mein Benutzerkonto und alle verknüpften Daten
                            </button>

                            <div className="modal warning" tabIndex="-1" id={"confirmAccountDeletionModal"}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header bg-warning">
                                            <h5 className="modal-title">Möchten Se Ihr Konto und alle dazugehörigen Daten wirklich löschen?</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                    aria-label="Schließen"></button>
                                        </div>
                                        <div className="modal-body">
                                            <p>Falls Sie Ihr Konto und alle dazugehörigen Informationen und Sitzungen tatsächlich aus der Datenbank von ArmadilLogin PLUS löschen möchten, bestätigen Sie dies durch Betätigung der Schaltfläche "Lösche mein Konto und alle dazugehörigen Daten". Andernfalls schließen Sie diesen Dialog durch Betätigung der Schaltfläche "Abbrechen".</p>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary"
                                                    data-bs-dismiss="modal">Abbrechen
                                            </button>
                                            <button type="button" className="btn btn-warning" onClick={handleAccountDeletion} data-bs-dismiss="modal">Lösche mein Konto und alle dazugehörigen Daten</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
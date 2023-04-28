import {useState} from "react";
import axios from "axios";
import {ErrorState} from "../../types/errorState.js";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function AccountSettings({setIsLoggedIn, setAccountDeletionTried, setAccountDeletionSuccess}) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");

    const handleAccountDeletion = async () => {
        setIsLoading(true);
        try {
            const accountDeletionResponse = await axios({
                method: "DELETE",
                url: "http://localhost:5000" + "/api/account/deleteUser"
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
                setCurrentError(accountDeletionResponse.data);
                setErrorState(ErrorState.serverError);
            } else {
                setCurrentError(accountDeletionResponse.data);
                setCurrentError(ErrorState.connectionError);
            }
            setIsLoading(false);
            setAccountDeletionTried(true);
        } catch(error) {
            setCurrentError(error);
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
                        <h6 className={"text-danger"}>Konto löschen</h6>
                        <p>Hier können Sie Ihr Benutzerkonto bei Bedarf löschen. Dabei werden alle mit Ihrem Konto
                            verknüpften Informationen, Authenticators und alle bis dahin aktiven Sessions gelöscht.
                            Der bisher mit Ihrem Konto verknüpfte Benutzername ist anschließend wieder verfügbar und
                            kann zum Anlegen eines neuen Benutzerkontos verwendet werden.</p>
                        <button className={"btn btn-danger"} type={"button"} onClick={handleAccountDeletion}>Lösche
                            mein Benutzerkonto und alle verknüpften Daten
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
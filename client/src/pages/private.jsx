import AuthenticatorSettings from "../components/privatePageComponents/AuthenticatorSettingsComponent.jsx";
import {useState} from "react";
import AccountSettingsComponent from "../components/privatePageComponents/AccountSettingsComponent.jsx";
import AccountSettings from "../components/privatePageComponents/AccountSettingsComponent.jsx";
import {Link} from "react-router-dom";

export default function Private () {
    const [isloggedIn, setIsLoggedIn] = useState(true);
    const [accountDeletionTried, setAccountDeletionTried] = useState(false);
    const [accountDeletionSuccess, setAccountDeletionSuccess] = useState(false);


    if(isloggedIn && !accountDeletionTried && !accountDeletionSuccess) {
        return (
            <>
                <h1 className={"mb-5"}>Willkommen in Ihrem persönlichen Bereich!</h1>
                <h2 className={"mb-3"}>Persönliche Informationen</h2>
                <h2>Authenticator-Einstellungen</h2>
                <AuthenticatorSettings setIsLoggedIn={setIsLoggedIn} />
                <h2 className={"mb-3"}>Benutzerkonto-Einstellungen</h2>
                <AccountSettings setIsLoggedIn={setIsLoggedIn} setAccountDeletionTried={setAccountDeletionTried} setAccountDeletionSuccess={setAccountDeletionSuccess}/>
            </>
        );
    } else if(accountDeletionTried && !accountDeletionSuccess) {
        return(
            <div className={"container"}>
                <div className="row">
                    <div className="card text-bg-danger p-0 mb-3">
                        <div className="card-header col">
                            <h4>Benutzerkonto wurde nicht gelöscht!</h4>
                        </div>
                        <div className={"card-body"}>
                            <p>Ihr Benutzerkonto konnte aufgrund eines Fehlers leider nicht gelöscht werden. Der Löschvorgang wurde abgebrochen und rückgängig gemacht. Benutzerinformationen wurden nicht gelöscht. Bitte versuchen Sie es später erneut oder kontaktieren Sie bei weiterem Bestehen des Fehlers den System-Administrator.</p>
                        </div>
                        <div className={"card-footer"}>
                            <p>Klicken Sie auf die Schaltfläche, um in Ihren persönlichen Benutzerbereich zurückzukehren.</p>
                            <Link to={"/private"} className={"btn btn-primary"} onClick={() => setAccountDeletionTried(false)}>Gehe zum Benutzerbereich</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if(accountDeletionTried && accountDeletionSuccess) {
        return(
            <div className={"container"}>
                <div className="row">
                    <div className="card text-bg-success p-0 mb-3">
                        <div className="card-header col">
                            <h4>Benutzerkonto wurde erfolgreich gelöscht!</h4>
                        </div>
                        <div className={"card-body"}>
                            <p>Ihr Benutzerkonto und alle dazugehörigen Daten, Authenticator-Informationen und Sitzungen wurden aus dem System entfernt.</p>
                        </div>
                        <div className={"card-footer"}>
                            <p>Klicken Sie auf die Schaltfläche, um zur Startseite zurückzukehren. Dort können Sie sich entweder in ein bestehendes Benutzerkonto einloggen oder ein Neues anlegen.</p>
                            <Link to={"/"} className={"btn btn-primary"}>Gehe zur Startseite</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // TODO: Wenn Benutzer nicht eingeloggt ist, entsprechend Möglichkeiten zum Login anbieten.
        return(
            <>
                <p>Sie sind nicht eingeloggt!</p>
            </>
        );
    }
}
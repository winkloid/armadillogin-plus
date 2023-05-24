import AuthenticatorSettings from "../components/privatePageComponents/AuthenticatorSettingsComponent.jsx";
import {useEffect, useState} from "react";
import AccountSettings from "../components/privatePageComponents/AccountSettingsComponent.jsx";
import {Link, useLocation, useOutletContext, useParams} from "react-router-dom";
import {ErrorState} from "../types/errorState.js";
import ErrorComponent from "../components/ErrorComponent.jsx";
import {NavigationState} from "../types/navigationState.js";
import terminal from "virtual:terminal";

export default function Private () {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    // needed so that the right navigationState is set when logging out from private area
    const {privateState} = useParams();

    const [isloggedIn, setIsLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [accountDeletionTried, setAccountDeletionTried] = useState(false);
    const [accountDeletionSuccess, setAccountDeletionSuccess] = useState(false);

    useEffect(() => {
        setCurrentNavigationState(NavigationState.private);
    }, []);

    if(isloggedIn && !accountDeletionTried && !accountDeletionSuccess) {
        return (
            <div className={"card p-0 border-success border-opacity-25"}>
                <div className={"card-header bg-success bg-opacity-25 bg-gradient border-success border-opacity-25"}>
                    <h1 className={"display-5 m-0"}>Willkommen in Ihrem persönlichen Bereich!</h1>
                </div>
                <div className={"card-body"}>
                    <AuthenticatorSettings setIsLoggedIn={setIsLoggedIn} setErrorState={setErrorState} setCurrentError={setCurrentError} isLoading={isLoading} setIsLoading={setIsLoading}/>

                    {/*
                        Also pass the state as privateState.
                        Passing the State is important so that we navigate to the welcome component with the right navigation state in the next step.
                    */}
                    <AccountSettings setIsLoggedIn={setIsLoggedIn} setAccountDeletionTried={setAccountDeletionTried} setAccountDeletionSuccess={setAccountDeletionSuccess} setCurrentError={setCurrentError} setErrorState={setErrorState} isLoading={isLoading} setIsLoading={setIsLoading} setCurrentNavigationState={setCurrentNavigationState} privateState={privateState}/>
                </div>
                <ErrorComponent errorState={errorState} setErrorState={setErrorState} errorMessage={currentError}/>
            </div>
        );
    } else if(accountDeletionTried && !accountDeletionSuccess) {
        return(
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
        );
    } else if(accountDeletionTried && accountDeletionSuccess) {
        return(
            <div className="card border-success p-0">
                <div className="card-header bg-success bg-gradient text-white">
                    <h4>Benutzerkonto wurde erfolgreich gelöscht!</h4>
                </div>
                <div className={"card-body bg-success bg-opacity-10"}>
                    <p>Ihr Benutzerkonto und alle dazugehörigen Daten, Authenticator-Informationen und Sitzungen wurden aus dem System entfernt.</p>
                </div>
                <div className={"card-footer bg-success bg-opacity-25"}>
                    <p>Klicken Sie auf die Schaltfläche, um zur Startseite zurückzukehren. Dort können Sie sich entweder in ein bestehendes Benutzerkonto einloggen oder ein Neues anlegen.</p>
                    <Link to={"/"} className={"btn btn-primary"}>Gehe zur Startseite</Link>
                </div>
            </div>
        );
    } else {
        // TODO: Wenn Benutzer nicht eingeloggt ist, entsprechend Möglichkeiten zum Login anbieten.
        return(
            <div className={"card p-0"}>
                <div className={"card-header bg-secondary bg-gradient text-white"}>
                    <h1 className={"display-5 m-0"}>Ausgeloggt</h1>
                </div>
                <div className={"card-body"}>
                    <p>Sie sind aktuell nicht (mehr) eingeloggt. Entweder haben Sie die maximale Sitzungszeit von 60 Minuten überschritten oder Sie haben die Sitzung selbst beendet. Kehren Sie nun bitte über die untenstehende Schaltfläche zum Startbildschirm zurück.</p>
                </div>
                <div className={"card-footer"}>
                    <Link to={"/"} className={"btn btn-primary"}>Navigiere zurück zum Startbildschirm</Link>
                </div>
            </div>
        );
    }
}
import AuthenticatorSettings from "../components/privatePageComponents/AuthenticatorSettingsComponent.jsx";
import {useEffect, useState} from "react";
import AccountSettings from "../components/privatePageComponents/AccountSettingsComponent.jsx";
import {Link, useOutletContext, useParams} from "react-router-dom";
import {ErrorState} from "../types/errorState.js";
import ErrorComponent from "../components/ErrorComponent.jsx";
import {NavigationState} from "../types/navigationState.js";
import axios from "axios";
import EIdLogin_completion from "./eIdLogin/eIdLogin_completion.jsx";
import EIdOptionsComponent from "../components/privatePageComponents/EIdOptionsComponent.jsx";

export default function Private () {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    // needed so that the right navigationState is set when logging out from private area
    const {privateState} = useParams();

    const [isloggedIn, setIsLoggedIn] = useState(true);

    // use isGlobalLoading and isLoading to distinguish whether something is loading inside a component or only inside of one of the other components of the private page - e.g. there don't have to be a spinner animation in authenticator settings component if only another component is doing an operation that needs loading time
    // isGlobalLoading is generally used to render buttons as disabled if there is already an operation loading in any of the other components of the private page
    const [isGlobalLoading, setIsGlobalLoading] = useState(true);
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentError, setCurrentError] = useState("");
    const [accountDeletionTried, setAccountDeletionTried] = useState(false);
    const [accountDeletionSuccess, setAccountDeletionSuccess] = useState(false);
    const [currentUserInformation, setCurrentUserInformation] = useState(null);

    const fetchUserInformation = async () => {
        try {
            setIsGlobalLoading(true);
            let userInformationResponse = await axios({
                method: "get",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/eid-saml/userInformation"
            }).then((response) => {
                return response;
            });

            if(userInformationResponse.status === 200) {
                setCurrentUserInformation(userInformationResponse.data);
                setErrorState(ErrorState.success);
            } else {
                setCurrentError("Server meldet: " + userInformationResponse.data);
                if (userInformationResponse.status === 404) {
                    setErrorState(ErrorState.notFoundError);
                } else if (userInformationResponse.status === 500) {
                    setErrorState(ErrorState.serverError);
                } else {
                    setErrorState(ErrorState.connectionError);
                }
            }
        } catch(error) {
            setCurrentError("Verbindungsproblem beim Abruf der Benutzerinformationen vom Server.");
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsGlobalLoading(false);
        }
    }

    const updateUserTimeStamps = async () => {
        try {
            setIsGlobalLoading(true);
            let userTimeStampResponse = await axios({
                method: "put",
                url: import.meta.env.VITE_BACKEND_BASE_URL + "/api/timeStamps/updateAll"
            }).then((response) => {
                return response;
            });

            if(userTimeStampResponse.status === 200) {
                setErrorState(ErrorState.success);
            } else {
                setCurrentError("Server meldet: " + userTimeStampResponse.data);
                if (userTimeStampResponse.status === 401) {
                    setErrorState(ErrorState.notAuthorizedError);
                } else if (userTimeStampResponse.status === 500) {
                    setErrorState(ErrorState.serverError);
                } else {
                    setErrorState(ErrorState.connectionError);
                }
            }
        } catch(error) {
            setCurrentError("Verbindungsproblem beim Setzen der Zeitstempel in der Datenbank für den aktuellen Benutzer.");
            setErrorState(ErrorState.connectionError);
        } finally {
            setIsGlobalLoading(false);
        }
    }

    useEffect(() => {
        if(privateState === "welcome_shortcode_completed") {
            setCurrentNavigationState(NavigationState.private_shortcode_completed);
        } else if(privateState === "eid_registration_completed") {
            setCurrentNavigationState(NavigationState.private_eid_registration_completed);
        } else if(privateState === "eid_login_completed") {
            setCurrentNavigationState(NavigationState.private_eid_login_completed);
        } else {
            setCurrentNavigationState(NavigationState.private_login_completed);
        }
        fetchUserInformation();
        updateUserTimeStamps();
    }, []);

    if(isloggedIn && !accountDeletionTried && !accountDeletionSuccess) {
        return (
            <div className={"card p-0 border-success border-opacity-25"}>
                <div className={"card-header bg-success bg-opacity-25 bg-gradient border-success border-opacity-25"}>
                    <h1 className={"display-5 m-0"}>Willkommen in Ihrem persönlichen Bereich{(currentUserInformation ? ", " + currentUserInformation.userName : "")}!</h1>
                </div>
                <div className={"card-body bg-success bg-opacity-10"}>
                    <AuthenticatorSettings setIsLoggedIn={setIsLoggedIn} setErrorState={setErrorState} setCurrentError={setCurrentError} isGlobalLoading={isGlobalLoading} setIsGlobalLoading={setIsGlobalLoading}/>
                    <EIdOptionsComponent currentUserInformation={currentUserInformation} />

                    {/*
                        Also pass the state as privateState.
                        Passing the State is important so that we navigate to the welcome component with the right navigation state in the next step.
                    */}
                    <AccountSettings setIsLoggedIn={setIsLoggedIn} setAccountDeletionTried={setAccountDeletionTried} setAccountDeletionSuccess={setAccountDeletionSuccess} setCurrentError={setCurrentError} setErrorState={setErrorState} isGlobalLoading={isGlobalLoading} setIsGlobalLoading={setIsGlobalLoading} privateState={privateState}/>
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
import {Link, useLocation, useOutletContext} from "react-router-dom";
import {useEffect} from "react";
import {NavigationState} from "../types/navigationState.js";

export default function RegistrationSuccessfulComponent() {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    useEffect(() => {
        setCurrentNavigationState(NavigationState.welcome_registration_completed);
    }, []);

    return(
        <div className={"card p-0"}>
            <div className={"card-header bg-success bg-gradient text-white"}>
                <h1 className={"display-5"}>Registrierung erfolgreich!</h1>
            </div>
            <div className={"card-body"}>
                <p>Herzlichen Glückwunsch!</p>
                <p>Sie haben erfolgreich ein Benutzerkonto angelegt und einen Authenticator damit verknüpft. Damit haben Sie den ersten Praxisteil der Studie erledigt. Nun können Sie zum Startbildschirm zurückkehren und sich von dort aus in das neu erstellte Benutzerkonto einloggen.</p>
            </div>
            <div className={"card-footer bg-success bg-opacity-25"}>
                <Link to={"/"} className={"btn btn-primary"}>Kehre zum Startbildschirm zurück</Link>
            </div>
        </div>
    );
}
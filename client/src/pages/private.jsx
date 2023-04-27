import AuthenticatorSettings from "../components/privatePageComponents/AuthenticatorSettingsComponent.jsx";
import {useState} from "react";
import AccountSettingsComponent from "../components/privatePageComponents/AccountSettingsComponent.jsx";
import AccountSettings from "../components/privatePageComponents/AccountSettingsComponent.jsx";

export default function Private () {
    const [isloggedIn, setIsLoggedIn] = useState(true);

    if(isloggedIn) {
        return (
            <>
                <h1 className={"mb-5"}>Willkommen in Ihrem persönlichen Bereich!</h1>
                <h2 className={"mb-3"}>Persönliche Informationen</h2>
                <h2>Authenticator-Einstellungen</h2>
                <AuthenticatorSettings setIsLoggedIn={setIsLoggedIn} />
                <h2 className={"mb-3"}>Benutzerkonto-Einstellungen</h2>
                <AccountSettings setIsLoggedIn={setIsLoggedIn}/>
            </>
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
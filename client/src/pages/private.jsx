import AuthenticatorSettings from "../components/privatePageComponents/AuthenticatorSettingsComponent.jsx";
import {useState} from "react";

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
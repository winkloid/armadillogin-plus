import {Link} from "react-router-dom";

export default function AuthenticationSuccessfulComponent() {
    return(
        <div className={"card p-0"}>
            <div className={"card-header bg-success bg-gradient text-white"}>
                <h1 className={"display-5"}>Login erfolgreich!</h1>
            </div>
            <div className={"card-body"}>
                <p>Herzlichen Glückwunsch!</p>
                <p className={"mb-0"}>Sie haben sich erfolgreich mittels FIDO2/WebAuthn in das Benutzerkonto eingeloggt, das Sie im Registrierungsvorgang erstellt haben. Betätigen Sie die Schaltfläche "Navigiere in meinen persönlichen Bereich", um sich in Ihrem persönlichen Bereich weitere Informationen zu Ihrem Benutzerkonto anzeigen zu lassen.</p>
            </div>
            <div className={"card-footer bg-success bg-opacity-25"}>
                <Link to={"/private"} className={"btn btn-primary"}>Navigiere in meinen persönlichen Bereich</Link>
            </div>
        </div>
    );
}
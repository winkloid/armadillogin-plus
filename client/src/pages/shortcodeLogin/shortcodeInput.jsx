import {useEffect, useState} from "react";
import axios from "axios";
import {Navigate, useOutletContext, useParams} from "react-router-dom";
import {NavigationState} from "../../types/navigationState.js";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function ShortcodeInput() {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    const {shortcodeString} = useParams();
    const [currentShortcode, setCurrentShortcode] = useState(shortcodeString ? shortcodeString : "");
    const [shortcodeConfirmed, setShortcodeConfirmed] = useState(false);

    useEffect(() => {
        setCurrentNavigationState(NavigationState.shortcodeAuthorization.shortcodeInput);
    })

    if(!shortcodeConfirmed) {
        return (
            <div className="card p-0 mb-3">
                <div className="card-header col">
                    <h1 className={"display-5 m-0"}>Login via Code</h1>
                </div>
                <div className={"card-body"}>
                    <p>Geben Sie im folgenden Eingabefeld den Code ein, der zu einer Sitzung gehört, die Sie für
                        Ihr Benutzerkonto autorisieren möchten. Falls Sie den Code bereits entweder in die
                        Adresse dieser Seite integriert haben oder den QR-Code gescannt haben, können Sie den
                        Code hier erneut überprüfen und gegebenenfalls bearbeiten.</p>
                    <p>Drücken Sie auf die Schaltfläche "Bestätigen", um den angegebenen Shortcode zu
                        bestätigen.</p>
                    <div className="input-group mb-3">
                        <span className="input-group-text">🔡</span>
                        <div className="form-floating">
                            <input type="text"
                                   className="form-control"
                                   id="shortcodeInput"
                                   value={currentShortcode}
                                   onChange={shortcodeInputChange => setCurrentShortcode(shortcodeInputChange.target.value)}
                                   placeholder={"Login-Code"}
                                   aria-label={"Code Ihrer Kurzcode-Sitzung"}/>
                            <label htmlFor="shortcodeInput">Login-Code</label>
                        </div>
                        <button type={"button"} onClick={() => setShortcodeConfirmed(true)}
                                className={"btn btn-primary"}>Bestätigen
                        </button>
                    </div>
                    <div className={"card card-header bg-opacity-10 bg-info border-info"}>
                        <p className={"m-0 p-0"}>Nach der Bestätigung des Codes werden Sie erneut gebeten, sich
                            einzuloggen, um Ihre Berechtigung für diesen Vorgang zu bestätigen. Danach werden
                            Ihnen auf einer Seite alle Informationen zu der Sitzung angezeigt, die Sie
                            autorisieren möchten. Dort können Sie die Autorisierung bestätigen.</p>
                    </div>
                </div>
            </div>
        );
    } else {
        return(<Navigate to={"/login"} state={{isShortcodeLogin: true, shortcode: currentShortcode}}/>);
    }
}
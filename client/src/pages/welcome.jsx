import {Link, useOutletContext} from "react-router-dom";
import {NavigationState} from "../types/navigationState.js";

export default function Welcome() {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    return(
        <div className={"card p-0"}>
            <div className={"card-header"}>
                <h1 className={"display-5"}>Willkommen bei ArmadilLogin PLUS!</h1>
            </div>
            <div className={"card-body"}>
                <h2 className={"display-6 m-1"}><strong>Registrierung/Login</strong> mithilfe von <strong>Passkeys</strong></h2>
                <div className={"row m-1"}>
                    <div className={"card p-0 col-lg mb-2 me-2 " + ((currentNavigationState === NavigationState.welcome_init) ? "border-primary" : "")}>
                        <div className={"card-header text-white " + ((currentNavigationState === NavigationState.welcome_init) ? "bg-primary" : "bg-secondary")}>
                            <h3 className={"card-title m-0"}>Zur Registrierung</h3>
                        </div>
                        <div className={"card-body"}>
                            <p className={"card-text"}>Hier legen Sie ein neues Benutzerkonto an.</p>
                        </div>
                        <div className={"card-footer bg-opacity-25 " + ((currentNavigationState === NavigationState.welcome_init) ? "bg-primary" : "bg-secondary")}>
                            <Link to={"/registration"} className={"btn " + ((currentNavigationState === NavigationState.welcome_init) ? "btn-primary" : "btn-secondary")}>Gehe zur Registrierung</Link>
                        </div>
                    </div>
                    <div className={"card p-0 col-lg mb-2 " + ((currentNavigationState === NavigationState.welcome_registration_completed) ? "border-primary" : "")}>
                        <div className={"card-header text-white " + ((currentNavigationState === NavigationState.welcome_registration_completed) ? "bg-primary" : "bg-secondary")}>
                            <h3 className={"card-title m-0"}>Zum Login</h3>
                        </div>
                        <div className={"card-body"}>
                            <p className={"card-text"}>Melden Sie sich im privaten Bereich Ihres Benutzerkontos an.</p>
                        </div>
                        <div className={"card-footer bg-opacity-25 " + ((currentNavigationState === NavigationState.welcome_registration_completed) ? "bg-primary" : "bg-secondary")}>
                            <Link to={"/login"} className={"btn " + ((currentNavigationState === NavigationState.welcome_registration_completed) ? "btn-primary" : "btn-secondary")}>Gehe zum Login</Link>
                        </div>
                    </div>
                </div>

                <hr className="hr"/>

                <h2 className={"display-6 m-1"}><strong>Shortcode-Login</strong> bei Verwendung von <strong>Passkeys</strong></h2>
                <div className={"row m-1"}>
                    <div className={"card p-0 col-lg mb-2 me-2 " + ((currentNavigationState === NavigationState.welcome_login_completed) ? "border-primary" : "")}>
                        <div className={"card-header text-white " + ((currentNavigationState === NavigationState.welcome_login_completed) ? "bg-primary" : "bg-secondary")}>
                            <h3 className={"card-title m-0"}>Zur Code-Generierung</h3>
                        </div>
                        <div className={"card-body"}>
                            <p className={"card-text"}>Generieren Sie einen Code auf dem Gerät, das Sie anmelden möchten, das aber keine Passkeys unterstützt</p>
                        </div>
                        <div className={"card-footer bg-opacity-25 " + ((currentNavigationState === NavigationState.welcome_login_completed) ? "bg-primary" : "bg-secondary")}>
                            <Link to={"/shortcodeLogin/generateShortcode"} className={"btn " + ((currentNavigationState === NavigationState.welcome_login_completed) ? "btn-primary" : "btn-secondary")}>Gehe zur Code-Generierung</Link>
                        </div>
                    </div>
                    <div className={"card p-0 col-lg mb-2"}>
                        <div className={"card-header text-white bg-secondary"}>
                            <h3 className={"card-title m-0"}>Zur Autorisierung der Code-Sitzung</h3>
                        </div>
                        <div className={"card-body"}>
                            <p className={"card-text"}>Hier können Sie ein Gerät, für das ein Code generiert wurde, anmelden.</p>
                        </div>
                        <div className={"card-footer bg-opacity-25 bg-secondary"}>
                            <Link to={"/shortcode"} className={"btn btn-secondary"}>Gehe zur Sitzungs-Autorisierung</Link>
                        </div>
                    </div>
                </div>

                <hr className="hr"/>

                <h2 className={"display-6 m-1"}>Login mittels <strong>Ausweis/eID</strong></h2>
                <div className={"row m-1"}>
                    <div className={"card p-0 col-lg mb-2 " + ((currentNavigationState === NavigationState.welcome_eid_registration_completed) ? "border-primary" : "")}>
                        <div className={"card-header text-white " + ((currentNavigationState === NavigationState.welcome_eid_registration_completed) ? "bg-primary" : "bg-secondary")}>
                            <h3 className={"card-title m-0"}>Zum Login mittels Ausweis/eID</h3>
                        </div>
                        <div className={"card-body"}>
                            <p className={"card-text"}>Im Schritt zuvor verknüpften Sie bereits einen Ausweis mit Ihrem zuvor erstellten ArmadilLogin-PLUS-Benutzerkonto. In diesem Schritt wird der Login über die Ausweis-Methode demonstriert.</p>
                        </div>
                        <div className={"card-footer bg-opacity-25 " + ((currentNavigationState === NavigationState.welcome_eid_registration_completed) ? "bg-primary" : "bg-secondary")}>
                            <Link to={"/eId/login"} className={"btn " + ((currentNavigationState === NavigationState.welcome_eid_registration_completed) ? "btn-primary" : "btn-secondary")}>Gehe zum Ausweis-Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
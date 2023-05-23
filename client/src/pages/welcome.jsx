import {Link, useOutletContext} from "react-router-dom";
import {NavigationState} from "../types/navigationState.js";

export default function Welcome() {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    return(
        <>
            <div className={"container-fluid"}>
                <div className={"card p-0"}>
                    <div className={"card-header"}>
                        <h1 className={"display-5"}>Willkommen bei ArmadilLogin PLUS!</h1>
                    </div>
                    <div className={"card-body"}>
                        <h2 className={"display-6 m-1"}>Registrierung/Login mittels <strong>FIDO2/WebAuthn</strong></h2>
                        <p className={"m-1"}>Beginnen Sie mit der Registrierung, wenn Sie noch kein Benutzerkonto angelegt haben. Während der Registrierung wird ein Benutzerkonto erstellt, in das Sie sich anschließend einloggen.</p>
                        <div className={"row m-1"}>
                            <div className={"card p-0 col-lg mb-2 me-2 " + ((currentNavigationState === NavigationState.welcome.init) ? "border-primary" : "")}>
                                <div className={"card-header text-white " + ((currentNavigationState === NavigationState.welcome.init) ? "bg-primary" : "bg-secondary")}>
                                    <h3 className={"card-title m-0"}>Zur Registrierung</h3>
                                </div>
                                <div className={"card-body"}>
                                    <p className={"card-text"}>Um ein Konto bei ArmadilLogin nutzen zu können, müssen Sie zuerst ein neues Konto anlegen. Der Registrierungsprozess führt Sie durch diese Prozedur.</p>
                                </div>
                                <div className={"card-footer bg-opacity-25 " + ((currentNavigationState === NavigationState.welcome.init) ? "bg-primary" : "bg-secondary")}>
                                    <Link to={"/registration"} className={"btn " + ((currentNavigationState === NavigationState.welcome.init) ? "btn-primary" : "btn-secondary")}>Gehe zur Registrierung</Link>
                                </div>
                            </div>
                            <div className={"card p-0 col-lg mb-2 " + ((currentNavigationState === NavigationState.welcome.registration_completed) ? "border-primary" : "")}>
                                <div className={"card-header text-white " + ((currentNavigationState === NavigationState.welcome.registration_completed) ? "bg-primary" : "bg-secondary")}>
                                    <h3 className={"card-title m-0"}>Zum Login</h3>
                                </div>
                                <div className={"card-body"}>
                                    <p className={"card-text"}>Nachdem Sie ein Konto angelegt haben, können Sie Zugang zu Ihrem persönlichen Bereich erhalten, indem Sie sich authentifizieren. Bei diesem Vorgang weisen Sie dem System nach, dass Sie Zugang zu dem entsprechenden Konto besitzen. Dazu verwenden Sie einen FIDO2-/WebAuthn-Authenticator, den Sie zuvor mit Ihrem Konto verknüpft haben.</p>
                                </div>
                                <div className={"card-footer bg-opacity-25 " + ((currentNavigationState === NavigationState.welcome.registration_completed) ? "bg-primary" : "bg-secondary")}>
                                    <Link to={"/login"} className={"btn " + ((currentNavigationState === NavigationState.welcome.registration_completed) ? "btn-primary" : "btn-secondary")}>Gehe zum Login</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
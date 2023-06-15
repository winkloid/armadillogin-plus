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
                <h2 className={"display-6 m-1"}><strong>Registrierung/Login</strong> mittels <strong>FIDO2/WebAuthn</strong></h2>
                <p className={"m-1 pb-2"}>Beginnen Sie mit der Registrierung, wenn Sie noch kein Benutzerkonto angelegt haben. Während der Registrierung wird ein Benutzerkonto erstellt, in das Sie sich anschließend einloggen.</p>
                <div className={"row m-1"}>
                    <div className={"card p-0 col-lg mb-2 me-2 " + ((currentNavigationState === NavigationState.welcome_init) ? "border-primary" : "")}>
                        <div className={"card-header text-white " + ((currentNavigationState === NavigationState.welcome_init) ? "bg-primary" : "bg-secondary")}>
                            <h3 className={"card-title m-0"}>Zur Registrierung</h3>
                        </div>
                        <div className={"card-body"}>
                            <p className={"card-text"}>Um ein Konto bei ArmadilLogin nutzen zu können, müssen Sie zuerst ein neues Konto anlegen. Der Registrierungsprozess führt Sie durch diese Prozedur.</p>
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
                            <p className={"card-text"}>Nachdem Sie ein Konto angelegt haben, können Sie Zugang zu Ihrem persönlichen Bereich erhalten, indem Sie sich authentifizieren. Bei diesem Vorgang weisen Sie dem System nach, dass Sie Zugang zu dem entsprechenden Konto besitzen. Dazu verwenden Sie einen FIDO2-/WebAuthn-Authenticator, den Sie zuvor mit Ihrem Konto verknüpft haben.</p>
                        </div>
                        <div className={"card-footer bg-opacity-25 " + ((currentNavigationState === NavigationState.welcome_registration_completed) ? "bg-primary" : "bg-secondary")}>
                            <Link to={"/login"} className={"btn " + ((currentNavigationState === NavigationState.welcome_registration_completed) ? "btn-primary" : "btn-secondary")}>Gehe zum Login</Link>
                        </div>
                    </div>
                </div>

                <hr className="hr"/>

                <h2 className={"display-6 m-1"}><strong>Shortcode-Login</strong> mittels <strong>FIDO2/WebAuthn</strong></h2>
                <p className={"m-1 pb-2"}>Falls ein Gerät, auf dem Sie sich einloggen möchten, WebAuthn/FIDO2 nicht unterstützt oder falls Sie eine andere Person bitten möchten, ihr Benutzerkonto mitzunutzen, können Sie sich hier <strong>zuerst einen kurzen Code bestehend aus Buchstaben und Zahlen auf einem Gerät "A" generieren</strong> lassen. Auf einem anderen Gerät "B" können Sie diesen Code <strong>anschließend für 10 Minuten lang verwenden, um sich dort mittels WebAuthn/FIDO2 einzuloggen</strong> und anschließend den <strong>Kontozugriff für Gerät "A" zu autorisieren.</strong></p>
                <div className={"row m-1"}>
                    <div className={"card p-0 col-lg mb-2 me-2 " + ((currentNavigationState === NavigationState.welcome_login_completed) ? "border-primary" : "")}>
                        <div className={"card-header text-white " + ((currentNavigationState === NavigationState.welcome_login_completed) ? "bg-primary" : "bg-secondary")}>
                            <h3 className={"card-title m-0"}>Zur Code-Generierung</h3>
                        </div>
                        <div className={"card-body"}>
                            <p className={"card-text"}> Wenn Sie diesem Gerät Zugangsrechte für Ihr Benutzerkonto geben möchten, können Sie hier einen Code generieren lassen. Nur das Gerät, auf dem ein Code generiert wurde, erhält nach der Autorisierung Zugriff auf Ihr Benutzerkonto.</p>
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
                            <p className={"card-text"}>Wenn Sie bereits einen Code auf einem anderen Gerät generiert haben, können Sie den Kontozugriff für dieses Gerät hier autorisieren. Um sicherzustellen, dass Sie dazu tatsächlich berechtigt sind, durchlaufen Sie zuvor den Login-Prozess in Ihr Benutzerkonto mittels WebAuthn/FIDO2. Halten Sie also Ihren WebAuthn/FIDO2-Authenticator bereit!</p>
                        </div>
                        <div className={"card-footer bg-opacity-25 bg-secondary"}>
                            <Link to={"/shortcode"} className={"btn btn-secondary"}>Gehe zur Sitzungs-Autorisierung</Link>
                        </div>
                    </div>
                </div>

                <hr className="hr"/>

                <h2 className={"display-6 m-1"}>Login mittels <strong>Ausweis/eID</strong></h2>
                <p className={"m-1 pb-2"}>Eine der größten Hürden, die im FIDO2/WebAuthn-Standard verwurzelt sind, besteht in der <strong>Problematik der Wiederherstellbarkeit</strong> von Konten im Falle des Verlusts des eigenen FIDO2-Authenticators. Weil bei FIDO2 alle zum Login notwendigen <strong>geheimen Informationen fest auf dem Authenticator gespeichert</strong> werden, sind im <strong>Verlustfall ohne eine zuverlässige Wiederherstellungsmöglichkeit</strong> alle damit abgesicherten <strong>Benutzerkonten unzugänglich</strong>. Eigentlich existiert eine <strong>Vielzahl möglicher Wiederherstellungsoptionen</strong> wie beispielsweise das Senden eines Zugangs-Links via Mail oder die präventive Verknüpfung mehrerer Authenticators. Allerdings <strong>vermindern diese Optionen meist entweder die Sicherheit</strong> des Kontozugangs drastisch oder gehen mit <strong>erhöhten Kosten</strong> für den Endnutzer einher.</p>
                <p className={"m-1 pb-2"}>In diesem Abschnitt wird der <strong>Login mittels Personalausweis</strong> demonstriert. Da sich ohnehin in der Regel jeder Bürger im Besitz eines Personalausweises befindet, entstehen für den Endnutzer <strong>keinerlei Zusatzkosten</strong>. Weiterhin ist der <strong>Sicherheitsaspekt ebenfalls höher als der der meisten anderen Wiederherstellungsoptionen</strong> einzuschätzen. Auch bei Ersatz des Ausweises ist der Login mit dem neuen Ausweis weiter möglich, weil alle identifizierenden Informationen über den <strong>elektronischen Ausweisdienst</strong> abrufbar bleiben, von dem diese Wiederherstellungsoption abhängig ist.</p>
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
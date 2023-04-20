import {Link} from "react-router-dom";

export default function Welcome() {
    return(
        <>
            <div className={"container-fluid"}>
                <h1>Willkommen bei ArmadilLogin PLUS!</h1>
                <p>Über die folgenden Buttons gelangen Sie zur Registrierung bzw. Authentifizierung. Bitte starten Sie mit der Registrierung.</p>
                <div className={"row"}>
                    <div className={"card col-lg"}>
                        <div className={"card-body"}>
                            <h2 className={"card-title"}>Zur Registrierung</h2>
                            <p className={"card-text"}>Um ein Konto bei ArmadilLogin nutzen zu können, müssen Sie zuerst ein neues Konto anlegen. Der Registrierungsprozess führt Sie durch diese Prozedur.</p>
                            <Link to={"/registration"} className="btn btn-primary">Klicken Sie hier</Link>
                        </div>
                    </div>
                    <div className={"card col-lg ms-lg-3"}>
                        <div className={"card-body"}>
                            <h2 className={"card-title"}>Zum Login</h2>
                            <p className={"card-text"}>Nachdem Sie ein Konto angelegt haben, können Sie Zugang zu Ihrem persönlichen Bereich erhalten, indem Sie sich authentifizieren. Bei diesem Vorgang weisen Sie dem System nach, dass Sie Zugang zu dem entsprechenden Konto besitzen. Dazu verwenden Sie einen FIDO2-/WebAuthn-Authenticator, den Sie zuvor mit Ihrem Konto verknüpft haben.</p>
                            <Link to={"/login"} className="btn btn-primary">Klicken Sie hier</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
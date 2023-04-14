import {Link} from "react-router-dom";

export default function Welcome() {
    return(
        <>
            <div>
                <h1>Willkommen bei ArmadilLogin PLUS!</h1>
                <p>Über die folgenden Buttons gelangen Sie zur Registrierung bzw. Authentifizierung. Bitte starten Sie mit der Registrierung.</p>
                <div className={"card"}>
                    <div className={"card-body"}>
                        <h2 className={"card-title"}>Zur Registrierung</h2>
                        <p className={"card-text"}>Um ein Konto bei ArmadilLogin nutzen zu können, müssen Sie zuerst ein neues Konto anlegen. Der Registrierungsprozess führt Sie durch diese Prozedur.</p>
                        <Link to={"/registration"} className="btn btn-primary">Klicken Sie hier</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
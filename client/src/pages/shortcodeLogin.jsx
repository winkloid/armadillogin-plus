import {Link} from "react-router-dom";

export default function ShortcodeLogin() {

    return(
        <div className={"container-fluid"}>
            <h1>Willkommen beim ArmadilLogin PLUS Shortcode-Login!</h1>
            <p>Falls ein Gerät, auf dem Sie sich einloggen möchten, WebAuthn/FIDO2 nicht unterstützt oder falls Sie eine andere Person bitten möchten, ihr Benutzerkonto mitzunutzen, können Sie sich hier einen kurzen Code bestehend aus Buchstaben und Zahlen auf einem Gerät "A" generieren lassen. Auf einem anderen Gerät "B" können Sie diesen Code anschließend für 10 Minuten lang verwenden, um sich dort mittels WebAuthn/FIDO2 einzuloggen und anschließend den Kontozugriff für Gerät "A" zu autorisieren.</p>
            <div className={"row"}>
                <div className={"card col-lg"}>
                    <div className={"card-body"}>
                        <h2 className={"card-title"}>Zur Generierung eines Codes</h2>
                        <p className={"card-text"}>Wenn sie dieses Gerät für Ihr Benutzerkonto autorisieren möchten, können Sie hier einen Code generieren lassen. Nur das Gerät, auf dem ein Code generiert wurde, erhält nach der Autorisierung Zugriff auf Ihr Benutzerkonto.</p>
                        <Link to={"/shortcodeLogin/generateShortcode"} className="btn btn-primary">Klicken Sie hier</Link>
                    </div>
                </div>
                <div className={"card col-lg ms-lg-3"}>
                    <div className={"card-body"}>
                        <h2 className={"card-title"}>Zur Autorisierung</h2>
                        <p className={"card-text"}>Wenn Sie bereits einen Code auf einem anderen Gerät/in einem anderen Browser generieren lassen haben, können Sie den Kontozugriff über dieses Gerät/diesen Browser hier autorisieren. Um sicherzustellen, dass Sie dazu tatsächlich berechtigt sind, durchlaufen Sie zuvor den Login-Prozess in Ihr Benutzerkonto mittels WebAuthn/FIDO2. Halten Sie also Ihren WebAuthn/FIDO2-Authenticator bereit!</p>
                        <Link to={"/shortcode"} className="btn btn-primary">Klicken Sie hier</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
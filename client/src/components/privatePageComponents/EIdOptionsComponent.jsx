import {Link} from "react-router-dom";

export default function EIdOptionsComponent({currentUserInformation}) {
    if(!currentUserInformation?.eIdentifier) {
        return (
            <div className="card p-0 mb-3 border-secondary">
                <div className="card-header border-secondary">
                    <h4 className={"m-0"}>Login via Ausweis</h4>
                </div>
                <div className="card-body">
                    <img src={"/src/assets/logo_eID.svg"} className={"img-fluid rounded mx-auto d-block col-md-2 mb-3"}
                         alt={"Logo des elektrischen Personalausweises bestehend aus einem grünen und einem blauen Halbkreis."}/>
                    <p>Neben der Verknüpfung mehrerer Authenticators gibt es auch die Option, durch die Verknüpfung des
                        Ausweises mit Ihrem ArmadilLogin-PLUS-Konto zu verhindern, dass Sie nicht mehr auf Ihr
                        Benutzerkonto zugreifen können, falls Sie Ihren Haupt-Authenticator verlieren. Wenn Sie diese
                        Option aktivieren möchten, werden Sie zunächst zu einem elektronischen Ausweisdienst
                        weitergeleitet, der die Authentifizierung mittels Ausweis übernimmt. ArmadilLogin PLUS erhält im
                        Anschluss daran ein Pseudonym von diesem Ausweisdienst, das für jeden Benutzer eindeutig ist.
                        Damit kann ArmadilLogin PLUS nicht auf persönliche Informationen zugreifen, unterschiedliche
                        Ausweise aber anhand dieses eindeutigen Pseudonyms voneinander unterscheiden.</p>
                    <p>Zur Verwendung dieser Option muss auf Ihrem Gerät entweder die <a
                        href={"https://www.ausweisapp.bund.de/download"}>AusweisApp 2</a> oder die quelloffene und freie
                        Alternative <a href={"https://www.openecard.org/startseite/"}>Open eCard</a> installiert sein.
                    </p>
                </div>
                <div className={"card-footer"}>
                    <Link to={"/eId"} className={"btn btn-primary"}>Füge meinen Ausweis als Login-Methode hinzu</Link>
                </div>
            </div>
        );
    }
    return (
        <div className="card p-0 mb-3 border-secondary">
            <div className="card-header border-secondary">
                <h4 className={"m-0"}>Login via Ausweis</h4>
            </div>
            <div className="card-body">
                <img src={"/src/assets/logo_eID_Added.svg"} className={"img-fluid rounded mx-auto d-block col-md-2 mb-3"}
                     alt={"Logo des elektrischen Personalausweises bestehend aus einem grünen und einem blauen Halbkreis."}/>
                <p>Sie haben Ihren Ausweis bereits mit Ihrem ArmadilLogin-Konto verknüpft. Sie können nun bei jeden Login frei wählen, ob Sie dazu Ihren Personalausweis oder einen Ihrer FIDO2-/WebAuthn-Authenticators verwenden möchten.</p>
                <p>Zur Verwendung der Ausweis-Option muss auf Ihrem Gerät entweder die <a
                    href={"https://www.ausweisapp.bund.de/download"}>AusweisApp 2</a> oder die quelloffene und freie
                    Alternative <a href={"https://www.openecard.org/startseite/"}>Open eCard</a> installiert sein.
                </p>
            </div>
        </div>
    );
}
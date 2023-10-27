import {Link, useOutletContext} from "react-router-dom";
import {NavigationState} from "../../types/navigationState.js";

export default function EIdOptionsComponent({currentUserInformation}) {
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();

    if(!currentUserInformation?.eIdentifier) {
        return (
            <div className={"card p-0 mb-3 " + ((currentNavigationState === NavigationState.private_shortcode_completed) ? "border-primary" : "border-secondary")}>
                <div className={"card-header " + ((currentNavigationState === NavigationState.private_shortcode_completed) ? "bg-primary border-primary" : "border-secondary")}>
                    <h4 className={"m-0 " + ((currentNavigationState === NavigationState.private_shortcode_completed) ? "text-white" : "")}>Login via Ausweis</h4>
                </div>
                <div className={"card-body " + ((currentNavigationState === NavigationState.private_shortcode_completed) ? "bg-primary bg-opacity-10" : "")}>
                    <img src={"/src/assets/logo_eID.svg"} className={"img-fluid rounded mx-auto d-block col-md-2 mb-3"}
                         alt={"Logo des elektrischen Personalausweises bestehend aus einem grünen und einem blauen Halbkreis."}/>
                    <p>Zur Verwendung dieser Option muss auf Ihrem Gerät entweder die <a
                        href={"https://www.ausweisapp.bund.de/download"}>AusweisApp 2</a> oder die quelloffene und freie
                        Alternative <a href={"https://www.openecard.org/startseite/"}>Open eCard</a> installiert sein.
                    </p>
                </div>
                <div className={"card-footer " + ((currentNavigationState === NavigationState.private_shortcode_completed) ? "bg-primary bg-opacity-25" : "")}>
                    <Link to={"/eId"} className={"btn " + ((currentNavigationState === NavigationState.private_shortcode_completed) ? "btn-primary" : "btn-secondary")}>Füge meinen Ausweis als Login-Methode hinzu</Link>
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
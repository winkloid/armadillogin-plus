import {useState} from "react";
import {ErrorState} from "../../types/errorState.js";
import axios from "axios";
import terminal from "virtual:terminal";
import ErrorComponent from "../../components/ErrorComponent.jsx";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function EIdLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [samlUrl, setSamlUrl] = useState(null);

    const getEidSamlUrl = async () => {
        window.location.href = import.meta.env.VITE_BACKEND_BASE_URL + "/api/eid-saml/login";
    }

    return(
        <div className={"card p-0"}>
            <div className={"card-header"}>
                <h1 className={"display-5"}>Einrichtung eines deutschen Personalausweises als zweite Login-Methode</h1>
            </div>
            <div className={"card-body"}>
                <img src={"/src/assets/logo_eID.svg"} className={"img-fluid rounded mx-auto d-block col-md-2 mb-3"} alt={"Logo des elektrischen Personalausweises bestehend aus einem grünen und einem blauen Halbkreis."}/>
                <p>Wenn Sie Ihren FIDO2-Authenticator verlieren, kann dies zur Folge haben, dass Sie den Zugang zu Ihren Konten verlieren. Um das zu verhindern, könnten Sie für all Ihre Online-Konten mehrere Authenticators hinzufügen, allerdings kann dies mit hohen Kosten einhergehen.</p>
                <p>Auch der Personalausweis, den ohnehin jede deutsche Bürgerin und jeder deutsche Bürger besitzt, kann zum Login in Online-Dienste eingebaut werden.
                    Neben einer PIN müssen Sie sich auch hierbei keinerlei passwortbasierte Zugangsdaten merken. Stattdessen sind im Ausweis bereits alle kryptografischen Informationen hinterlegt, die der elektronische Ausweisdienst benötigt, um Benutzerinformationen abzurufen.
                    Die Web-Anwendung erhält vom elektronischen Ausweisdienst anschließend nur ein Pseudonym, das für jede Person einzigartig ist und somit auch vonseiten des Online-Diensts verwendet werden kann, um Benutzer voneinander zu unterscheiden. </p>
                {samlUrl && <p>samlUrl: {samlUrl}</p>}
            </div>
            <div className={"card-footer"}>
                <button className={"btn btn-primary"} type={"button"} onClick={getEidSamlUrl} disabled={isLoading}>{isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Beginne Login mit dem Ausweis</button>
            </div>
            <ErrorComponent errorState={errorState} errorMessage={currentError} setErrorState={setErrorState}/>
        </div>
    );
}
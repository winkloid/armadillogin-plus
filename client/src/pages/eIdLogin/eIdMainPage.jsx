import {useEffect, useState} from "react";
import {ErrorState} from "../../types/errorState.js";
import axios from "axios";
import terminal from "virtual:terminal";
import ErrorComponent from "../../components/ErrorComponent.jsx";
import {useOutletContext} from "react-router-dom";
import {NavigationState} from "../../types/navigationState.js";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function EIdMainPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setCurrentError] = useState("");
    const [errorState, setErrorState] = useState(ErrorState.success);
    const [currentNavigationState, setCurrentNavigationState] = useOutletContext();
    const [samlUrl, setSamlUrl] = useState(null);

    const getEidSamlUrl = async () => {
        window.location.href = import.meta.env.VITE_BACKEND_BASE_URL + "/api/eid-saml/initiateSaml/registration";
    }

    useEffect(() => {
        setCurrentNavigationState(NavigationState.eid_registration);
    }, []);

    return(
        <div className={"card p-0"}>
            <div className={"card-header"}>
                <h1 className={"display-5"}>Einrichtung eines deutschen Personalausweises als zweite Login-Methode</h1>
            </div>
            <div className={"card-body"}>
                <img src={"/src/assets/logo_eID.svg"} className={"img-fluid rounded mx-auto d-block col-md-2 mb-3"} alt={"Logo des elektrischen Personalausweises bestehend aus einem grünen und einem blauen Halbkreis."}/>
                <p>Damit Sie sich bei einem Verlust Ihres FIDO2-Authenticators weiter in Ihr Konto einloggen können, ist eine alternative Anmeldemethode nützlich. Das eID-Verfahren bietet für FIDO2 eine kostengünstige und </p>
                {samlUrl && <p>samlUrl: {samlUrl}</p>}
            </div>
            <div className={"card-footer"}>
                <button className={"btn btn-primary"} type={"button"} onClick={getEidSamlUrl} disabled={isLoading}>{isLoading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>} Beginne Login mit dem Ausweis</button>
            </div>
            <ErrorComponent errorState={errorState} errorMessage={currentError} setErrorState={setErrorState}/>
        </div>
    );
}
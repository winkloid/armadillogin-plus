import {useState} from "react";
import axios from "axios";

// Enable sending cookies with all requests by default
axios.defaults.withCredentials = true;
// Never return error on http response with status code !== 200
axios.defaults.validateStatus = function () {
    return true;
};

export default function AuthorizeShortcode() {
    const [currentServerResponse, setCurrentServerResponse] = useState("");

    const handleShortcodeSessionAuthorization = async () => {
        let authorizationResponse = axios({
            method: "post",
            url: "http://localhost:5000/api/shortcodeLogin/setShortcodeSessionAuthorized",
            data: {
                shortcode: "dvu656",
                verifyingChallengeResponse: "🚶🆎↗️"
            }
        });
        setCurrentServerResponse(authorizationResponse.data);
    }


    return(
        <>
            <button type={"button"} onClick={handleShortcodeSessionAuthorization}>Autorisiere Sitzung via Code</button>
            <p>Antwort: {currentServerResponse}</p>
        </>
    );
}
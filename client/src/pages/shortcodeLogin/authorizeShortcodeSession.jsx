import axios from "axios";
import {useState} from "react";
import {Link, useLocation} from "react-router-dom";

export default function AuthorizeShortcodeSession() {
    const { state } = useLocation();

    const [currentServerResponse, setCurrentServerResponse] = useState(null);

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

    if(state) {
        return(
            <p>ShortcodeLogin mit Shortcode: {state.shortcode}</p>
        );
    } else {
        return(<p>Kein shortcode gefunden, bitte geben Sie <Link to={"/shortcode"}>auf der Shortcode-Eingabeseite</Link> zuerst einen ein.</p>);
    }
}
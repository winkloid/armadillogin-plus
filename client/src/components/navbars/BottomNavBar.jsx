import {NavigationState} from "../../types/navigationState.js";
import {Link} from "react-router-dom";
import terminal from "virtual:terminal";
import {all} from "axios";

export default function BottomNavBar({currentNavigationState, setCurrentNavigationState}) {
    const allNavigationStates = Object.getOwnPropertyNames(NavigationState);
    let currentNavigationStateKey = Object.keys(NavigationState).find(key => NavigationState[key] === currentNavigationState);
    const currentNavbar = allNavigationStates.map((navigationStateName) => {
        let currentHref = "";
        let currentLabel = "";
        if(NavigationState[navigationStateName] === NavigationState.welcome_init) {
            currentHref = "/";
            currentLabel = "Startseite";
        } else if(NavigationState[navigationStateName] === NavigationState.welcome_registration_completed) {
            currentHref = "/";
            currentLabel = "Startseite (nach Registrierung)"
        } else if(NavigationState[navigationStateName] === NavigationState.welcome_login_completed) {
            currentHref = "/";
            currentLabel = "Startseite (nach Login)";
        } else if(NavigationState[navigationStateName] === NavigationState.welcome_shortcode_completed) {
            currentHref = "/";
            currentLabel = "Startseite (nach Shortcode)";
        } else if(NavigationState[navigationStateName] === NavigationState.registration){
            currentHref = "/registration";
            currentLabel = "Registrierung";
        } else if(NavigationState[navigationStateName] === NavigationState.login) {
            currentHref = "/login";
            currentLabel = "FIDO2-Login";
        } else if(NavigationState[navigationStateName] === NavigationState.private) {
            currentHref = "/private";
            currentLabel = "Privatbereich";
        } else if(NavigationState[navigationStateName] === NavigationState.shortcodeGeneration) {
            currentHref = "/shortcodeLogin/generateShortcode";
            currentLabel = "Code-Generierung";
        } else if(NavigationState[navigationStateName] === NavigationState.shortcodeAuthorization_shortcodeInput) {
            currentHref = "/shortcode";
            currentLabel = "Code-Eingabe";
        } else if(NavigationState[navigationStateName] === NavigationState.shortcodeAuthorization_authorizationScreen) {
            currentHref = "/shortcodeLogin/authorize";
            currentLabel = "Shortcode-Autorisierung";
        }
        if((typeof NavigationState[navigationStateName]) === "symbol") {
            return(
                <li className={"nav-item"} key={navigationStateName}>
                    {
                        /*Create Link to the corresponding path. If the current navigation state is the same as the navigation state of the current mapping, we mark the navigation item as active.
                        * If the key of the current navigation state comes before the key of the state of the current mapping, then we enable the link, else disable it.
                        * */
                    }
                    <Link to={currentHref} className={"nav-link " + ((currentNavigationState === NavigationState[navigationStateName]) ? "active " : "") + (allNavigationStates.indexOf(currentNavigationStateKey) >= allNavigationStates.indexOf(navigationStateName) ? "" : "disabled")} aria-current={(currentNavigationState === NavigationState[navigationStateName]) ? "page" : "false"} onClick={() => {
                        setCurrentNavigationState(NavigationState[navigationStateName]);
                    }}>{currentLabel}</Link>
                </li>
            );
        }
    });


    return(
        <>

        <nav className={"navbar pt-0 navbar-dark bg-dark bg-gradient fixed-bottom"}>
            <div className={"container-fluid p-0 mb-2"}>
                <div className={"container-fluid p-0 mt-0"}>
                    <div className="progress"
                         style={{height: "5px", borderRadius: 0}}
                         role="progressbar"
                         aria-label="Studienfortschritt, Praxisteil"
                         aria-valuenow={(allNavigationStates.indexOf(currentNavigationStateKey) / allNavigationStates.length * 100)}
                         aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar" style={{width: (allNavigationStates.indexOf(currentNavigationStateKey) / allNavigationStates.length * 100) + "%"}}></div>
                    </div>
                </div>
            </div>
            <div className={"container"}>
                <button className={"btn btn-outline-light"} type={"button"}>Zurück</button>
                <button className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navigationNavbarDropUp"
                        aria-controls="navigationNavbarDropUp"
                        aria-expanded="false"
                        aria-label="Navigationsmenü anzeigen/ausblenden">
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div className="collapse navbar-collapse" id="navigationNavbarDropUp">
                    <ul className="navbar-nav">
                        {currentNavbar}
                    </ul>
                </div>
            </div>
        </nav>
        </>
    );
}
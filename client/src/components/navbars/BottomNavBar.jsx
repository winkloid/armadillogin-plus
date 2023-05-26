import {NavigationState} from "../../types/navigationState.js";
import {Link, useNavigate} from "react-router-dom";
import terminal from "virtual:terminal";
import {all} from "axios";

export default function BottomNavBar({currentNavigationState, setCurrentNavigationState}) {
    const allNavigationStates = Object.getOwnPropertyNames(NavigationState);
    const navigate = useNavigate();
    let currentNavigationStateKey = Object.keys(NavigationState).find(key => NavigationState[key] === currentNavigationState);

    const getNavigationStateInformation = (navigationState) => {
        let stateHref = "";
        let stateLabel = "";
        if(navigationState === NavigationState.welcome_init) {
            stateHref = "/";
            stateLabel = "Startseite";
        } else if(navigationState === NavigationState.welcome_registration_completed) {
            stateHref = "/";
            stateLabel = "Startseite (nach Registrierung)"
        } else if(navigationState === NavigationState.welcome_login_completed) {
            stateHref = "/";
            stateLabel = "Startseite (nach Login)";
        } else if(navigationState === NavigationState.welcome_shortcode_completed) {
            stateHref = "/";
            stateLabel = "Startseite (nach Shortcode)";
        } else if(navigationState === NavigationState.registration){
            stateHref = "/registration";
            stateLabel = "Registrierung";
        } else if(navigationState === NavigationState.login) {
            stateHref = "/login";
            stateLabel = "FIDO2-Login";
        } else if(navigationState === NavigationState.private) {
            stateHref = "/private";
            stateLabel = "Privatbereich";
        } else if(navigationState === NavigationState.shortcodeGeneration) {
            stateHref = "/shortcodeLogin/generateShortcode";
            stateLabel = "Code-Generierung";
        } else if(navigationState === NavigationState.shortcodeAuthorization_shortcodeInput) {
            stateHref = "/shortcode";
            stateLabel = "Code-Eingabe";
        } else if(navigationState === NavigationState.shortcodeAuthorization_authorizationScreen) {
            stateHref = "/shortcodeLogin/authorize";
            stateLabel = "Shortcode-Autorisierung";
        }

        return {
            stateHref: stateHref,
            stateLabel: stateLabel
        }
    }
    const handleNavigationBack = () => {
        const previousNavigationStateName = allNavigationStates[allNavigationStates.indexOf(currentNavigationStateKey) - 1];

        // fetch information of previous navigation state
        const previousNavigationStateInformation = getNavigationStateInformation(NavigationState[previousNavigationStateName]);
        setCurrentNavigationState(NavigationState[previousNavigationStateName]);
        navigate(previousNavigationStateInformation.stateHref);
    }

    const currentNavbar = allNavigationStates.map((navigationStateName) => {
        let navigationStateKey = NavigationState[navigationStateName];
        let navigationStateInformation = getNavigationStateInformation(navigationStateKey);

        if((typeof NavigationState[navigationStateName]) === "symbol") {
            return(
                <li className={"nav-item"} key={navigationStateName}>
                    {
                        /*Create Link to the corresponding path. If the current navigation state is the same as the navigation state of the current mapping, we mark the navigation item as active.
                        * If the key of the current navigation state comes before the key of the state of the current mapping, then we enable the link, else disable it.
                        * */
                    }
                    <Link to={navigationStateInformation.stateHref} className={"nav-link " + ((currentNavigationState === NavigationState[navigationStateName]) ? "active " : "") + (allNavigationStates.indexOf(currentNavigationStateKey) >= allNavigationStates.indexOf(navigationStateName) ? "" : "disabled")} aria-current={(currentNavigationState === NavigationState[navigationStateName]) ? "page" : "false"} onClick={() => {
                        setCurrentNavigationState(NavigationState[navigationStateName]);
                    }}>{navigationStateInformation.stateLabel}</Link>
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
                <button className={"btn btn-outline-light"} type={"button"} aria-hidden={(allNavigationStates.indexOf(currentNavigationStateKey) === 0)} hidden={(allNavigationStates.indexOf(currentNavigationStateKey) === 0)} onClick={handleNavigationBack}>
                    <i className={"material-symbols-rounded"}>arrow_back_ios</i><span>Zurück - {getNavigationStateInformation(NavigationState[allNavigationStates[allNavigationStates.indexOf(currentNavigationStateKey) - 1]]).stateLabel}</span></button>
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

                        <li className={"nav-item mt-5"}>
                                <Link to={"/about"} className={"btn btn-outline-light opacity-75 col"}><i className={"material-symbols-rounded"}>info</i> <span>Über ArmadilLogin PLUS</span></Link>
                        </li>
                        <li className={"nav-item " + ((allNavigationStates.indexOf(currentNavigationStateKey) === 0) ? "" : "align-self-end")}>
                            <button className="btn btn-outline-danger mt-2"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#navigationNavbarDropUp"
                                    aria-controls="navigationNavbarDropUp"
                                    aria-expanded="false"
                                    aria-label="Navigationsmenü anzeigen/ausblenden">
                                <i className={"material-symbols-rounded "}>close</i> <span>Schließe Navigationsmenü</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        </>
    );
}
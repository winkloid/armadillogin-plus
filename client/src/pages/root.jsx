import {NavLink, Outlet} from "react-router-dom";
import '../armadillogin.css';
import {useState} from "react";
import {NavigationState} from "../types/navigationState.js";
import {browserSupportsWebAuthn} from "@simplewebauthn/browser";

export default function Root() {
    const [currentNavigationState, setCurrentNavigationState] = useState(NavigationState.welcome.init);

    return(
        <>
            <div className={"container-fluid text-start"}>
                <nav className={"navbar navbar-expand"}>
                    <h1 className={"navbar-brand"}>ArmadilLogin PLUS</h1>
                    <p>Aktueller NavigationState: {currentNavigationState.toString()}</p>
                    {browserSupportsWebAuthn()?
                        (<p className={"text-bg-success"}>Sehr gut! Dieser Browser unterstützt FIDO2/WebAuthn!</p>)
                        : (<p className={"text-bg-danger"}>Bitte verwenden Sie einen anderen Browser. Dieser Browser unterstützt FIDO2/WebAuthn nicht.</p>)}
                </nav>
                <Outlet context={[currentNavigationState, setCurrentNavigationState]}/>
            </div>
        </>
    )
}
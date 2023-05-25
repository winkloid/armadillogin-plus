import {NavLink, Outlet} from "react-router-dom";
import '../armadillogin.css';
import {useState} from "react";
import {NavigationState} from "../types/navigationState.js";
import {browserSupportsWebAuthn} from "@simplewebauthn/browser";

export default function Root() {
    const [currentNavigationState, setCurrentNavigationState] = useState(NavigationState.welcome_init);

    return(
        <div className={"container-fluid text-start m-0 p-0"}>
            <nav className={"navbar navbar-expand-lg navbar-light bg-light bg-opacity-75 sticky-top mb-3"}>
                <div className={"container justify-content-center"}>
                    <a className={"navbar-brand"} href={"#"}>
                        <img src={"/src/assets/armadillogin.svg"} alt={"Armadillogin"} width="50" height="50"/>
                    </a>
                </div>
                {/*
                <div>
                        <p>Aktueller NavigationState: {currentNavigationState.toString()}</p>
                        {browserSupportsWebAuthn()?
                            (<p className={"text-bg-success"}>Sehr gut! Dieser Browser unterstützt FIDO2/WebAuthn!</p>)
                            : (<p className={"text-bg-danger"}>Bitte verwenden Sie einen anderen Browser. Dieser Browser unterstützt FIDO2/WebAuthn nicht.</p>)}
                </div>
                */}
            </nav>
            <div className={"container"} style={{paddingBottom: "70px"}}>
                <Outlet context={[currentNavigationState, setCurrentNavigationState]}/>
            </div>
            <nav className={"navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom"}>
                <div className={"container"}>
                    <button className={"btn btn-secondary"} type={"button"}>Zurück</button>
                </div>
            </nav>
        </div>
    )
}
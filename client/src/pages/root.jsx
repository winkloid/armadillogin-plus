import {NavLink, Outlet} from "react-router-dom";
import '../armadillogin.css';
import {useState} from "react";
import {NavigationState} from "../types/navigationState.js";

export default function Root() {
    const [currentNavigationState, setCurrentNavigationState] = useState(NavigationState.welcome.init);

    return(
        <>
            <div className={"container-fluid text-start"}>
                <nav className={"navbar navbar-expand"}>
                    <h1 className={"navbar-brand"}>ArmadilLogin PLUS</h1>
                </nav>
                <Outlet context={[currentNavigationState, setCurrentNavigationState]}/>
            </div>
        </>
    )
}
import {NavLink, Outlet} from "react-router-dom";

export default function Root() {
    return(
        <>
            <div className={"container-fluid"}>
                <nav className={"navbar navbar-expand"}>
                    <h1 className={"navbar-brand"}>ArmadilLogin PLUS</h1>
                </nav>
                <Outlet />
            </div>
        </>
    )
}
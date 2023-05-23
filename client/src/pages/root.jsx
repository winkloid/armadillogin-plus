import {NavLink, Outlet} from "react-router-dom";
import '../armadillogin.css';

export default function Root() {
    return(
        <>
            <div className={"container-fluid text-start"}>
                <nav className={"navbar navbar-expand"}>
                    <h1 className={"navbar-brand"}>ArmadilLogin PLUS</h1>
                </nav>
                <Outlet />
            </div>
        </>
    )
}
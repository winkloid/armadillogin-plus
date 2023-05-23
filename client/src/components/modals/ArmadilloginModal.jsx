import ArmadilloginModalPortal from "./ArmadilloginModalPortal.jsx";
import {useEffect} from "react";

export default function ArmadilloginModal({children, isOpen, handleModalClose, portalId, contentLabel="Meldung"}) {
    useEffect(() => {
        const closeOnEscKeyPress = e => {
            if(e.key === "Escape") {
                handleModalClose()
            }
        }
        document.body.addEventListener("keydown", closeOnEscKeyPress);
        return () => {
            document.body.removeEventListener("keydown", closeOnEscKeyPress);
        };
    }, [handleModalClose]);

    return(
        <ArmadilloginModalPortal wrappingElementId={portalId}>
            <div className={"armadillogin-modal"} tabIndex={-1} role={"alertdialog"} aria-modal={"true"} aria-label={contentLabel}>
                <div className={"armadillogin-modal-content"}>
                    {children}
                </div>
            </div>
        </ArmadilloginModalPortal>
    );
}
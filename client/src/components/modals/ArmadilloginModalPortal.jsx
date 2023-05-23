import {useEffect, useLayoutEffect, useState} from "react";
import {createPortal} from "react-dom";
import {ErrorState} from "../../types/errorState.js";

export default function ArmadilloginModalPortal({children, wrappingElementId="armadillogin-modal-wrapper"}) {
    const [wrappingElement, setWrappingElement] = useState(null);

    const createWrappingElement = (wrappingElementId) => {
        const wrappingElement = document.createElement("div");
        wrappingElement.setAttribute("id", wrappingElementId);
        wrappingElement.setAttribute("class", "container-fluid text-start");
        document.body.appendChild(wrappingElement);
        document.getElementById("root").setAttribute("aria-hidden", "true");
        return wrappingElement;
    }

    useLayoutEffect(() => {
        let element = document.getElementById(wrappingElementId);
        let elementCreated = false;

        // if no element with the provided id has been found: create a new one and append it to the body
        if(!element) {
            element = createWrappingElement(wrappingElementId);
            elementCreated = true;
        }
        setWrappingElement(element);

        return () => {
            // if we created a new element in a useLayoutEffect run, then delete it before rendering another one in the next run
            if (elementCreated && element.parentNode) {
                element.parentNode.removeChild(element);
            }
            document.getElementById("root").setAttribute("aria-hidden", "false");
        }
    }, [wrappingElementId]);

    if(wrappingElement === null) {
        return null;
    }

    return createPortal(children, wrappingElement);
}
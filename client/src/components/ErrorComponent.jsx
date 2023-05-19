import {ErrorState} from "../types/errorState.js";
import Modal from 'react-modal';

import ErrorComponentPortal from "./ErrorComponentPortal.jsx";
import {useState} from "react";
Modal.setAppElement("#root");

export default function ErrorComponent({ errorState, setErrorState, errorMessage}) {
    const handleModalClose = () => {
        setErrorState(ErrorState.success);
    }

    if (errorState === ErrorState.success) {
        return null;
    } else {
        return (
            <Modal isOpen={errorState !== ErrorState.success} className={"flex col-10 m-auto mt-3"} closeTimeoutMS={250} onRequestClose={handleModalClose}
                   contentLabel="Fehlermeldung" >
                <div className={"card p-0 m-0"}>
                    <div className={"card-header bg-danger text-white"}>
                        {(errorState === ErrorState.connectionError) &&
                            <h1 className={"display-6 m-0"}>Verbindungsfehler</h1>}
                        {(errorState === ErrorState.badRequestError) &&
                            <h1 className={"display-6 m-0"}>Fehlerhafte Eingabe</h1>}
                        {(errorState === ErrorState.serverError) && <h1 className={"display-6 m-0"}>Serverfehler</h1>}
                        {(errorState === ErrorState.notAuthorizedError) &&
                            <h1 className={"display-6 m-0"}>Nicht autorisiert</h1>}
                        {(errorState === ErrorState.authenticationOptionsError) &&
                            <h1 className={"display-6 m-0"}>Fehler beim Abruf der FIDO2-Authentifizierungsoptionen des
                                Kontos</h1>}
                        {(errorState === ErrorState.authenticatorCommunicationError) &&
                            <h1 className={"display-6 m-0"}>Fehler beim Datenaustausch mit dem Authenticator</h1>}
                        {(errorState === ErrorState.authenticatorDeletionError) &&
                            <h1 className={"display-6 m-0"}>Fehler beim Löschen des Authenticators</h1>}
                        {(errorState === ErrorState.completeAuthenticationError) &&
                            <h1 className={"display-6 m-0"}>Fehler im Login-Prozess</h1>}
                        {(errorState === ErrorState.completeRegistrationError) &&
                            <h1 className={"display-6 m-0"}>Fehler beim Abschluss der Registrierung</h1>}
                        {(errorState === ErrorState.notFoundError) &&
                            <h1 className={"display-6 m-0"}>Nicht gefunden</h1>}
                        {(errorState === ErrorState.registrationOptionsError) &&
                            <h1 className={"display-6 m-0"}>Fehler beim Abruf der FIDO2-Registrierungsoptionen</h1>}
                        {(errorState === ErrorState.timeoutError) &&
                            <h1 className={"display-6 m-0"}>Zeitüberschreitung</h1>}
                    </div>
                    <div className={"card-body"}>
                        <p>{errorMessage}</p>
                    </div>
                    <div className={"card-footer"}>
                        <button className={"btn btn-primary"} type={"button"} onClick={handleModalClose}>Schließen
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }
}

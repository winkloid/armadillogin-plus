export default function AuthenticatorList({authenticatorList, handleAuthenticatorDeletion}) {

    const authenticatorListItems = authenticatorList.map((authenticator) => (
        <div className="card p-0 mb-1 border-warning bg-warning bg-opacity-10" key={authenticator.credentialId}>
            <div className="card-header col">
                {authenticator.customCredentialName && (authenticator.customCredentialName !== "") && <h6 className={"m-0"}>{authenticator.customCredentialName}</h6>}
                {((!authenticator.customCredentialName) || (authenticator.customCredentialName === "") || (authenticator.customCredentialName === undefined)) && <h6 className={"m-0 fst-italic text-secondary"}>Unbenannt</h6>}
            </div>
            <div className="card-body">
                <div><span className={"fw-bold"}>Authenticator-ID: </span><span className={"font-monospace"}>{authenticator.credentialId}</span></div>
                <div><span className={"fw-bold"}>Öffentlicher Schlüssel: </span><span className={"font-monospace"}>{authenticator.credentialPublicKey}</span></div>
            </div>
            <div className={"card-footer"}>
                <h5>Optionen für diesen Authenticator</h5>
                <div className={"card bg-danger bg-opacity-10 p-0 mb-2"}>
                    <div className={"card-header m-0"}>
                        <h6 className={"text-danger mb-0"}>Authenticator löschen</h6>
                    </div>
                    <div className={"card-body px-3 py-1"}>
                        <span className={"text-danger"}>Achtung:</span><span> Ihr Konto muss immer mindestens einen Authenticator beherbergen, damit Sie Ihren Zugang nicht verlieren!</span>
                    </div>
                    <div className={"card-footer"}>
                        <button className={"btn btn-danger"} type={"button"} onClick={() => handleAuthenticatorDeletion(authenticator.credentialId)}>Lösche diesen Authenticator</button>
                    </div>
                </div>

            </div>
        </div>
    ));

    return(<div>{authenticatorListItems}</div>);
}
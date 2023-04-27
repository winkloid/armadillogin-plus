export default function AuthenticatorList({authenticatorList}) {
    const authenticatorListItems = authenticatorList.map((authenticator) => (
        <div className="card p-0 mb-3" key={authenticator.credentialId}>
            <div className="card-header col">
                {authenticator.customCredentialName && (authenticator.customCredentialName !== "") && <h6>{authenticator.customCredentialName}</h6>}
                {((!authenticator.customCredentialName) || (authenticator.customCredentialName === "") || (authenticator.customCredentialName === undefined)) && <h6 className={"fst-italic text-secondary"}>Unbenannt</h6>}
            </div>
            <div className="card-body">
                <div><span className={"fw-bold"}>Authenticator-ID: </span><span className={"font-monospace"}>{authenticator.credentialId}</span></div>
                <div><span className={"fw-bold"}>Öffentlicher Schlüssel: </span><span className={"font-monospace"}>{authenticator.credentialPublicKey}</span></div>
            </div>
        </div>
    ));

    return(<div>{authenticatorListItems}</div>);
}
export default function AccountSettings() {
    const handleAccountDeletion = async () => {

    }

    return(
        <div className={"container"}>
            <div className="row">
                <div className="card p-0 mb-3">
                    <div className="card-header col">
                        <h4>Benutzerkonto-Einstellungen</h4>
                    </div>
                    <div className={"card-body"}>
                        {/* TODO: Benutzername mit angeben */}
                        <p>Aktuell sind Sie in Ihrem persönlichen Bereich angemeldet.</p>
                    </div>
                    <div className={"card-footer"}>
                        <h6 className={"text-danger"}>Konto löschen</h6>
                        <p>Hier können Sie Ihr Benutzerkonto bei Bedarf löschen. Dabei werden alle mit Ihrem Konto verknüpften Informationen, Authenticators und alle bis dahin aktiven Sessions gelöscht. Der bisher mit Ihrem Konto verknüpfte Benutzername ist anschließend wieder verfügbar und kann zum Anlegen eines neuen Benutzerkontos verwendet werden.</p>
                        <button className={"btn btn-danger"} type={"button"} onClick={handleAccountDeletion}>Lösche mein Benutzerkonto und alle verknüpften Daten</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
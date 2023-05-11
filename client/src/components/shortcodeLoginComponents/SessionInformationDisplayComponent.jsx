export default function SessionInformationDisplayComponent({sessionInformation}) {
    return(
        <>
            <div className={"row m-1"}>
                <div className={"card p-0 me-md-2 mb-2 col-sm col-md"}>
                    <div className={"card-header text-center p-0"}>
                        <p className={"display-6"}>🌍</p>
                        <h5>Browser-Informationen</h5>
                    </div>
                    <div className={"card-body pb-0"}>
                        <div className={"row"}>
                            <p className={"text-end fw-bold col border-end"}>Browser-Name:</p>
                            <p className={"text-start col"}>{(sessionInformation.clientInfo.browser?.name) ? sessionInformation.clientInfo.browser.name : "Keine Informationen über den Browser-Namen vorhanden."}</p>
                        </div>
                        <div className={"row"}>
                            <p className={"text-end fw-bold col border-end"}>Browser-Hauptversion:</p>
                            <p className={"text-start col"}>{(sessionInformation.clientInfo.browser?.major) ? sessionInformation.clientInfo.browser.major : "Keine Informationen über die Browser-Version vorhanden."}</p>
                        </div>
                        <div className={"row"}>
                            <p className={"text-end fw-bold col border-end"}>Browser-Version:</p>
                            <p className={"text-start col"}>{(sessionInformation.clientInfo.browser?.version) ? sessionInformation.clientInfo.browser.version : "Keine Informationen über die Hauptversion des eingesetzten Browsers vorhanden."}</p>
                        </div>
                    </div>
                </div>
                <div className={"card p-0 ms-md-2 mb-2 col-sm col-lg"}>
                    <div className={"card-header text-center p-0"}>
                        <p className={"display-6"}>⚙️</p>
                        <h5>Informationen zur Browser-Technologie</h5>
                    </div>
                    <div className={"card-body pb-0"}>
                        <div className={"row"}>
                            <p className={"text-end fw-bold col border-end"}>Technologie-Name / Engine:</p>
                            <p className={"text-start col"}>{(sessionInformation.clientInfo.engine?.name) ? sessionInformation.clientInfo.engine.name : "Keine Informationen über die verwendete Browser-Engine vorhanden."}</p>
                        </div>
                        <div className={"row"}>
                            <p className={"text-end fw-bold col border-end"}>Version:</p>
                            <p className={"text-start col"}>{(sessionInformation.clientInfo.engine?.version) ? sessionInformation.clientInfo.engine.version : "Keine Informationen über die Engine-Version vorhanden."}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"row m-1"}>
                <div className={"card p-0 me-md-2 mb-2 col-sm col-md"}>
                    <div className={"card-header text-center p-0"}>
                        <p className={"display-6"}>💻</p>
                        <h5>Betriebssystem-Informationen</h5>
                    </div>
                    <div className={"card-body pb-0"}>
                        <div className={"row"}>
                            <p className={"text-end fw-bold col border-end"}>Name des Betriebssystems:</p>
                            <p className={"text-start col"}>{(sessionInformation.clientInfo.os?.name) ? sessionInformation.clientInfo.os.name : "Keine Informationen über den Betriebssystem-Name vorhanden."}</p>
                        </div>
                        <div className={"row"}>
                            <p className={"text-end fw-bold col border-end"}>Betriebssystem-Version:</p>
                            <p className={"text-start col"}>{(sessionInformation.clientInfo.os?.version) ? sessionInformation.clientInfo.os.version : "Keine Informationen über die Betriebssystem-Version vorhanden."}</p>
                        </div>
                    </div>
                </div>
                <div className={"card p-0 ms-md-2 mb-2 col-sm col-lg"}>
                    <div className={"card-header text-center p-0"}>
                        <p className={"display-6"}>⚙️</p>
                        <h5>Prozessor-Informationen</h5>
                    </div>
                    <div className={"card-body pb-0"}>
                        <div className={"row"}>
                            <p className={"text-end fw-bold col border-end"}>Prozessor-Architektur:</p>
                            <p className={"text-start col"}>{(sessionInformation.clientInfo.cpu?.architecture) ? sessionInformation.clientInfo.cpu.architecture : "Keine Informationen über die verwendete CPU-Architektur."}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"row"}>
                <div className={"card p-0 m-3 col"}>
                    <div className={"card-header text-center p-0"}>
                        <p className={"display-6"}>🤖</p>
                        <h5>Geräte-Informationen im Rohformat</h5>
                    </div>
                    <div className={"card-body m-0 pb-0 row"}>
                        <p className={"text-end fw-bold col border-end"}>Roh-Informationen des Geräts:</p>
                        <p className={"text-start col"}>{(sessionInformation.clientInfo.ua) ? sessionInformation.clientInfo.ua : "Keine Rohdaten gefunden."}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
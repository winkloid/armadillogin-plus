import QRCode from "react-qr-code";

export default function ShortcodeAsQrComponent({shortcodeInformation}) {
    const qrColorFg = "#005F50";

    return (
        <div className={"card p-0 me-md-1 mb-2 col-sm col-lg"}>
            <div className={"card-header"}>
                <h2 className={"display-6 m-0"}>Per QR-Code</h2>
            </div>
            <div className={"card-body text-center"}>
                    <QRCode value={import.meta.env.VITE_FRONTEND_BASE_URL + "/shortcode/" + shortcodeInformation.shortcode} level={"H"} fgColor={qrColorFg} size={97}/>
            </div>
            <div className={"card-footer"}>
                <p>Scannen Sie den QR-Code mithilfe einer QR-Lese-App auf einem anderen Gerät. Eine solche App ist auch auf dem Studientelefon installiert. Darüber gelangen Sie auf eine Seite, über die Sie diese Sitzung autorisieren können.</p>
                <p>Beachten Sie dabei auch die untenstehende Zeichenkette.</p>
                <br/>
            </div>
        </div>
    );
}
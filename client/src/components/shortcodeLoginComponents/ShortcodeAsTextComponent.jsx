export default function ShortcodeAsTextComponent({shortcodeInformation}) {
    return(
        <div className={"card p-0 ms-md-2 me-md-1 mb-2 col-sm col-lg"}>
            <div className={"card-header"}>
                <h2 className={"display-6 m-0"}>Textbasiert</h2>
            </div>
            <div className={"card-body text-center"}>
                <kbd className={"font-monospace mb-0 display-1 "}>{shortcodeInformation.shortcode}</kbd>
            </div>
            <div className={"card-footer "}>
                <p className={"m-0"}>Besuchen Sie auf einem anderen Gerät die Seite </p>
                <code className={"fw-bold"}>{import.meta.env.VITE_FRONTEND_BASE_URL}/shortcodeLogin/authorizeShortcode/{shortcodeInformation.shortcode}</code>
                <p className={"m-0"}><span className={"m-0 fst-italic fw-bold"}>oder</span> besuchen Sie </p>
                <p className={"m-0"}><code className={"fw-bold"}>{import.meta.env.VITE_FRONTEND_BASE_URL}/shortcodeLogin/</code>,</p>
                <p className={"m"}>um den Code dort einzugeben.</p>
                <p>Dann können Sie diese Sitzung dort autorisieren.</p>
            </div>
        </div>
    );
}
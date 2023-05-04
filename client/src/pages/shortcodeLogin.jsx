export default function ShortcodeLogin() {
    let userAgent = navigator.userAgent;
    let platform = navigator.platform;
    let language = navigator.language;
    return(
        <>
            <p>User Agent Information: {userAgent}</p>
            <p>Plattform: {platform}</p>
            <p>Sprache: {language}</p>
        </>
    );
}
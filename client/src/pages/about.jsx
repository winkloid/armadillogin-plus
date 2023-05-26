export default function About() {
    const frontendResources = [
        {
            title: "@simplewebauthn/browser",
            description: "Wichtige Bibliothek, die Entwicklern hilft, FIDO2/WebAuthn in ihren Server einzubauen. Sie ermöglicht die einfache Erstellung von Authentifizierungs- und Registrierungsoptionen für Benutzer und kann verwendet werden, um vom Benutzer an den Server gesendete Challenges zu verifizieren. SimpleWebAuthn besteht sowohl aus einem server- als auch aus einem clientseitigen Teil. In ArmadilLogin PLUS kamen beide Teile zum Einsatz. SimpleWebAuthn ist zudem FIDO-konform.",
            link: "https://github.com/MasterKale/SimpleWebAuthn",
        },
        {
            title: "axios",
            description: "Bibliothek zum Erstellen und Ausführen von HTTP-Abfragen. Dies ist unter anderem für die Kommunikation des Frontends mit dem Backend bedeutsam.",
            link: "https://github.com/axios/axios"
        },
        {
            title: "bootstrap",
            description: "Framework, das dazu dient, schneller und einfacher Frontend-Designs zu erstellen. Aufgrund der vielen vordesignten Elemente lässt sich mittels Bootstrap schon mit geringem Aufwand eine ansprechende Benutzeroberfläche erstellen.",
            link: "https://github.com/twbs/bootstrap"
        },
        {
            title: "react",
            description: "Frontend-Framework, das es ermöglicht, komplexe Benutzeroberflächen in einzelnen Komponenten zu entwickeln, aus denen die finale Benutzeroberfläche schließlich zusammengesetzt wird.",
            link: "https://github.com/facebook/react"
        },
        {
            title: "react-dom",
            description: "Wird zusammen mit React verwendet, für React einen Einstiegspunkt in das Document Object Model bereitzustellen.",
            link: "https://www.npmjs.com/package/react-dom"
        },
        {
            title: "react-qr-code",
            description: "Dient dazu, beliebige Informationen in einem QR-Code zu kodieren. In ArmadilLogin PLUS wird damit ein QR-Code erzeugt, der Benutzern die einfachere Navigation zu dem Frontend-Pfad erlaubt, über den sie Shortcode-Sitzungen bestätigen können.",
            link: "https://github.com/rosskhanas/react-qr-code"
        },
        {
            title: "react-router-dom",
            description: "Dient dazu, mit React nicht ausschließlich Single-Page-Applications zu erzeugen, sondern verschiedene Routes zu definieren. Auch die Datenübergabe zwischen unterschiedlichen Seiten und die die hierarchische Anordnung von Seiten kann mittels React-Router festgelegt werden.",
            link: "https://github.com/remix-run/react-router"
        },
        {
            title: "vite",
            description: "Vite dient als Entwicklungsumgebung für das Frontend von ArmadilLogin PLUS. Während der Entwicklung ermöglicht Vite beispielsweise ein besonders schnelles Rendering vorgenommener Änderungen, ohne dass Seiten erst komplett neu geladen werden müssen.",
            link: "https://github.com/vitejs/vite"
        }
    ]

    const backendResources = [
        {
            title: "@simplewebauthn/server",
            description: "Wichtige Bibliothek, die Entwicklern hilft, FIDO2/WebAuthn in ihren Server einzubauen. Sie ermöglicht die einfache Erstellung von Authentifizierungs- und Registrierungsoptionen für Benutzer und kann verwendet werden, um vom Benutzer an den Server gesendete Challenges zu verifizieren. SimpleWebAuthn besteht sowohl aus einem server- als auch aus einem clientseitigen Teil. In ArmadilLogin PLUS kamen beide Teile zum Einsatz. SimpleWebAuthn ist zudem FIDO-konform.",
            link: "https://github.com/MasterKale/SimpleWebAuthn"
        },
        {
            title: "Express.js",
            description: "Framework auf Basis von Node.JS, das die Erstellung von Web-APIs erleichtert.",
            link: "https://github.com/expressjs/express"
        },
        {
            title: "express-Session",
            description: "Vereinfacht die Erstellung und Verwaltung von Sitzungen in Express.js.",
            link: "https://github.com/expressjs/session"
        },
        {
            title: "connect-mongo",
            description: "Ermöglicht die Verwendung von MongoDB als Speicher von Sessions, die mittels express-session erstellt wurden.",
            link: "https://github.com/jdesboeufs/connect-mongo"
        },
        {
            title: "mongoose",
            description: "Abstraktion des MongoDB-Treibers zur leichteren Arbeit mit MongoDB-Datenbanken. Dabei wird Boilerplate-Code weitestmöglich vermieden.",
            link: "https://github.com/Automattic/mongoose"
        },
        {
            title: "cors",
            description: "Dient dazu, zu steuern, über welche Quellen die Backend-API aufgerufen werden darf und über welche nicht. So können fremde Frontend-APIs vom Zugriff auf die Backend-API ausgeschlossen werden.",
            link: "https://github.com/expressjs/cors"
        },
        {
            title: "dotenv",
            description: "Dient dazu, Umgebungsvariablen innerhalb einer bestimmten Datei zu setzen, die dann innerhalb des Codes aufgerufen werden können. Somit wird verhindert, dass Geheimnisse wie Secrets zur Signierung von Cookies oder API-Passwörter direkt im Code aufzufinden sind. Weiterhin wird damit die Arbeit mit Werten vereinfacht, die für jede Umgebung variabel sein können wie beispielsweise der Frontend-Pfad.",
            link: "https://github.com/motdotla/dotenv"
        },
        {
            title: "nodemon",
            description: "Hilft dabei, den Server automatisch während der Entwicklung neu zu starten, wenn Änderungen am Code vorgenommen wurden. Dies hilft beim Debugging.",
            link: "https://github.com/remy/nodemon"
        },
        {
            title: "uuid",
            description: "Bibliothek zum konfortablen Erstellen von zufälligen UUID-Werten. Die Bibliothek kam beim Erstellen der UserIDs zum Einsatz, die für FIDO2 erforderlich sind.",
            link: "https://github.com/uuidjs/uuid"
        },
        {
            title: "base64url",
            description: "Zum Umwandeln von Zeichenketten in Base64 und umgekehrt. Wurde in meinem Projekt eingesetzt, um zwischen normalen base64-kodierten Strings und Buffers zum konvertieren, da die FIDO2-Credential-ID in der Datenbank als Buffer vorliegt.",
            link: "https://github.com/brianloveswords/base64url"
        },
        {
            title: "emoji-dictionary",
            description: "Stellt eine umfangreiche Sammlung von Emojis bereit, die insbesondere für den Emoji-Generator hilfreich war, der zur Generierung einer auf Emojis basierten Challenge im Shortcode-Login-Prozess zum Einsatz kommt.",
            link: "https://github.com/IonicaBizau/emoji-dictionary"
        },
        {
            title: "ua-parser-js",
            description: "Dient dazu, die Daten auszulesen und zu interpretieren, die im UserAgent-Header von HTTP-Anfragen mitgesendet werden. Dies kann Benutzern im Shortcode-Login-Prozess von ArmadilLogin PLUS helfen, zu erkennen, ob sie im Begriff sind, ein für sie unbekanntes Gerät zu autorisieren. Auch wenn ein Client im UserAgent alle möglichen Daten angeben kann, kann dies in vielen Fällen als zusätzliche Sicherheit für den Nutzer dienen.",
            link: "https://github.com/faisalman/ua-parser-js"
        }
    ]

    const createListFromObject = (listObject) => {
        return listObject.map(listEntry => (
            <li className={"list-group-item"} key={listEntry.title}>
                <h5>{listEntry.title}</h5>
                <p>{listEntry.description}</p>
                <a href={listEntry.link} className={"btn btn-primary"}>
                    <i className={"material-symbols-rounded me-1"}>code</i><span>Zum Code von <strong>{listEntry.title}</strong></span>
                </a>
            </li>
        ));
    }

    return(
        <div className={"card p-0"}>
            <div className={"card-header"}>
                <h1 className={"display-5"}>Über ArmadilLogin PLUS</h1>
            </div>
            <div className={"card-body"}>
                <p>ArmadilLogin PLUS ist die Weiterentwicklung von ArmadilLogin (<a href={"https://github.com/winkloid/Android_ArmadilLogin"}>siehe hier</a>).
                    Während ArmadilLogin lediglich eine Frontend-Anwendung unter Android darstellte, die Benutzern den Einsatz des FIDO2/WebAuthn-Verfahrens demonstrieren sollten, besteht ArmadilLogin PLUS sowohl aus einem server- als auch einem clientbasierten Teil.
                    ArmadilLogin PLUS setzt an den Erkenntnissen an, die mithilfe der ArmadilLogin-Anwendung im Rahmen meiner Bachelorarbeit gewonnen wurden.
                    Dabei wurden drei Hauptprobleme von FIDO2/WebAuthn identifiziert, die sich grundlegend folgendermaßen zusammenfassen lassen:
                </p>
                <ul className={"list-group"}>
                    <li className={"list-group-item"}>
                        <strong>1. Problematische Anmeldung auf Geräten, die FIDO2 nicht unterstützen.</strong>
                        <p>Dies umfasst noch eine Vielzahl von Geräten. Entweder fehlt die Software-Schnittstelle, also eine lokale API, die es Anwendungen erlaubt, eine Kommunikation mit einem FIDO2-Authenticator zu initiieren, oder es sind nicht die notwendigen Hardware-Schnittstellen vorhanden. Beispielsweise sind gerade an öffentlichen Geräten wie solchen in Bibliotheken oft nicht alle Hardware-Schnittstellen zugänglich.</p>
                    </li>
                    <li className={"list-group-item"}>
                        <strong>2. Fehlende Optionen zum Teilen von Zugangsinformationen</strong>
                        <p>Im FIDO2-Authentifizierungsverfahren werden alle geheimen Informationen auf Authenticators geschrieben. Von dort sind sie anschließend nicht mehr auslesbar. Dies erschwert auch die Weitergabe von Zugangsinformationen an andere Benutzer, falls mehrere Nutzer sich den Zugang zu einem gemeinsamen Benutzerkonto teilen möchten.</p>
                    </li>
                    <li className={"list-group-item"}>
                        <strong>3. Fehlende Optionen zur Wiederherstellung von Kontozugängen bei Verlust des Authenticators</strong>
                        <p>Da alle Informationen unauslesbar auf einem Authenticator gespeichert werden, lassen sich keine Backups erstellen. Zwar besteht eine triviale Lösung darin, einfach ein herkömmliches Verfahren zu verwenden, um Benutzern die Möglichkeit zu geben, ihr Nutzerkonto bei Authenticator-Verlust wiederherzustellen, allerdings würde dies die Sicherheitsvorteile von FIDO2 eliminieren. Eine andere Möglichkeit bestände in der Verwendung mehrerer Authenticators für jedes Benutzerkonto, allerdings geht dies wieder mit zusätzlichen Kosten einher. Mittlerweile existieren weitere Möglichkeiten wie Passkeys, die die Verknüpfung von geheimen FIDO2-Informationen über Online-Dienste wie Google oder Microsoft ermöglichen. ArmadilLogin PLUS schlägt mit der Integration des eID-Verfahrens einen weiteren Weg vor, diesem Problem entgegenzuwirken.</p>
                    </li>
                </ul>
                <p className={"mt-2"}>ArmadilLogin PLUS versucht, Lösungsvorschläge für die genannten Probleme zu bieten. Die ArmadilLogin-PLUS-Anwendung dient dabei dazu, Benutzern diese Möglichkeiten zu demonstrieren. Beispielsweise kann die Shortcode-Login-Funktionalität, bei der einfach ein anderes Gerät zur Autorisierung einer Sitzung verwendet werden kann, den ersten beiden Problemen entgegenwirken. Das dritte Problem wäre entweder durch Passkeys oder durch die in ArmadilLogin integrierte eID-Authentifizierung lösbar. Im Rahmen meiner Masterarbeit möchte ich herausfinden, wie Endnutzer die in ArmadilLogin PLUS integrierten Lösungsvorschläge wahrnehmen.</p>
                <p>Es folgt eine Liste von Ressourcen/Frameworks/Bibliotheken, die bei der Entwicklung von ArmadilLogin PLUS zum Einsatz kamen.</p>
                <hr/>
                <h2 className={"display-6"}>Frontend</h2>
                <ul className={"list-group"}>
                    {createListFromObject(frontendResources)}
                </ul>
                <hr/>
                <h2 className={"display-6"}>Backend</h2>
                <ul className={"list-group"}>
                    {createListFromObject(backendResources)}
                </ul>
            </div>
        </div>
    );
}
# Installation von ArmadilLogin-PLUS

## Voraussetzungen

- eine aktuelle Version von **Node** ist installiert, zum Beispiel Node v20.3.1
- eine aktuelle Version von **NPM** ist installiert, zum Beispiel NPM v9.7.2
- **MongoDB** ist installiert
  - um ArmadilLogin-PLUS im vollen Umfang nutzen zu können, ist hierbei die Verwendung eines Replica-Sets als MongoDB-Instanz erforderlich

### Installation eines MongoDB-Replica-Sets

- laden Sie zunächst Version 6.x.x des **MongoDB-Community-Servers** unter https://www.mongodb.com/try/download/community herunter

- lokalisieren Sie die Datei mongod.conf auf Ihrem System - unter Linux beispielsweise unter `/etc/mongod.conf` und bearbeiten Sie diese Datei wie folgt:

  - setzen Sie die Replication-Einstellungen, indem Sie einen Namen für das Replica-Set vergeben - fügen Sie dazu folgende Zeilen in die Datei ein:

    ~~~~
    replication:
      replSetName: "rs01"
    ~~~~

  - wobei `rs01` den Namen Ihres neu zu erstellenden Replica-Sets bezeichnet

  - speichern Sie diese Änderungen und schließen Sie die Datei

- nach erfolgter Konfiguration starten Sie den mongod-Service auf Ihrem System neu oder starten Sie das System neu

  - unter Linux mit systemd können Sie den Service über folgenden Befehl neu starten: `systemctl restart mongod`

- starten Sie anschließend die mongo-Shell beispielsweise über den Befehl `mongosh`
  - nach erfolgtem Start geben Sie `rs.initiate()` ein, um eine Initialisierung des Replica-Sets anzustoßen
  - achten Sie in der nun folgenden JSON-formatierten Ausgabe darauf dass "ok" der Wert 1 zugewiesen wurde - falls nicht, ist ein Fehler aufgetreten
  - Sie können mongo-Shell nun durch den `exit`-Befehl verlassen
- Ihre MongoDB-Verbindungs-URL für ArmadilLogin-PLUS lautet nun: mongodb://<Hostname oder IP>/<Datenbank-Name>?replicaSet=<Replicaset-Name>
  - also beispielsweise für ArmadilLogin-PLUS: `mongodb://127.0.0.1:27017/armadillogin_plus?replicaSet=rs01`

## Installation des ArmadilLogin-PLUS-Backends

### Setzen der Umgebungsvariablen

- zur Installation des ArmadilLogin-Backends navigieren Sie zuerst in ./server und legen Sie eine Datei ".env" an, die alle umgebungsspezifischen Werte enthalten wird

  - `cd server`
  - `nano .env`

- im Folgenden sehen Sie einen Beispielinhalt für die Environment-Datei, den Sie je nach lokalen Begebenheiten anpassen können:

- ~~~~
  # MongoDB config
  MONGODB_BASE_STRING="mongodb://127.0.0.1:27017/armadillogin_plus?replicaSet=rs01"
  
  # Cookie/Session settings
  ISPRODUCTION = "no"
  SESSION_SECRET_LOGINSESSION="password123"
  
  # server and client config
  BACKEND_BASE_URL = "https://armadillogin.exampledomain.com:5001"
  rpId = "armadillogin.exampledomain.com"
  clientPort = 5173
  HTTPS_PRIVKEY_PATH="./armadillogin.exampledomain.com.key"
  HTTPS_CERT_PATH="./armadillogin.exampledomain.com.crt"
  
  # saml config
  SAML_IDP_CERT="MIIFlzCCA3+gAwIBAgIINK3wkhEt4oowDQYJKoZIhvcNAQELBQAwYzELMAkGA1UEBhMCREUxDzANBgNVBAgTBkJheWVybjERMA8GA1UEBxMITWljaGVsYXUxEzARBgNVBAoTCmVjc2VjIEdtYkgxGzAZBgNVBAMTElNrSURlbnRpdHkgU0FNTCBGUzAeFw0yMTEyMTMxMDAwMDBaFw0yNDAyMTMxMDAwMDBaMGMxCzAJBgNVBAYTAkRFMQ8wDQYDVQQIEwZCYXllcm4xETAPBgNVBAcTCE1pY2hlbGF1MRMwEQYDVQQKEwplY3NlYyBHbWJIMRswGQYDVQQDExJTa0lEZW50aXR5IFNBTUwgRlMwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQCgSraq4/BaSD+8tPKKsez/Uk6FZ2c4cxSzjvcZptVPo7IH2cdLRKnlVfVgLPoeV+MOL/viu1y6IPp6aEJ09vl/7V0P5oEZ9BJ41K6DVsBb/puiFOC/Ma6Q53DbHbZQJJdGPmX1RH297e420iYs19zH7Y98X+ZTVOlOIxc26/yubc6XiMPvGzIv5BsHYzfyLFdapV/PTj21BDUmhas/H83zJP1IGdurJOt8/u7T1Mg2haLlU+Vp1xdeSaZgk+iesRyIB3Y774s6jqavxkit9PHk+Qq166sW2NOQLtb/BR/1aVK5rvvQqrZ0cLnk2jCFyDht4kZ7O6T5C0seQXDOGKHacv6neqfLu+4lWOTpZk/ANrbd8d2oG98k8lc5j2agVC7PjM0lTRoEMedTfG7J4q4mgSKhlL+YrRhIb/nYUSScn0EiAr32YSb5caboT3+eiqXnzAqVbH/wtwXIpbTkgQEwlk6A/TkDhv9+ssDv75k4PUKWmFjUKrC/TUQmC5k8TXvO40NX2cGOVimTavN1fSe1Pj1ytmQXRrbfrKiNwz+EbhAJHTdkEHh40XwjJh2jvwSSctvs3vpVIAtX4FPtHTOraBCZyyH0X/1vtKRruY2VzO8kAeU2Zb4NWE2STmFSXbIG9Pyci9eqdtd5nr3GaPj4g8BabcmMweOJRWwqm8F3fwIDAQABo08wTTAdBgNVHQ4EFgQUPSTV0I2z0mB0eJ/2JPvLPb4UVxswHwYDVR0jBBgwFoAUPSTV0I2z0mB0eJ/2JPvLPb4UVxswCwYDVR0PBAQDAgSQMA0GCSqGSIb3DQEBCwUAA4ICAQBWc4IQBece9ZXmkEe1SXGkg3ZqWNNJlkO4LuJOyDudLLPebjAM9JLBl1MY4Fnn9j2+ZeJHP9JRp4Igw49lGEI6KX/oGeDr+VfxHdRQ4mHs54JUKDcUef10xwlZ0sxX7bStNXtKOfMsaftwS/UfbjqawCQxXWMRONDMJVZXDE1ZrgvVC2/547AXJX93HtfTTPj8o3doEIF6IOBS9bjRZ6GUilzePsj3OaTbbGRHlGvxrBXmzZljF0wVmcBm6VneP0Ltap09Wwj2DI5n3PFGze4ufAj2UvkoJAlmOqnDKMcCMt8km9TkZtO1HtePCRj6n/FYWU33FB78gt1ZNrsYSWHAuco1irYUBg9wi6pJ/tJ4VwBk1astVrKTrJvMrvSIQeAzOhQ4DN+Rmv3CPvDshlrNxgC6HGvymSaOLRLX0gS0FbJmYgriXpy6AzSIkNqP4Fl9wT7MY0wYE3/bTuDO2Q/DcFif0AVn8AZHr9jM1H8SzzykkHgNvMQi1bHOv34WK6pYfuCD8/5f/OHf1LBADX5BHdu69vN9kc0LBdreLEysuqCTXTLov2h8osupsM1MDPrglm82PCJVcQ0zpwIBJiV7weDPqmibMqo7zDHRvFfrdqsfqVDdpwEex17kmqV+hYgufB4+uAr7E/crGd0YTv+SmySz1zxeoSZJn+f7cIfYFw=="
  ~~~~

  - `MONGODB_BASE_STRING` bezeichnet hierbei Ihre MongoDB-Verbindungs-URL - sehen Sie dazu oben: Installation eines MongoDB-Replica-Sets
  - `ISPRODUCTION` kann auf "yes" gesetzt werden, sofern Sie ArmadilLogin-PLUS via HTTPS verwenden - dieser Wert sorgt dafür, dass Cookies nur via HTTPS gesendet werden - verwenden Sie den Server also nicht mit HTTPS müssen Sie diesen Wert auf "no" belassen, damit ArmadilLogin-PLUS ordnungsgemäß funktioniert
  - `SESSION_SECRET_LOGINSESSION` bezeichnet den Wert mit dem Session-Cookies signiert werden sollen
  - `BACKEND_BASE_URL` enthält Protokoll, Domain und Port unter dem die ArmadilLogin-PLUS-API später verfügbar ist
  - `rpId` enthält nur die Domain bzw. die Relying-Party-ID
  - `clientPort` enthält den Port, auf dem der Frontend-Teil von ArmadilLogin läuft
  - `SAML_IDP_CERT` enthält das Zertifikat des SAML-Identitätsanbieters - im Fall von ArmadilLogin wird für die eID-Funktionalität auf den Identitätsprovider "SkIDentity" zurückgegriffen, sodass dessen Zertifikat hier einzutragen ist bzw. aus der Beispieldatei zu übernehmen ist
  - `HTTPS_PRIVKEY_PATH` und `HTTPS_CERT_PATH` sind die Dateipfade zum TLS-Private-KEy bzw. -Zertifikat - siehe hierzu den nächsten Punkt dieser Anleitung

### Einstellen einer HTTPS-Verbindung

- FIDO2 erfordert eine HTTPS-Verbindung, um zu funktionieren - davon ausgenommen sind ausschließlich Verbindungen, die über localhost laufen
- da ArmadilLogin-PLUS allerdings im Rahmen des Shortcode-Features zwangsweise HTTPS über eine Domain ungleich localhost laufen lassen muss, da ein zweites Gerät involviert ist, ist ein HTTPS-Zertifikat erforderlich
- um ein gültiges "Let's Encrypt"-Zertifikat für die Domain zu erhalten, auf denen der Server laufen soll, können Sie gemäß https://simplewebauthn.dev/docs/advanced/example-project#setting-up-https-support certbot verwenden
  - laden Sie die Certbot-Software dafür von https://certbot.eff.org/instructions herunter
  - unter Linux starten Sie den Zertifikatsvergabeprozess mittels sudo certbot --manual -d <Ihre Domain> --preferred-challenges dns certonly
    - also beispielsweise `sudo certbot --manual -d armadillogin.exampledomain.com --preferred-challenges dns certonly`
    - befolgen Sie die Schritte, durch die Certbot Sie führt, das resultierende Zertifikat können Sie für 90 Tage verwenden, bevor der Prozess erneut notwendig wird
  - unter `/etc/letsencrypt/live/armadillogin.exampledomain.com/fullchain.pem` finden Sie die Zertifikatsdatei - kopieren Sie sie sowohl in das Client- als auch in das Serververzeichnis von ArmadilLogin-PLUS - beispielsweise wenn sie sich aktuell im Root des armadillogin-plus-Projekts befinden mittels:
    - `sudo cp /etc/letsencrypt/live/armadillogin.exampledomain.com/fullchain.pem ./server/armadillogin.exampledomain.com.crt`
    - `sudo cp /etc/letsencrypt/live/armadillogin.exampledomain.com/fullchain.pem ./client/armadillogin.exampledomain.com.crt`
  - kopieren Sie auch den privaten Schlüssel des Zertifikats:
    - `sudo cp /etc/letsencrypt/live/armadillogin.exampledomain.com/privkey.pem ./server/armadillogin.exampledomain.com.key`
    - `sudo cp /etc/letsencrypt/live/armadillogin.exampledomain.com/privkey.pem ./client/armadillogin.exampledomain.com.key`
- Modifizieren Sie im nächsten Schritt die HTTPS-Einstellungen zunächst für den Server:
  - in .env fügen Sie die Dateipfade für die soeben kopierten Dateien ein - sehen Sie sich das Beispiel in der oben abgebildeten .env-Beispieldatei an

### Den Server zum Laufen bringen

- stellen Sie sicher, dass sie sich im server-Verzeichnis der ArmadilLogin-PLUS-Anwendung befinden oder navigieren Sie vom ArmadilLogin-PLUS-Rootverzeichnis hinein:
  - `cd server`
- installieren Sie nun alle Abhängigkeiten, also alle Bibliotheken, die ArmadilLogin-PLUS serverseitig verwendet mit folgendem Befehl:
  - `npm install`
- nach Beendigung des Installationsprozesses, des Einpflegens der HTTPS-Informationen und der Einrichtung der Umgebungsvariablen können Sie den Server nun mittels `npm run dev` zum Laufen bringen

## Installation des ArmadilLogin-PLUS-Frontends

### Setzen der Umgebungsvariablen

- zur Installation des ArmadilLogin-Frontends navigieren Sie zuerst in ./client und legen Sie eine Datei ".env" an, die alle umgebungsspezifischen Werte enthalten wird
  - `cd client`
  - `nano .env`
- im Folgenden sehen Sie einen Beispielinhalt für die Environment-Datei, den Sie je nach lokalen Begebenheiten anpassen können:

~~~~
# server and client config
VITE_BACKEND_BASE_URL = "https://armadillogin.exampledomain.com:5001"
VITE_FRONTEND_BASE_URL = "https://armadillogin.exampledomain.com:5173"
~~~~

### Modifikation der Vite-Configuration

- beziehen Sie sich zur Aktivierung der HTTPS-Verbindung bitte auf den Abschnitt "Einstellen einer HTTPS-Verbindung" im Teil dieser Anleitung, der sich auf die Backend-Einrichtung bezieht
- die kopierten HTTPS-Informationsdateien benötigen Sie in diesem Schritt erneut
- in `./client/vite.config.js` konfigurieren Sie die Frontend-Umgebung, sodass diese auf Ihre TLS-Zertifikats- und Privatschlüsseldatei zugreift und sie für die HTTPS-Verbindung verwendet - beschreiben Sie die Datei mit folgender Konfiguration:

~~~~
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Terminal from "vite-plugin-terminal"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
      key: "./armadillogin.exampledomain.com.key",
      cert: "./armadillogin.exampledomain.com.crt"
    },
    host: "armadillogin.exampledomain.com",
    hmr: {
      host: "armadillogin.exampledomain.com",
    },
  },
  plugins: [react(), Terminal()],
})
~~~~

- ändern Sie die `key`- und `cert`-Werte entsprechend des Dateipfads für Ihre TLS-Dateien entsprechend ab
- modifizieren Sie die `host`-Werte zu der Domain, auf der Sie ArmadilLogin laufen lassen möchten
- lassen Sie alles weitere unverändert

### Das Frontend zum Laufen bringen

- stellen Sie sicher, dass sie sich im client-Verzeichnis der ArmadilLogin-PLUS-Anwendung befinden oder navigieren Sie vom ArmadilLogin-PLUS-Rootverzeichnis hinein:
  - `cd client`
- installieren Sie nun alle Abhängigkeiten, also alle Bibliotheken, die ArmadilLogin-PLUS clientseitig verwendet mit folgendem Befehl:
  - `npm install`
- nach Beendigung des Installationsprozesses, des Einpflegens der HTTPS-Informationen und der Einrichtung der Umgebungsvariablen können Sie den Frontend-Teil nun mittels `npm run dev` zum Laufen bringen
- lassen Sie sowohl Front- als auch Backend zugleich laufen und greifen Sie im Webbrowser nun via https unter Port 5173 (sofern nicht anders eingestellt) auf die Domain zu, die Sie als host ein der vite-config-Datei eingegeben haben
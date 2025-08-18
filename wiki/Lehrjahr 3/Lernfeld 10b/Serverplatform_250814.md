# Serverplattform und Serverdienste
Einführung in die Serverplattform und die Serverdienste.
## Definition Plattform (IT)

Eine Computerplattform bezeichnet in der Informatik eine einheitliche Grundlage, auf der Computerprogramme ausgeführt und entwickelt werden können. Einfach ausgedrückt ist eine IT-Plattform wie das Fundament eines Hauses:

**Was gehört zu einer Plattform?**
- **Hardware**: Prozessor, Arbeitsspeicher, Festplatte
- **Betriebssystem**: Windows, Linux, macOS
- **Software-Frameworks**: Programme, die als Basis für andere Programme dienen

**Praktisches Beispiel**: Ihr Smartphone ist eine Plattform - es hat Hardware (Prozessor, Speicher), ein Betriebssystem (Android/iOS) und darauf laufen Apps.

## Definition Server // Client-Server-Modell

Das Client-Server-Modell beschreibt eine Möglichkeit, Aufgaben und Dienstleistungen innerhalb eines Netzwerkes zu verteilen.

**So funktioniert es:**
- **Client**: Der "Kunde" - fragt nach Diensten (z.B. Ihr Webbrowser)
- **Server**: Der "Dienstleister" - stellt Dienste bereit (z.B. Webserver)

**Alltagsbeispiele:**
- **Webbrowsing**: Wenn du eine Webseite aufrufst, agiert dein Browser als Client. Es sendet eine Anfrage an einen Webserver, um die Webseite zu erhalten
- **E-Mail**: Ein E-Mail-Client (z.B. Outlook oder Gmail im Browser) sendet und empfängt E-Mails über einen E-Mail-Server
- **Restaurant-Analogie**: Sie (Client) bestellen beim Kellner, die Küche (Server) bereitet das Essen zu

**Vorteile des Client-Server-Modells:**
- Zentrale Datenverwaltung
- Bessere Sicherheit durch kontrollierte Zugriffe
- Mehrere Clients können gleichzeitig auf einen Server zugreifen

## Definition Dienst

Ein **IT-Dienst** (Service) ist eine spezielle Funktion oder Leistung, die ein Server für Clients bereitstellt.

**Häufige Serverdienste:**
- **Webserver**: Stellt Webseiten bereit
- **E-Mail-Server**: Verwaltet und versendet E-Mails
- **Dateiserver**: Speichert und teilt Dateien im Netzwerk
- **Druckserver**: Verwaltet Drucker im Netzwerk
- **Datenbankserver**: Verwaltet und stellt Daten bereit

**Charakteristika von Diensten:**
- Laufen kontinuierlich im Hintergrund
- Antworten automatisch auf Anfragen
- Können von mehreren Clients gleichzeitig genutzt werden
- Sind meist auf spezielle Aufgaben spezialisiert

**Beispiel**: Wenn Sie eine E-Mail versenden, nutzen Sie den E-Mail-Dienst. Dieser nimmt Ihre E-Mail entgegen, leitet sie weiter und stellt sie dem Empfänger zu - alles automatisch und im Hintergrund.

---

## Quellen

1. Wikipedia - Client-Server-Modell: https://de.wikipedia.org/wiki/Client-Server-Modell
2. Ausbildung in der IT - Client-Server-Modell: https://ausbildung-in-der-it.de/lexikon/client-server-modell
3. Wikipedia - Plattform (Computer): https://de.wikipedia.org/wiki/Plattform_(Computer)
4. HPE Deutschland - Computing-Plattform: https://www.hpe.com/de/de/what-is/compute-platforms.html
5. IT Enterprise Architektur - IT-Plattformen: https://it-enterprise-architektur.de/it-plattformen/

---

## Aufgaben
1. Recherchieren Sie zunächst welche Serverdienste und Plattformen es gibt.
2. Diskutieren Sie in der Kalssde weie eine Übersicht zu den Diensten und Plattofmen ausshen könnte uns entscheiden sie sich für eine Art der Übersicht.
3. Recherchieren Sie in Teams die einzelnen Serverdienste und arbeiten Sie die Informationen so auf, dass diese Präsendation und anschließend in die Übersicht eingetragen werden können.

### Antworten zu Aufgaben 1 und 2
Zu 1: Es gibt Serverdienste wie Web-, E‑Mail-, Datei-, Druck-, Datenbank-, DNS-, DHCP- und Verzeichnisdienste (z. B. Active Directory/LDAP). Plattformen umfassen Betriebssysteme (Windows Server, Linux), Virtualisierung (VMware ESXi, Hyper‑V), Container (Docker, Kubernetes) und Cloud-Plattformen (AWS, Azure, GCP).

Zu 2: Am geeignetsten ist eine tabellarische Matrix mit Spalten für Dienst/Plattform, Zweck, Protokolle/Ports, Beispiele/Tools und Bereitstellung (On‑Prem/VM/Container/Cloud); Entscheidung: Nutzung dieser Tabelle, optional nach Kategorien (Netzwerk, Anwendung, Daten) gruppiert.
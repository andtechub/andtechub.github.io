# 🐳 Docker Installation Anleitung

Diese Anleitung beschreibt die Installation von **Docker Engine** auf **Ubuntu** oder **Debian**.

---

## 🔧 Voraussetzungen

* Ein 64-Bit-System (Ubuntu oder Debian)
* Root-Zugriff oder `sudo`-Rechte
* Internetverbindung

---

## 🧹 Schritt 1: Alte Versionen entfernen

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

---

## 📦 Schritt 2: Paketquellen aktualisieren

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release -y
```

---

## 🔑 Schritt 3: Docker GPG-Key hinzufügen

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
```

*(Für Debian ersetze `ubuntu` im nächsten Schritt durch `debian`.)*

---

## 🗂️ Schritt 4: Docker-Repository hinzufügen

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

---

## ⚙️ Schritt 5: Docker Engine installieren

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

---

## ▶️ Schritt 6: Installation testen

```bash
sudo docker run hello-world
```

Wenn du eine Ausgabe wie *"Hello from Docker!"* siehst, ist alles korrekt installiert ✅

---

## 👤 Schritt 7: Docker ohne `sudo` verwenden (optional)

```bash
sudo usermod -aG docker $USER
```

Danach musst du dich **neu anmelden** oder den Rechner **neu starten**.

Test:

```bash
docker ps
```

Wenn keine Fehlermeldung kommt, funktioniert’s!

---

## 🔄 Nützliche Docker-Befehle

| Befehl                     | Beschreibung             |
| -------------------------- | ------------------------ |
| `docker ps`                | Zeigt laufende Container |
| `docker ps -a`             | Zeigt alle Container     |
| `docker images`            | Listet Docker-Images     |
| `docker stop <container>`  | Stoppt Container         |
| `docker start <container>` | Startet Container        |
| `docker rm <container>`    | Entfernt Container       |
| `docker rmi <image>`       | Entfernt ein Image       |

---

## 🧰 Docker Compose (optional)

Wenn du `docker compose` nicht mitinstalliert hast:

```bash
sudo apt install docker-compose -y
```

Teste mit:

```bash
docker compose version
```

---

## 🧼 Deinstallation (optional)

```bash
sudo apt-get purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```

---

Fertig! 🎉
Docker ist nun einsatzbereit.

---

Möchtest du, dass ich dir daraus direkt eine `.md`-Datei generiere, die du herunterladen kannst?

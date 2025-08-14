class ServerServicesMindmap {
    constructor() {
        this.nodes = [];
        this.nodeCounter = 1;
        this.categories = new Map();
        this.servicesData = this.getServicesData();
        this.init();
    }

    init() {
        this.categorizeServices();
        this.generateMindmap();
        this.bindEvents();
        this.drawConnections();
    }

    getServicesData() {
        return [
            {name: "Webserver", description: "Stellt Webseiten über HTTP/HTTPS bereit.", example: "Apache, Nginx, IIS", category: "web"},
            {name: "Application Server", description: "Führt Webanwendungen und Business-Logik aus.", example: "Tomcat, WildFly", category: "web"},
            {name: "Datenbankserver", description: "Speichert strukturierte Daten und beantwortet Abfragen.", example: "MySQL, PostgreSQL, MariaDB", category: "database"},
            {name: "Mailserver", description: "Sendet und empfängt E-Mails (SMTP/IMAP/POP3).", example: "Postfix, Exchange", category: "communication"},
            {name: "DNS-Server", description: "Auflösung von Domainnamen zu IP-Adressen.", example: "BIND, Unbound", category: "network"},
            {name: "DHCP-Server", description: "Vergibt IP-Adressen automatisch im Netzwerk.", example: "ISC DHCP, dnsmasq", category: "network"},
            {name: "FTP/SFTP-Server", description: "Dateiübertragung per FTP/SFTP.", example: "vsftpd, OpenSSH", category: "storage"},
            {name: "Dateiserver", description: "Bereitstellung und Freigabe von Dateien im Netzwerk.", example: "Samba, NFS", category: "storage"},
            {name: "Proxy-Server", description: "Vermittelt Anfragen zwischen Clients und Servern.", example: "Squid, HAProxy", category: "network"},
            {name: "Reverse Proxy", description: "Verteilt eingehenden Traffic auf interne Server.", example: "Nginx, Traefik", category: "network"},
            {name: "Load Balancer", description: "Lastverteilung und Hochverfügbarkeit.", example: "HAProxy, F5", category: "network"},
            {name: "Cache-Server", description: "Speichert häufige Daten im Speicher zur Beschleunigung.", example: "Redis, Memcached", category: "database"},
            {name: "Authentifizierungsserver", description: "Verifiziert Benutzeridentitäten und Zugriffe.", example: "Active Directory, FreeIPA", category: "security"},
            {name: "LDAP-Server", description: "Hierarchische Verzeichnisdienste für Nutzer und Rechte.", example: "OpenLDAP", category: "security"},
            {name: "RADIUS-Server", description: "Netzwerk-Authentifizierung für WLAN/VPN.", example: "FreeRADIUS", category: "security"},
            {name: "VPN-Server", description: "Sichere Verbindung ins Firmennetzwerk.", example: "OpenVPN, WireGuard", category: "security"},
            {name: "Monitoring-Server", description: "Überwacht Dienste, Metriken und Health-Checks.", example: "Zabbix, Prometheus", category: "monitoring"},
            {name: "Backup-Server", description: "Verwaltet und speichert Backups von Daten/Systemen.", example: "BorgBackup, Veeam", category: "storage"},
            {name: "Container Registry", description: "Speichert und verteilt Container-Images.", example: "Docker Registry, Harbor", category: "development"},
            {name: "CI/CD-Server", description: "Automatisiert Build-, Test- und Deploy-Pipelines.", example: "Jenkins, GitLab CI", category: "development"},
            {name: "API-Gateway", description: "Verwaltet und schützt APIs, Routing, Rate-Limiting.", example: "Kong, Apigee", category: "web"},
            {name: "Message Broker", description: "Verteilt Nachrichten und Events zwischen Diensten.", example: "RabbitMQ, Kafka", category: "communication"}
        ];
    }

    categorizeServices() {
        this.servicesData.forEach(service => {
            if (!this.categories.has(service.category)) {
                this.categories.set(service.category, []);
            }
            this.categories.get(service.category).push(service);
        });
    }

    generateMindmap() {
        const mindmap = document.getElementById('mindmap');
        const centerNode = mindmap.querySelector('.central-node');
        
        // Add central node to nodes array
        this.nodes.push({
            id: 0,
            element: centerNode,
            level: 0,
            category: 'center'
        });

        // Create category nodes
        const categoryNames = {
            'web': 'Web-Services',
            'database': 'Datenbanken',
            'network': 'Netzwerk',
            'security': 'Sicherheit',
            'monitoring': 'Überwachung',
            'storage': 'Speicher',
            'communication': 'Kommunikation',
            'development': 'Entwicklung'
        };

        let categoryIndex = 0;
        for (const [categoryKey, services] of this.categories) {
            const categoryNode = this.createCategoryNode(
                categoryNames[categoryKey] || categoryKey,
                categoryKey,
                categoryIndex
            );
            mindmap.appendChild(categoryNode);
            
            // Create service nodes for this category
            services.forEach((service, serviceIndex) => {
                const serviceNode = this.createServiceNode(
                    service,
                    this.nodeCounter,
                    categoryIndex,
                    serviceIndex
                );
                mindmap.appendChild(serviceNode);
            });
            
            categoryIndex++;
        }
    }

    createCategoryNode(name, category, index) {
        const node = document.createElement('div');
        node.className = 'node category-node';
        node.dataset.level = '1';
        node.dataset.category = category;
        node.dataset.id = this.nodeCounter;
        node.innerHTML = `<span>${name}</span>`;
        
        // Position around center in a circle
        const angle = (index * 360 / this.categories.size) * Math.PI / 180;
        const radius = 25; // percentage
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        
        node.style.left = `${x}%`;
        node.style.top = `${y}%`;
        
        this.nodes.push({
            id: this.nodeCounter,
            element: node,
            level: 1,
            category: category,
            parentId: 0
        });
        
        this.nodeCounter++;
        return node;
    }

    createServiceNode(service, nodeId, categoryIndex, serviceIndex) {
        const node = document.createElement('div');
        node.className = 'node service-node';
        node.dataset.level = '2';
        node.dataset.category = service.category;
        node.dataset.id = nodeId;
        node.innerHTML = `<span>${service.name}</span>`;
        
        // Position around category node
        const categoryNode = this.nodes.find(n => n.category === service.category && n.level === 1);
        const categoryAngle = (categoryIndex * 360 / this.categories.size) * Math.PI / 180;
        const servicesInCategory = this.categories.get(service.category).length;
        const serviceAngle = categoryAngle + ((serviceIndex - (servicesInCategory - 1) / 2) * 0.8);
        
        const radius = 15; // percentage from category node
        const x = 50 + Math.cos(serviceAngle) * (25 + radius);
        const y = 50 + Math.sin(serviceAngle) * (25 + radius);
        
        node.style.left = `${x}%`;
        node.style.top = `${y}%`;
        
        this.nodes.push({
            id: nodeId,
            element: node,
            level: 2,
            category: service.category,
            parentId: categoryNode.id,
            data: service
        });
        
        this.nodeCounter++;
        return node;
    }

    drawConnections() {
        const mindmap = document.getElementById('mindmap');
        
        // Remove existing connection lines
        mindmap.querySelectorAll('.connection-line').forEach(line => line.remove());
        
        this.nodes.forEach(node => {
            if (node.parentId !== undefined) {
                const parent = this.nodes.find(n => n.id === node.parentId);
                if (parent) {
                    const line = this.createConnectionLine(parent.element, node.element);
                    mindmap.appendChild(line);
                }
            }
        });
    }

    createConnectionLine(parentEl, childEl) {
        const line = document.createElement('div');
        line.className = 'connection-line';
        
        const parentRect = parentEl.getBoundingClientRect();
        const childRect = childEl.getBoundingClientRect();
        const mindmapRect = document.getElementById('mindmap').getBoundingClientRect();
        
        const x1 = (parentRect.left + parentRect.width / 2 - mindmapRect.left) / mindmapRect.width * 100;
        const y1 = (parentRect.top + parentRect.height / 2 - mindmapRect.top) / mindmapRect.height * 100;
        const x2 = (childRect.left + childRect.width / 2 - mindmapRect.left) / mindmapRect.width * 100;
        const y2 = (childRect.top + childRect.height / 2 - mindmapRect.top) / mindmapRect.height * 100;
        
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        
        line.style.width = `${length}%`;
        line.style.height = '2px';
        line.style.left = `${x1}%`;
        line.style.top = `${y1}%`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 50%';
        
        return line;
    }

    bindEvents() {
        // View toggle
        document.getElementById('toggleView').addEventListener('click', () => this.toggleView());
        document.getElementById('resetView').addEventListener('click', () => this.resetView());
        document.getElementById('exportData').addEventListener('click', () => this.exportData());
        
        // Node click to show info
        document.addEventListener('click', (e) => {
            const node = e.target.closest('.node');
            if (node && node.dataset.level === '2') {
                this.showNodeInfo(node);
            }
        });
        
        // Close info panel
        document.getElementById('closeInfo').addEventListener('click', () => {
            document.getElementById('infoPanel').classList.remove('show');
        });
    }

    showNodeInfo(nodeElement) {
        const nodeData = this.nodes.find(n => n.element === nodeElement);
        if (nodeData && nodeData.data) {
            const service = nodeData.data;
            document.getElementById('infoTitle').textContent = service.name;
            document.getElementById('infoDescription').textContent = service.description;
            document.getElementById('infoExampleText').textContent = service.example;
            document.getElementById('infoPanel').classList.add('show');
        }
    }

    toggleView() {
        const mindmap = document.getElementById('mindmap');
        const currentScale = mindmap.style.transform.match(/scale\(([\d.]+)\)/);
        const scale = currentScale ? parseFloat(currentScale[1]) : 1;
        
        if (scale <= 0.5) {
            mindmap.style.transform = 'scale(1)';
        } else if (scale <= 0.8) {
            mindmap.style.transform = 'scale(0.4)';
        } else {
            mindmap.style.transform = 'scale(0.6)';
        }
    }

    resetView() {
        document.getElementById('mindmap').style.transform = 'scale(1)';
        document.getElementById('infoPanel').classList.remove('show');
    }

    exportData() {
        const data = {
            categories: Array.from(this.categories.keys()),
            services: this.servicesData
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'serverdienste-mindmap.json';
        a.click();
    }
}

// Initialize mindmap when page loads
document.addEventListener('DOMContentLoaded', () => {
    new ServerServicesMindmap();
});

// Datei wird nicht mehr benötigt, da alles serverseitig mit PHP gelöst ist.
    e.preventDefault();
    const dienstname = document.getElementById('dienstname').value.trim();
    const beschreibung = document.getElementById('beschreibung').value.trim();
    const beispiel = document.getElementById('beispiel').value.trim();
    if (dienstname && beschreibung && beispiel) {
        const newDienst = { dienstname, beschreibung, beispiel };
        // Hole aktuelle Daten, füge neuen Dienst hinzu und speichere
        fetch('save_dienste.php')
            .then(res => res.json())
            .then(data => {
                data.push(newDienst);
                return fetch('save_dienste.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            })
            .then(() => {
                addRowToTable(newDienst);
                document.getElementById('dienst-form').reset();
            });
    }
});

function addRowToTable(dienst) {
    const table = document.getElementById('dienste-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = dienst.dienstname;
    newRow.insertCell(1).textContent = dienst.beschreibung;
    newRow.insertCell(2).textContent = dienst.beispiel;
}

// Lade gespeicherte Dienste beim Seitenstart
window.addEventListener('DOMContentLoaded', function() {
    fetch('save_dienste.php')
        .then(res => res.json())
        .then(data => {
            data.forEach(addRowToTable);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const rows = Array.from(document.querySelectorAll('#dienste-table tbody tr'));
    // Hover-Effekt
    rows.forEach(r => {
        r.addEventListener('mouseenter', () => r.classList.add('highlight-row'));
        r.addEventListener('mouseleave', () => r.classList.remove('highlight-row'));
    });
    // Live-Filter
    const input = document.getElementById('search-input');
    if (input) {
        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            rows.forEach(r => {
                const text = r.textContent.toLowerCase();
                r.style.display = q === '' || text.includes(q) ? '' : 'none';
            });
        });
    }
});

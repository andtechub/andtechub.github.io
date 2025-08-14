document.getElementById('dienst-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const dienstname = document.getElementById('dienstname').value.trim();
    const beschreibung = document.getElementById('beschreibung').value.trim();
    const beispiel = document.getElementById('beispiel').value.trim();
    if (dienstname && beschreibung && beispiel) {
        const table = document.getElementById('dienste-table').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = dienstname;
        newRow.insertCell(1).textContent = beschreibung;
        newRow.insertCell(2).textContent = beispiel;
        document.getElementById('dienst-form').reset();
    }
});

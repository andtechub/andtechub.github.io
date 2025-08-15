document.addEventListener('DOMContentLoaded', () => {
	// Suche mit Debounce
	const input = document.getElementById('search-input');
	const table = document.getElementById('dienste-table');
	let timer = null;

	// Die kombinierte Filterfunktion wird für Suche und Kategorie verwendet
	if (input){
		input.addEventListener('input', (e) => {
			clearTimeout(timer);
			timer = setTimeout(() => filterEntries(), 150);
		});
	}

	// View toggle: table <-> cards
	const viewBtn = document.getElementById('view-toggle');
	const tableView = document.getElementById('table-view');
	const cardsView = document.getElementById('cards-view');
	
	if (viewBtn && tableView && cardsView){
		viewBtn.addEventListener('click', () => {
			const isTable = tableView.style.display !== 'none';
			
			tableView.style.display = isTable ? 'none' : 'block';
			cardsView.style.display = isTable ? 'block' : 'none';
			
			viewBtn.textContent = isTable ? 'Tabellenansicht' : 'Kartenansicht';
			viewBtn.setAttribute('aria-pressed', isTable ? 'true' : 'false');
			
			// Wenn wir zur Kartenansicht wechseln, stellen wir sicher, dass die Karten generiert sind
			if (isTable) {
				generateCards();
			}
		});
	}

	// Theme toggle (Dark Mode Toggle)
	const themeBtn = document.getElementById('theme-toggle');
	if (themeBtn) {
		// Load saved theme preference
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme === 'dark') {
			document.documentElement.classList.add('dark');
			themeBtn.textContent = '🌤️';
		}
		
		themeBtn.addEventListener('click', () => {
			const isDark = document.documentElement.classList.toggle('dark');
			themeBtn.textContent = isDark ? '🌤️' : '🌙';
			// Save theme preference
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		});
	}

	// Optional: small keyboard shortcut to focus search: "/"
	document.addEventListener('keydown', (e) => {
		if (e.key === '/' && document.activeElement !== input && input){
			e.preventDefault();
			input.focus();
		}
	});

	// Kategorie-Filter-Funktionalität
	const categoryFilter = document.getElementById('category-filter');
	if (categoryFilter) {
		categoryFilter.addEventListener('change', filterEntries);
	}

	// Filterfunktion für beide Ansichten
	function filterEntries() {
		const searchValue = input.value.toLowerCase();
		const categoryValue = categoryFilter.value;
		
		// Tabellenzellen filtern
		const rows = document.querySelectorAll('#dienste-table tbody tr');
		rows.forEach(row => {
			const text = row.textContent.toLowerCase();
			const category = row.getAttribute('data-category');
			
			const matchesSearch = text.includes(searchValue);
			const matchesCategory = categoryValue === 'all' || category === categoryValue;
			
			row.style.display = matchesSearch && matchesCategory ? '' : 'none';
		});
		
		// Karten filtern (falls Karten-Ansicht aktiv)
		const cards = document.querySelectorAll('.service-card');
		cards.forEach(card => {
			const text = card.textContent.toLowerCase();
			const category = card.getAttribute('data-category');
			
			const matchesSearch = text.includes(searchValue);
			const matchesCategory = categoryValue === 'all' || category === categoryValue;
			
			card.style.display = matchesSearch && matchesCategory ? '' : 'none';
		});
	}

	// Generiere Karten aus den Tabellendaten
	function generateCards() {
		const cardsGrid = document.querySelector('.cards-grid');
		// Nur generieren, wenn noch keine Karten vorhanden sind
		if (cardsGrid && cardsGrid.children.length === 0) {
			const rows = document.querySelectorAll('#dienste-table tbody tr');
			
			rows.forEach(row => {
				const cells = row.querySelectorAll('td');
				const category = row.getAttribute('data-category');
				
				const card = document.createElement('div');
				card.className = 'service-card';
				card.setAttribute('data-category', category);
				
				const cardHeader = document.createElement('div');
				cardHeader.className = 'card-header';
				
				const title = document.createElement('h3');
				title.textContent = cells[0].textContent;
				
				const categoryBadge = document.createElement('span');
				categoryBadge.className = 'category-badge';
				categoryBadge.textContent = cells[1].textContent;
				
				cardHeader.appendChild(title);
				cardHeader.appendChild(categoryBadge);
				
				const cardBody = document.createElement('div');
				cardBody.className = 'card-body';
				
				const description = document.createElement('p');
				description.className = 'description';
				description.textContent = cells[2].textContent;
				
				const details = document.createElement('div');
				details.className = 'details';
				
				details.innerHTML = `
					<div><strong>Ports:</strong> ${cells[3].textContent}</div>
					<div><strong>Protokolle:</strong> ${cells[4].textContent}</div>
					<div><strong>Beispiele:</strong> ${cells[5].textContent}</div>
				`;
				
				cardBody.appendChild(description);
				cardBody.appendChild(details);
				
				card.appendChild(cardHeader);
				card.appendChild(cardBody);
				
				cardsGrid.appendChild(card);
			});
		}
	}
});

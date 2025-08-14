document.addEventListener('DOMContentLoaded', () => {
	// Suche mit Debounce
	const input = document.getElementById('search-input');
	const table = document.getElementById('dienste-table');
	let timer = null;

	function filter(q){
		const s = q.trim().toLowerCase();
		const rows = table.querySelectorAll('tbody tr');
		rows.forEach(r => {
			const txt = r.textContent.toLowerCase();
			r.style.display = s === '' || txt.includes(s) ? '' : 'none';
		});
	}

	if (input){
		input.addEventListener('input', (e) => {
			clearTimeout(timer);
			timer = setTimeout(() => filter(e.target.value), 150);
		});
	}

	// View toggle: table <-> cards
	const viewBtn = document.getElementById('view-toggle');
	if (viewBtn && table){
		viewBtn.addEventListener('click', () => {
			const isCards = table.classList.toggle('cards');
			viewBtn.textContent = isCards ? 'Tabellenansicht' : 'Kartenansicht';
			viewBtn.setAttribute('aria-pressed', String(isCards));
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
});

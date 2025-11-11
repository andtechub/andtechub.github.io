const RAPIDAPI_ENDPOINT = 'https://reddit-meme.p.rapidapi.com/memes/trending';
const RAPIDAPI_HEADERS = {
    'X-Rapidapi-Key': '84a64b9b65msh08a90b9ba3f4f71p1cb190jsn26dd6170e1b7',
    'X-Rapidapi-Host': 'reddit-meme.p.rapidapi.com'
};

let lastMemeUrl = null;

function formatTimestamp(unixSeconds) {
    try {
        const d = new Date(unixSeconds * 1000);
        return d.toLocaleString();
    } catch {
        return '';
    }
}

async function fetchMemes() {
    const feed = document.getElementById('memes-feed');
    feed.innerHTML = '<p>Memes werden geladen...</p>';
    try {
        // Cache-Busting, damit bei "Neuladen" nicht immer dieselben
        // Antworten aus einem Cache kommen
        const url = `${RAPIDAPI_ENDPOINT}?ts=${Date.now()}`;
        const res = await fetch(url, {
            headers: RAPIDAPI_HEADERS,
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();

        // Expecting an array like: [{ created_utc, title, url, subreddit }, ...]
        const memes = Array.isArray(data) ? data : [];
        feed.innerHTML = '';

        if (memes.length === 0) {
            feed.innerHTML = '<p>Keine Memes gefunden.</p>';
            return;
        }

        // Nur EIN Meme anzeigen, per Zufall (möglichst nicht dasselbe wie zuletzt)
        const candidates = memes.filter(m => m && m.url);
        if (candidates.length === 0) {
            feed.innerHTML = '<p>Keine gültigen Memes gefunden.</p>';
            return;
        }

        let index = Math.floor(Math.random() * candidates.length);
        if (candidates.length > 1 && lastMemeUrl) {
            let tries = candidates.length;
            while (tries-- > 0 && candidates[index].url === lastMemeUrl) {
                index = Math.floor(Math.random() * candidates.length);
            }
        }

        const meme = candidates[index];
        lastMemeUrl = meme.url;

        const memeDiv = document.createElement('div');
        memeDiv.className = 'meme';
        const safeTitle = meme.title ? String(meme.title) : 'Meme';
        const safeUrl = meme.url ? String(meme.url) : '';
        const sub = meme.subreddit ? `r/${meme.subreddit}` : '';
        const time = meme.created_utc ? formatTimestamp(meme.created_utc) : '';

        memeDiv.innerHTML = `
            <div class="meme-title">${safeTitle}</div>
            <img class="meme-img" src="${safeUrl}" alt="${safeTitle}" loading="lazy">
            <div class="meme-meta">${[sub, time].filter(Boolean).join(' • ')}</div>
        `;
        feed.appendChild(memeDiv);
    } catch (err) {
        console.error('Memes laden fehlgeschlagen:', err);
        feed.innerHTML = '<p>Fehler beim Laden der Memes.</p>';
    }
}

document.getElementById('reload-btn').addEventListener('click', fetchMemes);
window.addEventListener('DOMContentLoaded', fetchMemes);

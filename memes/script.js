async function fetchMemes() {
    const feed = document.getElementById('memes-feed');
    feed.innerHTML = '<p>Memes werden geladen...</p>';
    try {
        const memePromises = [1,2,3].map(() => fetch('https://api.andyproject.de/v1/fun/memes/').then(res => res.json()));
        const memes = await Promise.all(memePromises);
        feed.innerHTML = '';
        memes.forEach(meme => {
            const memeDiv = document.createElement('div');
            memeDiv.className = 'meme';
            memeDiv.innerHTML = `
                <div class="meme-title">${meme.title}</div>
                <img class="meme-img" src="${meme.url}" alt="${meme.title}">
            `;
            feed.appendChild(memeDiv);
        });
    } catch (err) {
        feed.innerHTML = '<p>Fehler beim Laden der Memes.</p>';
    }
}

document.getElementById('reload-btn').addEventListener('click', fetchMemes);
window.addEventListener('DOMContentLoaded', fetchMemes);

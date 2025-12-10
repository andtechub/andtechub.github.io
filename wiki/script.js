// Dynamische Wiki-Ansicht: listet alle Markdown-Dateien unter ./data
// und zeigt sie nach Ordnerstruktur (Kategorien/Subkategorien) an.

const DATA_ROOT = 'data';
let currentArticle = null;

function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Volle GitHub-Markdown-Unterstuetzung via marked + DOMPurify
function configureMarked() {
    if (typeof marked !== 'undefined') {
        marked.setOptions({
            gfm: true,
            breaks: true,
            headerIds: true,
            mangle: false
        });
    }
}

function markdownToHtml(md) {
    const raw = (typeof marked !== 'undefined')
        ? marked.parse(String(md || ''))
        : `<pre><code>${escapeHtml(String(md || ''))}</code></pre>`;
    const safe = (typeof DOMPurify !== 'undefined')
        ? DOMPurify.sanitize(raw, { ADD_ATTR: ['target', 'rel'] })
        : raw;
    return safe;
}

// GitHub Pages: Repo aus Host ableiten (user/org pages)
function detectGithubRepo() {
    const host = (location.hostname || '').toLowerCase();
    if (/^[a-z0-9-]+\.github\.io$/.test(host)) {
        const owner = host.split('.')[0];
        const repo = host; // user/org pages: repo == owner.github.io
        return { owner, repo };
    }
    return null;
}

async function fetchGithubJson(urls) {
    for (const url of urls) {
        try {
            const res = await fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } });
            if (res.ok) return res.json();
        } catch (_) { /* try next */ }
    }
    throw new Error('Kann Verzeichnisstruktur nicht laden.');
}

// Liste aller Markdown-Dateien via GitHub API (Fallback fuer Laufzeit-Discovery)
async function listMarkdownViaGithubAPI() {
    const repoInfo = detectGithubRepo();
    if (!repoInfo) return [];
    const { owner, repo } = repoInfo;
    const base = `https://api.github.com/repos/${owner}/${repo}/contents`;

    async function walk(path) {
        const urls = [
            `${base}/${path}?ref=main`,
            `${base}/${path}?ref=master`,
        ];
        const items = await fetchGithubJson(urls);
        let files = [];
        for (const it of items) {
            if (it.type === 'dir') {
                files = files.concat(await walk(it.path));
            } else if (it.type === 'file' && /\.(md|markdown|mkdn|mkd)$/i.test(it.name)) {
                files.push(it.path);
            }
        }
        return files;
    }

    try {
        return await walk('wiki/data');
    } catch (e) {
        console.warn('GitHub API Listing fehlgeschlagen:', e);
        return [];
    }
}

// Optionaler statischer Index (fuer lokale Nutzung ohne API)
async function listFromIndexJson() {
    try {
        const res = await fetch(`${DATA_ROOT}/index.json`, { cache: 'no-cache' });
        if (!res.ok) return [];
        const arr = await res.json();
        if (Array.isArray(arr)) return arr.map(String);
        return [];
    } catch (_) {
        return [];
    }
}

function sitePathFromRepoPath(repoPath) {
    // Aus API-Pfaden (wiki/data/...) -> relative Seite (data/...)
    return String(repoPath || '').replace(/^\/?wiki\//i, '');
}

function prettySegment(seg) {
    return seg.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function prettyCategoryPath(catPath) {
    if (!catPath) return 'Allgemein';
    return catPath.split('/').map(prettySegment).join(' / ');
}

function deriveCatSubAndTitle(relPath) {
    // relPath: data/<category>/<sub...>/file.md
    const parts = relPath.split('/').filter(Boolean);
    const dataIdx = parts.indexOf('data');
    const category = parts[dataIdx + 1] || 'Allgemein';
    const subParts = parts.slice(dataIdx + 2, -1); // kann leer sein
    const subKey = subParts.length ? subParts.join('/') : '';
    const file = parts[parts.length - 1] || '';
    const titleRaw = file.replace(/\.(md|markdown|mkdn|mkd)$/i, '');
    const title = prettySegment(titleRaw);
    return { category, subKey, title };
}

async function discoverArticles() {
    // 1) Statischer Index bevorzugt
    let files = await listFromIndexJson();
    if (!files.length) {
        // 2) Fallback GitHub API
        const apiFiles = await listMarkdownViaGithubAPI();
        files = apiFiles.map(sitePathFromRepoPath);
    }
    // Nur Markdown unter data/
    const filtered = files.filter(p => /^data\//i.test(p) && /\.(md|markdown|mkdn|mkd)$/i.test(p));
    return Array.from(new Set(filtered));
}

function buildTree(paths) {
    // Map: category -> Map(subKey -> [{ path, title }])
    const tree = new Map();
    for (const p of paths) {
        const { category, subKey, title } = deriveCatSubAndTitle(p);
        if (!tree.has(category)) tree.set(category, new Map());
        const subMap = tree.get(category);
        const key = subKey; // '' == Allgemein
        if (!subMap.has(key)) subMap.set(key, []);
        subMap.get(key).push({ path: p, title });
    }
    // Sort categories, subcategories, and articles
    const sortedCats = new Map([...tree.entries()].sort((a, b) => a[0].localeCompare(b[0])));
    for (const [cat, subMap] of sortedCats) {
        const sortedSub = new Map([...subMap.entries()].sort((a, b) => a[0].localeCompare(b[0])));
        for (const [sub, arr] of sortedSub) arr.sort((a, b) => a.title.localeCompare(b.title));
        sortedCats.set(cat, sortedSub);
    }
    return sortedCats;
}

function clearActiveLinks() {
    document.querySelectorAll('.article-link').forEach(link => link.classList.remove('active'));
}

function selectArticleLink(linkEl) {
    clearActiveLinks();
    linkEl.classList.add('active');
    currentArticle = linkEl;
}

async function loadArticleByPath(relPath) {
    const articleContainer = document.getElementById('article');
    articleContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

    try {
        const res = await fetch(relPath, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const md = await res.text();
        const html = markdownToHtml(md);
        articleContainer.innerHTML = html;

        // Syntax-Highlighting
        try {
            if (typeof hljs !== 'undefined') {
                articleContainer.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
            }
        } catch (_) {}

        // Relative Links/Bilder relativ zum Dateiordner aufloesen
        try {
            const baseDir = relPath.split('/').slice(0, -1).join('/');
            articleContainer.querySelectorAll('a[href]').forEach(a => {
                const href = a.getAttribute('href');
                if (!href) return;
                if (/^(?:[a-z]+:)?\/\//i.test(href)) return; // absolut
                if (href.startsWith('#') || href.startsWith('mailto:')) return;
                if (href.startsWith('/')) return; // site-root
                a.setAttribute('href', `${baseDir}/${href}`);
            });
            articleContainer.querySelectorAll('img[src]').forEach(img => {
                const src = img.getAttribute('src');
                if (!src) return;
                if (/^(?:[a-z]+:)?\/\//i.test(src)) return; // absolut
                if (src.startsWith('/')) return; // site-root
                img.setAttribute('src', `${baseDir}/${src}`);
            });
        } catch (_) {}

        // Animation und Deep-Link
        articleContainer.scrollTo({ top: 0, behavior: 'smooth' });
        articleContainer.style.opacity = '0';
        articleContainer.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
            articleContainer.style.transition = 'all 0.3s ease';
            articleContainer.style.opacity = '1';
            articleContainer.style.transform = 'translateY(0)';
        });
        try {
            const url = new URL(window.location);
            url.hash = `#p=${encodeURIComponent(relPath)}`;
            history.replaceState(null, '', url);
        } catch (_) {}
    } catch (error) {
        console.error('Error loading article:', error);
        articleContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <h2 style="color: #da3633; margin-bottom: 1rem;">Fehler beim Laden</h2>
                <p>Der Artikel konnte nicht geladen werden.</p>
                <p style="font-size: 0.9rem; margin-top: 1rem;">Fehler: ${error.message}</p>
            </div>
        `;
    }
}

function renderCategories(tree) {
    const container = document.getElementById('categories');
    container.innerHTML = '';

    for (const [category, subMap] of tree) {
        const catDiv = document.createElement('div');
        catDiv.className = 'category';

        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = prettySegment(category);
        catDiv.appendChild(title);

        // Artikel der ersten Ebene (ohne Unterkategorie)
        const firstLevel = subMap.get('') || [];
        if (firstLevel.length) {
            const firstList = document.createElement('div');
            firstList.className = 'articles first-level';
            for (const article of firstLevel) {
                const link = document.createElement('a');
                link.className = 'article-link';
                link.textContent = article.title;
                link.href = '#';
                link.dataset.path = article.path;
                link.onclick = (e) => {
                    e.preventDefault();
                    selectArticleLink(link);
                    loadArticleByPath(article.path);
                    catDiv.classList.add('open');
                    return false;
                };
                firstList.appendChild(link);
            }
            catDiv.appendChild(firstList);
        }

        // Unterkategorien
        const subWrap = document.createElement('div');
        subWrap.className = 'subcategories';

        for (const [subKey, articles] of subMap) {
            if (subKey === '') continue; // schon oben behandelt
            const subDiv = document.createElement('div');
            subDiv.className = 'subcategory';

            const subTitle = document.createElement('div');
            subTitle.className = 'subcategory-title';
            subTitle.textContent = prettyCategoryPath(subKey);
            subDiv.appendChild(subTitle);

            const list = document.createElement('div');
            list.className = 'articles';
            for (const article of articles) {
                const link = document.createElement('a');
                link.className = 'article-link';
                link.textContent = article.title;
                link.href = '#';
                link.dataset.path = article.path;
                link.onclick = (e) => {
                    e.preventDefault();
                    selectArticleLink(link);
                    loadArticleByPath(article.path);
                    catDiv.classList.add('open');
                    subDiv.classList.add('open');
                    return false;
                };
                list.appendChild(link);
            }
            subDiv.appendChild(list);

            subTitle.addEventListener('click', () => {
                subDiv.classList.toggle('open');
                if (subDiv.classList.contains('open')) catDiv.classList.add('open');
            });

            subWrap.appendChild(subDiv);
        }

        catDiv.appendChild(subWrap);
        title.addEventListener('click', () => {
            catDiv.classList.toggle('open');
        });
        container.appendChild(catDiv);
    }
}

function getPathFromHash() {
    if (!location.hash) return null;
    const m = location.hash.match(/#p=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : null;
}

// Tastatur-Navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const links = Array.from(document.querySelectorAll('.article-link'));
        const currentIndex = currentArticle ? links.indexOf(currentArticle) : -1;
        let nextIndex;
        if (e.key === 'ArrowDown') {
            nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0;
        } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1;
        }
        if (links[nextIndex]) {
            links[nextIndex].click();
            links[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        e.preventDefault();
    }
});

async function init() {
    // Markdown Renderer konfigurieren
    configureMarked();

    // Einstiegstransition
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    setTimeout(() => {
        document.body.style.transition = 'all 0.5s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 50);

    const paths = await discoverArticles();
    if (!paths.length) {
        document.getElementById('categories').innerHTML = '<div class="category"><div class="category-title">Keine Artikel gefunden</div><p class="article-link" style="cursor:default;color:var(--text-secondary)">Lege Markdown-Dateien (.md) unter ./wiki/data an.</p></div>';
        return;
    }

    const tree = buildTree(paths);
    renderCategories(tree);

    // Initialen Artikel laden (Hash bevorzugt)
    const initial = getPathFromHash();
    const firstPath = initial && paths.includes(initial) ? initial : paths[0];
    const firstLink = Array.from(document.querySelectorAll('.article-link')).find(a => a.dataset.path === firstPath);
    if (firstLink) {
        const categoryEl = firstLink.closest('.category');
        const subEl = firstLink.closest('.subcategory');
        if (categoryEl) categoryEl.classList.add('open');
        if (subEl) subEl.classList.add('open');
        selectArticleLink(firstLink);
        loadArticleByPath(firstPath);
    }
}

document.addEventListener('DOMContentLoaded', init);


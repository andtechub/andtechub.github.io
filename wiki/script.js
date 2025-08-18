// Automatische Indexierung und Anzeige der Kategorien und Artikel
// Die Struktur wird hier als Beispiel statisch definiert, kann aber dynamisch generiert werden

const categories = {
    "LF1": ["Test.md"]
    // Weitere Kategorien und Artikel können hier ergänzt werden
};

let currentArticle = null;

function renderCategories() {
    const container = document.getElementById('categories');
    container.innerHTML = '';
    
    Object.keys(categories).forEach(category => {
        const catDiv = document.createElement('div');
        catDiv.className = 'category';
        
        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = category;
        catDiv.appendChild(title);
        
        categories[category].forEach(article => {
            const link = document.createElement('a');
            link.className = 'article-link';
            link.textContent = article.replace('.md', '');
            link.href = '#';
            link.dataset.category = category;
            link.dataset.article = article;
            
            link.onclick = (e) => {
                e.preventDefault();
                selectArticle(link);
                loadArticle(category, article);
                return false;
            };
            
            catDiv.appendChild(link);
        });
        
        container.appendChild(catDiv);
    });
}

function selectArticle(selectedLink) {
    // Remove active class from all links
    document.querySelectorAll('.article-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to selected link
    selectedLink.classList.add('active');
    currentArticle = selectedLink;
}

function loadArticle(category, article) {
    const articleContainer = document.getElementById('article');
    
    // Show loading state
    articleContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        fetch(`${category}/${article}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.text();
            })
            .then(md => {
                const html = markdownToHtml(md);
                articleContainer.innerHTML = html;
                
                // Smooth scroll to top of article
                articleContainer.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Add fade-in animation
                articleContainer.style.opacity = '0';
                articleContainer.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                    articleContainer.style.transition = 'all 0.3s ease';
                    articleContainer.style.opacity = '1';
                    articleContainer.style.transform = 'translateY(0)';
                });
            })
            .catch(error => {
                console.error('Error loading article:', error);
                articleContainer.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                        <h2 style="color: #da3633; margin-bottom: 1rem;">❌ Fehler beim Laden</h2>
                        <p>Der Artikel konnte nicht geladen werden.</p>
                        <p style="font-size: 0.9rem; margin-top: 1rem;">Fehler: ${error.message}</p>
                    </div>
                `;
            });
    }, 300);
}

// Einfache Markdown-zu-HTML-Konvertierung (erweitert)
function markdownToHtml(md) {
    let html = md
        // Headers
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        
        // Code blocks
        .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
        
        // Inline code
        .replace(/`([^`]+)`/gim, '<code>$1</code>')
        
        // Bold and italic
        .replace(/\*\*\*(.*?)\*\*\*/gim, '<b><i>$1</i></b>')
        .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
        .replace(/\*(.*?)\*/gim, '<i>$1</i>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
        
        // Blockquotes
        .replace(/^> (.+$)/gim, '<blockquote>$1</blockquote>')
        
        // Lists
        .replace(/^\s*[-*+] (.+$)/gim, '<li>$1</li>')
        .replace(/^\s*\d+\. (.+$)/gim, '<li>$1</li>')
        
        // Line breaks and paragraphs
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    // Wrap content in paragraph tags
    if (html && !html.startsWith('<h1>')) {
        html = '<p>' + html + '</p>';
    }
    
    // Fix list formatting
    html = html.replace(/(<li>.*?<\/li>)/gims, function(match) {
        return '<ul>' + match + '</ul>';
    });
    
    // Clean up multiple consecutive list tags
    html = html.replace(/<\/ul>\s*<ul>/gim, '');
    
    return html;
}

// Keyboard navigation
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

// Initialize with smooth animation
document.addEventListener('DOMContentLoaded', function() {
    // Add initial animation to the page
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.style.transition = 'all 0.5s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
        
        renderCategories();
    }, 100);
});

// Initialize
renderCategories();

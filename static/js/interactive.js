// Bookstore Interactive Features (simplified)

document.addEventListener('DOMContentLoaded', function () {
    createScrollToTopButton();
    addWishlistFeature();
    addComparisonFeature();
});

// Only real book cards have a cover image block — login/register cards never do
function getBookCards() {
    return Array.from(document.querySelectorAll('.card')).filter(
        card => card.querySelector('.card-img-top')
    );
}

// Scroll to top button
function createScrollToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'btn btn-primary scroll-to-top';
    btn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        width: 50px; height: 50px; border-radius: 50%;
        display: none; z-index: 1000;
    `;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Wishlist (heart icon) — book cards only
function addWishlistFeature() {
    getBookCards().forEach(card => {
        card.style.position = 'relative';

        const btn = document.createElement('button');
        btn.className = 'wishlist-btn';
        btn.innerHTML = '<i class="far fa-heart"></i>';
        btn.style.cssText = `
            position: absolute; top: 10px; right: 10px;
            background: white; border: none; width: 40px; height: 40px;
            border-radius: 50%; cursor: pointer; z-index: 10;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2); color: #f5576c; font-size: 1.2rem;
        `;
        card.appendChild(btn);

        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const icon = btn.querySelector('i');
            const added = icon.classList.toggle('fas');
            icon.classList.toggle('far', !added);
            btn.style.background = added ? '#f5576c' : 'white';
            btn.style.color = added ? 'white' : '#f5576c';
            showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
        });
    });
}


// Compare checkboxes — book cards only
function addComparisonFeature() {
    const bar = document.createElement('div');
    bar.id = 'comparison-bar';
    bar.style.cssText = `
        position: fixed; bottom: 0; left: 0; right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #ffffff; padding: 1rem 1.5rem; transform: translateY(100%);
        transition: transform 0.3s; z-index: 999;
        display: flex; justify-content: space-between; align-items: center;
        font-weight: 600;
    `;
    bar.innerHTML = `
        <div><i class="fas fa-balance-scale"></i> Compare Books:
            <span id="compare-count">0</span> selected</div>
        <div>
            <button id="compare-now-btn" class="btn btn-light btn-sm" style="color:#667eea; font-weight:700; margin-right:8px;">
                Compare Now
            </button>
            <button class="btn btn-outline-light btn-sm" id="compare-clear-btn">Clear All</button>
        </div>
    `;
    document.body.appendChild(bar);

    getBookCards().forEach(card => {
        card.style.position = 'relative';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'compare-checkbox';
        cb.style.cssText = `
            position: absolute; top: 10px; left: 10px;
            width: 22px; height: 22px; z-index: 10; accent-color: #667eea;
        `;
        card.appendChild(cb);
        cb.addEventListener('change', updateCompareBar);
    });

    bar.querySelector('#compare-clear-btn').addEventListener('click', () => {
        document.querySelectorAll('.compare-checkbox').forEach(c => c.checked = false);
        updateCompareBar();
    });

    bar.querySelector('#compare-now-btn').addEventListener('click', showComparison);
}

function updateCompareBar() {
    const checked = document.querySelectorAll('.compare-checkbox:checked').length;
    document.getElementById('compare-count').textContent = checked;
    document.getElementById('comparison-bar').style.transform =
        checked > 0 ? 'translateY(0)' : 'translateY(100%)';
}

function showComparison() {
    const checked = document.querySelectorAll('.compare-checkbox:checked');
    if (checked.length < 2) {
        alert('Select at least 2 books to compare.');
        return;
    }

    let cols = '';
    checked.forEach(cb => {
        const card = cb.closest('.card');
        const img = card.querySelector('.card-img-top');
        const imgHtml = img && img.tagName === 'IMG'
            ? `<img src="${img.src}" style="width:100%; height:120px; object-fit:cover; border-radius:8px;">`
            : `<div style="width:100%; height:120px; background:#ccc; border-radius:8px; display:flex; align-items:center; justify-content:center;"><i class="fas fa-book fa-2x text-white"></i></div>`;

        const title = card.querySelector('.card-title')?.textContent.trim() || 'Untitled';
        const author = card.querySelector('.card-text.text-muted')?.textContent.trim() || 'N/A';
        const price = card.querySelector('.card-text strong')?.textContent.trim() || 'N/A';
        const stockBadge = card.querySelector('.badge');
        const stock = stockBadge ? stockBadge.textContent.trim() : 'N/A';
        const stockColor = stockBadge && stockBadge.classList.contains('bg-success') ? '#28a745' : '#dc3545';
        const link = card.querySelector('a.btn-primary')?.href || '#';

        cols += `
            <td style="vertical-align:top; padding:12px; border-left:1px solid #eee;">
                ${imgHtml}
                <div style="font-weight:700; margin:8px 0 4px;">${title}</div>
                <div style="color:#666; font-size:0.85rem; margin-bottom:6px;">${author}</div>
                <div style="font-weight:700; color:#28a745; margin-bottom:6px;">${price}</div>
                <div style="color:${stockColor}; font-weight:600; font-size:0.85rem; margin-bottom:10px;">${stock}</div>
                <a href="${link}" class="btn btn-sm btn-outline-primary w-100">View Details</a>
            </td>
        `;
    });

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.6);
        display: flex; align-items: center; justify-content: center; z-index: 2000;
        padding: 20px;
    `;
    modal.innerHTML = `
        <div style="background:white; color:#222; padding:20px; border-radius:10px; max-width:700px; width:100%; max-height:85vh; overflow:auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h5 style="margin:0;">Book Comparison</h5>
                <button class="btn-close" id="compare-close-btn" aria-label="Close"></button>
            </div>
            <table style="width:100%; border-collapse:collapse;">
                <tr>${cols}</tr>
            </table>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#compare-close-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}


function updateCompareBar() {
    const checked = document.querySelectorAll('.compare-checkbox:checked').length;
    document.getElementById('compare-count').textContent = checked;
    document.getElementById('comparison-bar').style.transform =
        checked > 0 ? 'translateY(0)' : 'translateY(100%)';
}

// Simple toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white; padding: 12px 20px; border-radius: 8px;
        z-index: 10001; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}
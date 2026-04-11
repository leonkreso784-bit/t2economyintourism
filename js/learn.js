// ===== SOKRAT STUDY — LEARN MODE =====

function renderLearnContent() {
    const container = document.getElementById('learnContent');
    if (!container) {
        console.error('Learn content container not found');
        return;
    }
    if (!currentData) {
        console.error('No current data for learn content');
        container.innerHTML = '<div class="learn-card"><div class="learn-card-content"><p>No content available. Please select a lesson.</p></div></div>';
        return;
    }
    
    container.innerHTML = '';
    
    const categories = Object.keys(currentData);
    if (categories.length === 0) {
        container.innerHTML = '<div class="learn-card"><div class="learn-card-content"><p>No categories found in this lesson.</p></div></div>';
        return;
    }
    
    categories.forEach(category => {
        const data = currentData[category];
        if (!data) return;
        
        const icon = data.icon || 'fa-book';
        const name = data.name || category;
        const flashcardsCount = data.flashcards ? data.flashcards.length : 0;
        const learnContent = data.learn && data.learn.content ? data.learn.content : '<p>No learn content available for this category.</p>';
        const learnImage = data.learn && data.learn.image ? data.learn.image : null;
        
        const card = document.createElement('div');
        card.className = 'learn-card';
        card.dataset.category = category;
        
        card.innerHTML = `
            <div class="learn-card-header">
                <h2 class="learn-card-title"><i class="fas ${icon}"></i> ${name}</h2>
                <span>${flashcardsCount} terms</span>
            </div>
            <div class="learn-card-content">
                ${learnImage ? `<img src="${learnImage}" alt="${name}" class="learn-image learn-zoomable" loading="lazy">` : ''}
                ${learnContent}
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Filter functionality - remove old listeners first
    const filterBtns = document.querySelectorAll('.learn-filter .filter-btn');
    filterBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    document.querySelectorAll('.learn-filter .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.learn-filter .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            document.querySelectorAll('.learn-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
            });
        });
    });
    
    enhanceLearnImages(container);
    cleanupLearnContentForMobile();
}

function enhanceLearnImages(container) {
    if (!container) return;

    container.querySelectorAll('.learn-card-content img').forEach(img => {
        img.classList.add('learn-image', 'learn-zoomable');
        img.setAttribute('loading', img.getAttribute('loading') || 'lazy');
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `Open image: ${img.alt || 'Learn image'}`);

        if (img.dataset.zoomBound === '1') return;

        img.addEventListener('click', () => {
            openLearnImageModal(img.src, img.alt || 'Learn image');
        });
        img.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLearnImageModal(img.src, img.alt || 'Learn image');
            }
        });

        img.dataset.zoomBound = '1';
    });
}

function initLearnImageModal() {
    const modal = document.getElementById('imageModal');
    const closeBtn = document.getElementById('imageModalClose');
    const backdrop = document.getElementById('imageModalBackdrop');

    if (!modal || !closeBtn || !backdrop) return;
    if (modal.dataset.initialized === '1') return;

    closeBtn.addEventListener('click', closeLearnImageModal);
    backdrop.addEventListener('click', closeLearnImageModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeLearnImageModal();
        }
    });

    modal.dataset.initialized = '1';
}

function openLearnImageModal(src, altText) {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('imageModalImg');
    const caption = document.getElementById('imageModalCaption');
    if (!modal || !img || !caption) return;

    img.src = src;
    img.alt = altText || 'Expanded learn image';
    caption.textContent = altText || 'Learn image';

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
}

function closeLearnImageModal() {
    const modal = document.getElementById('imageModal');
    const img = document.getElementById('imageModalImg');
    const caption = document.getElementById('imageModalCaption');
    if (!modal || !img || !caption) return;

    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    img.src = '';
    caption.textContent = '';
}

// Mobile cleanup — adds CSS classes, no inline style manipulation
function cleanupLearnContentForMobile() {
    const container = document.getElementById('learnContent');
    if (!container) return;

    if (window.innerWidth <= 767) {
        container.classList.add('mobile-view');
        container.querySelectorAll('.learn-card').forEach(card => {
            card.classList.add('mobile-card');
        });
    } else {
        container.classList.remove('mobile-view');
        container.querySelectorAll('.learn-card').forEach(card => {
            card.classList.remove('mobile-card');
        });
    }
}

window.cleanupLearnContentForMobile = cleanupLearnContentForMobile;

window.addEventListener('resize', cleanupLearnContentForMobile);
window.addEventListener('orientationchange', cleanupLearnContentForMobile);

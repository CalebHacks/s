// Main App JavaScript - Global functionality

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initSearch();
  initTooltips();
  updateBagCount();
  updateCompareCount();
});

/**
 * Initialize theme (dark/light mode)
 */
function initTheme() {
  const savedTheme = getFromStorage('theme', 'dark');
  applyTheme(savedTheme);
  
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Apply theme to document
 */
function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }
  saveToStorage('theme', theme);
  
  // Update toggle button icon
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' 
      ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
      : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.835 2.835 9 9 0 0121.165 15.354a9 9 0 01-8.835 8.835 9 9 0 01-8.835-8.835 9 9 0 018.835-8.835z"></path></svg>';
  }
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
  const currentTheme = getFromStorage('theme', 'dark');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

/**
 * Initialize navigation
 */
function initNavigation() {
  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Close mobile menu on link click
  const mobileNavLinks = mobileMenu?.querySelectorAll('a');
  mobileNavLinks?.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/**
 * Initialize global search
 */
function initSearch() {
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    const debouncedSearch = debounce((query) => {
      if (query.length >= 2) {
        // Navigate to database with search query
        window.location.href = `database.html?search=${encodeURIComponent(query)}`;
      }
    }, 300);
    
    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && e.target.value.length >= 2) {
        window.location.href = `database.html?search=${encodeURIComponent(e.target.value)}`;
      }
    });
  }
}

/**
 * Initialize tooltips
 */
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(el => {
    el.addEventListener('mouseenter', showTooltip);
    el.addEventListener('mouseleave', hideTooltip);
  });
}

/**
 * Show tooltip
 */
function showTooltip(e) {
  const tooltipText = e.target.dataset.tooltip;
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip fixed bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg z-50 max-w-xs';
  tooltip.textContent = tooltipText;
  document.body.appendChild(tooltip);
  
  const rect = e.target.getBoundingClientRect();
  tooltip.style.top = `${rect.bottom + 5}px`;
  tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
  
  e.target._tooltip = tooltip;
}

/**
 * Hide tooltip
 */
function hideTooltip(e) {
  if (e.target._tooltip) {
    e.target._tooltip.remove();
    e.target._tooltip = null;
  }
}

/**
 * Update bag count in navbar
 */
function updateBagCount() {
  const bagCountEl = document.getElementById('bag-count');
  const bag = getFromStorage('currentBag', []);
  if (bagCountEl) {
    bagCountEl.textContent = bag.length;
    bagCountEl.style.display = bag.length > 0 ? 'flex' : 'none';
  }
}

/**
 * Update compare count in navbar
 */
function updateCompareCount() {
  const compareCountEl = document.getElementById('compare-count');
  const compareQueue = getFromStorage('compareQueue', []);
  if (compareCountEl) {
    compareCountEl.textContent = compareQueue.length;
    compareCountEl.style.display = compareQueue.length > 0 ? 'flex' : 'none';
  }
}

/**
 * Add ball to bag
 */
function addToBag(ballId) {
  const bag = getFromStorage('currentBag', []);
  const ball = BALLS_DATA.find(b => b.id === ballId);
  
  if (!ball) {
    showToast('Ball not found', 'error');
    return;
  }
  
  if (bag.find(b => b.id === ballId)) {
    showToast('Ball already in bag', 'warning');
    return;
  }
  
  if (bag.length >= 6) {
    showToast('Bag is full (max 6 balls)', 'warning');
    return;
  }
  
  bag.push({
    id: ball.id,
    role: 'benchmark'
  });
  
  saveToStorage('currentBag', bag);
  updateBagCount();
  showToast(`${ball.name} added to bag`, 'success');
}

/**
 * Remove ball from bag
 */
function removeFromBag(ballId) {
  const bag = getFromStorage('currentBag', []);
  const filtered = bag.filter(b => b.id !== ballId);
  saveToStorage('currentBag', filtered);
  updateBagCount();
  showToast('Ball removed from bag', 'info');
}

/**
 * Add ball to compare queue
 */
function addToCompare(ballId) {
  const compareQueue = getFromStorage('compareQueue', []);
  const ball = BALLS_DATA.find(b => b.id === ballId);
  
  if (!ball) {
    showToast('Ball not found', 'error');
    return;
  }
  
  if (compareQueue.find(id => id === ballId)) {
    showToast('Ball already in compare', 'warning');
    return;
  }
  
  if (compareQueue.length >= 6) {
    showToast('Compare limit reached (max 6 balls)', 'warning');
    return;
  }
  
  compareQueue.push(ballId);
  saveToStorage('compareQueue', compareQueue);
  updateCompareCount();
  showToast(`${ball.name} added to compare`, 'success');
}

/**
 * Remove ball from compare queue
 */
function removeFromCompare(ballId) {
  const compareQueue = getFromStorage('compareQueue', []);
  const filtered = compareQueue.filter(id => id !== ballId);
  saveToStorage('compareQueue', filtered);
  updateCompareCount();
  showToast('Ball removed from compare', 'info');
}

/**
 * Clear compare queue
 */
function clearCompare() {
  saveToStorage('compareQueue', []);
  updateCompareCount();
  showToast('Compare cleared', 'info');
}

/**
 * Get ball by ID
 */
function getBallById(id) {
  return BALLS_DATA.find(b => b.id === id);
}

/**
 * Create ball card HTML
 */
function createBallCard(ball, options = {}) {
  const {
    showAddToBag = true,
    showAddToCompare = true,
    showDetails = true,
    compact = false
  } = options;
  
  const coverstockBadge = createBadge(
    ball.coverstockType,
    getCoverstockColor(ball.coverstockType)
  );
  const coreTypeBadge = createBadge(
    ball.coreType,
    getCoreTypeColor(ball.coreType)
  );
  const oilBadge = createBadge(
    ball.oilCondition,
    getOilConditionColor(ball.oilCondition),
    'xs'
  );
  
  return `
    <div class="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-ball-id="${ball.id}">
      <div class="relative h-48 bg-gray-700 overflow-hidden">
        <img 
          src="${ball.image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 400\'%3E%3Crect fill=\'%23374151\' width=\'400\' height=\'400\'/%3E%3C/svg%3E'}" 
          alt="${ball.name}"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute top-2 right-2 flex gap-1">
          ${oilBadge}
        </div>
      </div>
      <div class="p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-xs text-gray-400">${ball.brand}</span>
          <span class="text-xs text-gray-500">•</span>
          <span class="text-xs text-gray-400">${ball.releaseYear}</span>
        </div>
        <h3 class="text-lg font-bold text-white mb-2">${ball.name}</h3>
        <div class="flex flex-wrap gap-2 mb-3">
          ${coverstockBadge}
          ${coreTypeBadge}
        </div>
        <div class="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div class="bg-gray-700 rounded-lg px-3 py-2 text-center">
            <span class="text-gray-400 text-xs">RG</span>
            <div class="text-white font-semibold">${formatNumber(ball.rg, 3)}</div>
          </div>
          <div class="bg-gray-700 rounded-lg px-3 py-2 text-center">
            <span class="text-gray-400 text-xs">Diff</span>
            <div class="text-white font-semibold">${formatNumber(ball.differential, 3)}</div>
          </div>
        </div>
        <div class="flex gap-2 ${compact ? 'flex-col' : ''}">
          ${showAddToBag ? `
            <button 
              onclick="addToBag('${ball.id}')"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Bag
            </button>
          ` : ''}
          ${showAddToCompare ? `
            <button 
              onclick="addToCompare('${ball.id}')"
              class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Compare
            </button>
          ` : ''}
          ${showDetails ? `
            <a 
              href="ball-detail.html?id=${ball.id}"
              class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Details
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Create oil pattern card HTML
 */
function createOilPatternCard(pattern) {
  const difficultyBadge = createBadge(
    pattern.difficulty,
    getDifficultyColor(pattern.difficulty)
  );
  const orgBadge = createBadge(
    pattern.organization,
    pattern.organization === 'PBA' ? 'bg-red-500' : 
    pattern.organization === 'Sport' ? 'bg-purple-500' : 'bg-green-500'
  );
  
  return `
    <div class="bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300" data-pattern-id="${pattern.id}">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="text-lg font-bold text-white">${pattern.name}</h3>
          <p class="text-sm text-gray-400">${pattern.length} feet</p>
        </div>
        <div class="flex gap-2">
          ${orgBadge}
          ${difficultyBadge}
        </div>
      </div>
      <p class="text-sm text-gray-300 mb-3">${pattern.description}</p>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-gray-700 rounded px-2 py-1">
          <span class="text-gray-400">Volume:</span>
          <span class="text-white ml-1">${pattern.volume || 'N/A'}</span>
        </div>
        <div class="bg-gray-700 rounded px-2 py-1">
          <span class="text-gray-400">Ratio:</span>
          <span class="text-white ml-1">${pattern.oilRatio || 'N/A'}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Back to top button functionality
 */
function initBackToTop() {
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.remove('hidden');
      } else {
        backToTop.classList.add('hidden');
      }
    });
    
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Initialize back to top
initBackToTop();

// Export functions for use in other pages
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initTheme,
    applyTheme,
    toggleTheme,
    updateBagCount,
    updateCompareCount,
    addToBag,
    removeFromBag,
    addToCompare,
    removeFromCompare,
    clearCompare,
    getBallById,
    createBallCard,
    createOilPatternCard
  };
}

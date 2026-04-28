// Utility Functions for Bowling Ball App

/**
 * Generate a unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Save data to localStorage
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return false;
  }
}

/**
 * Get data from localStorage
 */
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error reading from localStorage:', e);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing from localStorage:', e);
    return false;
  }
}

/**
 * Debounce function for search inputs
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Format a number to fixed decimal places
 */
function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return 'N/A';
  return Number(num).toFixed(decimals);
}

/**
 * Get coverstock type badge color
 */
function getCoverstockColor(type) {
  const colors = {
    solid: 'bg-red-500',
    pearl: 'bg-blue-500',
    hybrid: 'bg-purple-500',
    urethane: 'bg-green-500',
    plastic: 'bg-gray-500'
  };
  return colors[type] || 'bg-gray-500';
}

/**
 * Get core type badge color
 */
function getCoreTypeColor(type) {
  const colors = {
    symmetrical: 'bg-teal-500',
    asymmetrical: 'bg-orange-500'
  };
  return colors[type] || 'bg-gray-500';
}

/**
 * Get oil condition badge color
 */
function getOilConditionColor(condition) {
  const colors = {
    dry: 'bg-yellow-400',
    light: 'bg-yellow-500',
    'light-medium': 'bg-yellow-600',
    medium: 'bg-green-500',
    'medium-heavy': 'bg-blue-500',
    heavy: 'bg-red-500'
  };
  return colors[condition] || 'bg-gray-500';
}

/**
 * Get difficulty badge color
 */
function getDifficultyColor(difficulty) {
  const colors = {
    easy: 'bg-green-500',
    'easy-medium': 'bg-lime-500',
    medium: 'bg-yellow-500',
    hard: 'bg-orange-500',
    'very hard': 'bg-red-500'
  };
  return colors[difficulty] || 'bg-gray-500';
}

/**
 * Get rating bar color based on value
 */
function getRatingColor(value) {
  if (value >= 8) return 'bg-green-500';
  if (value >= 6) return 'bg-yellow-500';
  if (value >= 4) return 'bg-orange-500';
  return 'bg-red-500';
}

/**
 * Create a badge element
 */
function createBadge(text, colorClass, size = 'sm') {
  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };
  return `<span class="${colorClass} ${sizeClasses[size]} rounded-full text-white font-medium">${text}</span>`;
}

/**
 * Create a rating bar element
 */
function createRatingBar(label, value, maxValue = 10) {
  const percentage = (value / maxValue) * 100;
  const color = getRatingColor(value);
  return `
    <div class="mb-2">
      <div class="flex justify-between text-sm mb-1">
        <span class="text-gray-300">${label}</span>
        <span class="text-white font-medium">${value}/${maxValue}</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2">
        <div class="${color} h-2 rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
      </div>
    </div>
  `;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Get URL parameter value
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Set URL parameter without reloading
 */
function setUrlParam(param, value) {
  const url = new URL(window.location);
  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  window.history.pushState({}, '', url);
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
  const toast = document.createElement('div');
  const typeClasses = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  };
  
  toast.className = `${typeClasses[type]} text-white px-6 py-3 rounded-lg shadow-lg fixed bottom-4 right-4 z-50 transition-all duration-300 transform translate-y-full opacity-0`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-full', 'opacity-0');
  }, 100);
  
  // Animate out and remove
  setTimeout(() => {
    toast.classList.add('translate-y-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Create modal dialog
 */
function createModal(title, content, onClose) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
  modal.innerHTML = `
    <div class="bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
      <div class="flex justify-between items-center p-4 border-b border-gray-700">
        <h3 class="text-xl font-bold text-white">${escapeHtml(title)}</h3>
        <button class="modal-close text-gray-400 hover:text-white transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="p-4">${content}</div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close handlers
  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', () => {
    modal.remove();
    if (onClose) onClose();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
      if (onClose) onClose();
    }
  });
  
  // Close on escape
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', handleEscape);
      if (onClose) onClose();
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  return modal;
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Truncate text with ellipsis
 */
function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get all unique brands from balls data
 */
function getUniqueBrands(balls) {
  return [...new Set(balls.map(ball => ball.brand))].sort();
}

/**
 * Get all unique years from balls data
 */
function getUniqueYears(balls) {
  return [...new Set(balls.map(ball => ball.releaseYear))].sort((a, b) => b - a);
}

/**
 * Get all unique coverstock types
 */
function getUniqueCoverstockTypes(balls) {
  return [...new Set(balls.map(ball => ball.coverstockType))].sort();
}

/**
 * Get all unique core types
 */
function getUniqueCoreTypes(balls) {
  return [...new Set(balls.map(ball => ball.coreType))].sort();
}

/**
 * Lazy load image with placeholder
 */
function lazyLoadImage(imgElement, placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E') {
  imgElement.src = placeholder;
  if (imgElement.dataset.src) {
    const img = new Image();
    img.onload = () => {
      imgElement.src = imgElement.dataset.src;
    };
    img.src = imgElement.dataset.src;
  }
}

/**
 * Compare two balls for similarity
 */
function calculateBallSimilarity(ball1, ball2) {
  let similarity = 0;
  let factors = 0;
  
  // Compare RG (weight: 2)
  if (ball1.rg && ball2.rg) {
    const rgDiff = Math.abs(ball1.rg - ball2.rg);
    similarity += Math.max(0, 1 - rgDiff * 10) * 2;
    factors += 2;
  }
  
  // Compare Differential (weight: 2)
  if (ball1.differential && ball2.differential) {
    const diffDiff = Math.abs(ball1.differential - ball2.differential);
    similarity += Math.max(0, 1 - diffDiff * 20) * 2;
    factors += 2;
  }
  
  // Compare coverstock type (weight: 2)
  if (ball1.coverstockType === ball2.coverstockType) {
    similarity += 2;
  }
  factors += 2;
  
  // Compare core type (weight: 1)
  if (ball1.coreType === ball2.coreType) {
    similarity += 1;
  }
  factors += 1;
  
  // Compare oil condition (weight: 1)
  if (ball1.oilCondition === ball2.oilCondition) {
    similarity += 1;
  }
  factors += 1;
  
  return factors > 0 ? (similarity / factors) * 100 : 0;
}

/**
 * Find similar balls
 */
function findSimilarBalls(ball, allBalls, limit = 6) {
  return allBalls
    .filter(b => b.id !== ball.id)
    .map(b => ({
      ...b,
      similarity: calculateBallSimilarity(ball, b)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateId,
    saveToStorage,
    getFromStorage,
    removeFromStorage,
    debounce,
    formatNumber,
    getCoverstockColor,
    getCoreTypeColor,
    getOilConditionColor,
    getDifficultyColor,
    getRatingColor,
    createBadge,
    createRatingBar,
    escapeHtml,
    getUrlParam,
    setUrlParam,
    smoothScrollTo,
    showToast,
    createModal,
    formatDate,
    truncateText,
    getUniqueBrands,
    getUniqueYears,
    getUniqueCoverstockTypes,
    getUniqueCoreTypes,
    lazyLoadImage,
    calculateBallSimilarity,
    findSimilarBalls
  };
}

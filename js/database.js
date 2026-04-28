// Database Page JavaScript

let filteredBalls = [...BALLS_DATA];
let currentView = 'cards'; // 'cards' or 'table'

document.addEventListener('DOMContentLoaded', () => {
  initDatabasePage();
});

function initDatabasePage() {
  // Populate brand filter
  populateBrandFilter();
  
  // Load URL parameters
  loadUrlParams();
  
  // Initial render
  renderBalls();
  
  // Set up event listeners
  setupEventListeners();
}

function populateBrandFilter() {
  const brandSelect = document.getElementById('filter-brand');
  const brands = getUniqueBrands(BALLS_DATA);
  
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.value = brand;
    option.textContent = brand;
    brandSelect.appendChild(option);
  });
}

function loadUrlParams() {
  const searchParam = getUrlParam('search');
  const brandParam = getUrlParam('brand');
  const coverstockParam = getUrlParam('coverstockType');
  const coreTypeParam = getUrlParam('coreType');
  
  if (searchParam) {
    document.getElementById('database-search').value = searchParam;
  }
  if (brandParam) {
    document.getElementById('filter-brand').value = decodeURIComponent(brandParam);
  }
  if (coverstockParam) {
    document.getElementById('filter-coverstock').value = coverstockParam;
  }
  if (coreTypeParam) {
    const radio = document.querySelector(`input[name="core-type"][value="${coreTypeParam}"]`);
    if (radio) radio.checked = true;
  }
}

function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById('database-search');
  searchInput.addEventListener('input', debounce(applyFilters, 300));
  
  // Filter inputs
  document.getElementById('filter-brand').addEventListener('change', applyFilters);
  document.getElementById('filter-coverstock').addEventListener('change', applyFilters);
  document.getElementById('filter-oil').addEventListener('change', applyFilters);
  
  // Core type radios
  document.querySelectorAll('input[name="core-type"]').forEach(radio => {
    radio.addEventListener('change', applyFilters);
  });
  
  // Advanced filters
  document.getElementById('filter-year-min').addEventListener('input', applyFilters);
  document.getElementById('filter-year-max').addEventListener('input', applyFilters);
  document.getElementById('filter-rg-min').addEventListener('input', applyFilters);
  document.getElementById('filter-rg-max').addEventListener('input', applyFilters);
  document.getElementById('filter-diff-min').addEventListener('input', applyFilters);
  document.getElementById('filter-diff-max').addEventListener('input', applyFilters);
  
  // Toggle advanced filters
  document.getElementById('toggle-advanced-filters').addEventListener('click', () => {
    const advancedFilters = document.getElementById('advanced-filters');
    advancedFilters.classList.toggle('hidden');
  });
  
  // Sort options
  document.getElementById('sort-options').addEventListener('change', applyFilters);
  
  // View toggle
  document.getElementById('view-cards').addEventListener('click', () => setView('cards'));
  document.getElementById('view-table').addEventListener('click', () => setView('table'));
  
  // Clear filters
  document.getElementById('clear-filters').addEventListener('click', clearFilters);
}

function applyFilters() {
  const searchTerm = document.getElementById('database-search').value.toLowerCase().trim();
  const brand = document.getElementById('filter-brand').value;
  const coverstock = document.getElementById('filter-coverstock').value;
  const oilCondition = document.getElementById('filter-oil').value;
  const coreType = document.querySelector('input[name="core-type"]:checked')?.value || '';
  
  const yearMin = document.getElementById('filter-year-min').value;
  const yearMax = document.getElementById('filter-year-max').value;
  const rgMin = document.getElementById('filter-rg-min').value;
  const rgMax = document.getElementById('filter-rg-max').value;
  const diffMin = document.getElementById('filter-diff-min').value;
  const diffMax = document.getElementById('filter-diff-max').value;
  
  const sortBy = document.getElementById('sort-options').value;
  
  // Filter balls
  filteredBalls = BALLS_DATA.filter(ball => {
    // Search filter
    if (searchTerm) {
      const searchMatch = 
        ball.name.toLowerCase().includes(searchTerm) ||
        ball.brand.toLowerCase().includes(searchTerm) ||
        (ball.coreName && ball.coreName.toLowerCase().includes(searchTerm)) ||
        (ball.coverstockName && ball.coverstockName.toLowerCase().includes(searchTerm));
      
      if (!searchMatch) return false;
    }
    
    // Brand filter
    if (brand && ball.brand !== brand) return false;
    
    // Coverstock filter
    if (coverstock && ball.coverstockType !== coverstock) return false;
    
    // Oil condition filter
    if (oilCondition && ball.oilCondition !== oilCondition) return false;
    
    // Core type filter
    if (coreType && ball.coreType !== coreType) return false;
    
    // Year range filter
    if (yearMin && ball.releaseYear < parseInt(yearMin)) return false;
    if (yearMax && ball.releaseYear > parseInt(yearMax)) return false;
    
    // RG range filter
    if (rgMin && ball.rg && ball.rg < parseFloat(rgMin)) return false;
    if (rgMax && ball.rg && ball.rg > parseFloat(rgMax)) return false;
    
    // Differential range filter
    if (diffMin && ball.differential && ball.differential < parseFloat(diffMin)) return false;
    if (diffMax && ball.differential && ball.differential > parseFloat(diffMax)) return false;
    
    return true;
  });
  
  // Sort balls
  sortBalls(sortBy);
  
  // Render
  renderBalls();
}

function sortBalls(sortBy) {
  const [field, order] = sortBy.split('-');
  
  filteredBalls.sort((a, b) => {
    let comparison = 0;
    
    switch (field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'year':
        comparison = a.releaseYear - b.releaseYear;
        break;
      case 'rg':
        comparison = (a.rg || 0) - (b.rg || 0);
        break;
      case 'diff':
        comparison = (a.differential || 0) - (b.differential || 0);
        break;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
}

function renderBalls() {
  const container = document.getElementById('results-container');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');
  
  // Update count
  resultsCount.textContent = `Showing ${filteredBalls.length} of ${BALLS_DATA.length} balls`;
  
  if (filteredBalls.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');
  
  if (currentView === 'cards') {
    container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    container.innerHTML = filteredBalls.map(ball => createBallCard(ball)).join('');
  } else {
    renderTableView();
  }
}

function renderTableView() {
  const container = document.getElementById('results-container');
  container.className = 'space-y-4';
  
  const tableHtml = `
    <div class="bg-gray-800 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Ball</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Brand</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Year</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">RG</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Diff</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Core</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Cover</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            ${filteredBalls.map(ball => `
              <tr class="hover:bg-gray-700/50 transition-colors">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img src="${ball.image || ''}" alt="${ball.name}" class="w-10 h-10 rounded-lg object-cover bg-gray-600">
                    <span class="font-medium text-white">${ball.name}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-gray-300">${ball.brand}</td>
                <td class="px-4 py-3 text-center text-gray-300">${ball.releaseYear}</td>
                <td class="px-4 py-3 text-center text-gray-300">${formatNumber(ball.rg, 3)}</td>
                <td class="px-4 py-3 text-center text-gray-300">${formatNumber(ball.differential, 3)}</td>
                <td class="px-4 py-3 text-center">
                  ${createBadge(ball.coreType, getCoreTypeColor(ball.coreType), 'xs')}
                </td>
                <td class="px-4 py-3 text-center">
                  ${createBadge(ball.coverstockType, getCoverstockColor(ball.coverstockType), 'xs')}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-center gap-2">
                    <button onclick="addToBag('${ball.id}')" class="p-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors" title="Add to Bag">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </button>
                    <button onclick="addToCompare('${ball.id}')" class="p-2 bg-accent-600 hover:bg-accent-700 rounded-lg transition-colors" title="Add to Compare">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </button>
                    <a href="ball-detail.html?id=${ball.id}" class="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors" title="View Details">
                      <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </a>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  container.innerHTML = tableHtml;
}

function setView(view) {
  currentView = view;
  
  // Update button styles
  const cardsBtn = document.getElementById('view-cards');
  const tableBtn = document.getElementById('view-table');
  
  if (view === 'cards') {
    cardsBtn.classList.remove('bg-gray-700', 'text-gray-300');
    cardsBtn.classList.add('bg-primary-600', 'text-white');
    tableBtn.classList.remove('bg-primary-600', 'text-white');
    tableBtn.classList.add('bg-gray-700', 'text-gray-300');
  } else {
    tableBtn.classList.remove('bg-gray-700', 'text-gray-300');
    tableBtn.classList.add('bg-primary-600', 'text-white');
    cardsBtn.classList.remove('bg-primary-600', 'text-white');
    cardsBtn.classList.add('bg-gray-700', 'text-gray-300');
  }
  
  renderBalls();
}

function clearFilters() {
  // Reset all inputs
  document.getElementById('database-search').value = '';
  document.getElementById('filter-brand').value = '';
  document.getElementById('filter-coverstock').value = '';
  document.getElementById('filter-oil').value = '';
  document.querySelector('input[name="core-type"][value=""]').checked = true;
  document.getElementById('filter-year-min').value = '';
  document.getElementById('filter-year-max').value = '';
  document.getElementById('filter-rg-min').value = '';
  document.getElementById('filter-rg-max').value = '';
  document.getElementById('filter-diff-min').value = '';
  document.getElementById('filter-diff-max').value = '';
  document.getElementById('sort-options').value = 'name-asc';
  
  // Hide advanced filters
  document.getElementById('advanced-filters').classList.add('hidden');
  
  // Reset and render
  filteredBalls = [...BALLS_DATA];
  renderBalls();
}

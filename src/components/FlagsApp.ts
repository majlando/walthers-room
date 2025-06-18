import type { Country } from '../types/country';
import { CountriesService } from '../services/countriesService';
import { formatPopulation, formatArea } from '../utils/helpers';

export class FlagsApp {
  private countries: Country[] = [];
  private filteredCountries: Country[] = [];
  private searchTerm = '';
  private selectedRegion = 'all';  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    this.createLayout();
    this.attachEventListeners();
    await this.loadCountries();
  }
  private createLayout(): void {
    const app = document.getElementById('app');
    if (!app) return;    app.innerHTML = `
      <div class="min-h-screen bg-base-200">
        <!-- Sticky Header -->
        <header class="sticky top-0 z-50 glass-effect border-b border-base-300">
          <div class="max-w-7xl mx-auto px-4 py-4">
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <!-- Logo and Title -->
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg hover-scale">
                  <span class="text-white font-bold text-lg">W</span>
                </div>
                <div>                  <h1 class="text-2xl font-bold">Walther's Room</h1>
                  <p class="text-sm opacity-70">Explore the world's flags</p>
                </div>
              </div>

              <!-- Controls -->
              <div class="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <!-- Search -->                <div class="relative flex-1 lg:flex-none min-w-0">
                  <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60 text-lg pointer-events-none">search</span>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search countries, capitals..."
                    class="input input-bordered w-full lg:w-56 pl-10"
                    autocomplete="off"
                    spellcheck="false"
                  />
                </div>                <!-- Region Filter -->
                <div class="relative">
                  <select
                    id="region"
                    class="select select-bordered min-w-[140px]"
                  >
                    <option value="all">🌍 All Regions</option>
                    <option value="Africa">🌍 Africa</option>
                    <option value="Americas">🌎 Americas</option>
                    <option value="Asia">🌏 Asia</option>
                    <option value="Europe">🇪🇺 Europe</option>
                    <option value="Oceania">🏝️ Oceania</option>
                  </select>
                </div>

                <!-- Sort -->
                <div class="relative">
                  <select
                    id="sort"
                    class="select select-bordered min-w-[130px]"
                  >
                    <option value="name-asc">📝 A → Z</option>
                    <option value="name-desc">📝 Z → A</option>
                    <option value="population-desc">👥 Most People</option>
                    <option value="population-asc">👥 Least People</option>
                    <option value="area-desc">📏 Largest</option>
                    <option value="area-asc">📏 Smallest</option>
                  </select>
                </div>                <!-- Action Buttons -->
                <div class="flex items-center space-x-2">
                  <!-- Favorites Button -->
                  <button
                    id="favorites-button"
                    class="btn btn-sm btn-secondary btn-outline"
                    title="Open favorites panel"
                  >
                    <span class="material-icons text-sm">favorite_border</span>
                    <span class="hidden sm:inline">Favorites</span>
                  </button>

                  <!-- Comparison Button -->
                  <button
                    id="comparison-button"
                    class="btn btn-sm btn-neutral btn-outline"
                    title="Compare selected countries"
                  >
                    <span class="material-icons text-sm">compare</span>
                    <span class="hidden sm:inline">Compare</span>
                  </button>

                  <!-- Clear Filters -->
                  <button
                    id="clear-filters"
                    class="btn btn-sm btn-neutral btn-outline"
                    title="Clear all filters"
                  >
                    <span class="material-icons text-sm">clear_all</span>
                    <span class="hidden sm:inline">Clear</span>
                  </button>

                  <!-- Theme Toggle -->
                  <button
                    id="theme-toggle"
                    class="btn btn-sm btn-circle btn-ghost"
                    title="Toggle light/dark theme"
                  >
                    <span class="material-icons text-lg">light_mode</span>
                  </button>

                  <!-- Help Button -->
                  <button
                    id="help-button"
                    class="btn btn-sm btn-circle btn-ghost"
                    title="Help and keyboard shortcuts"
                  >
                    <span class="material-icons text-lg">help_outline</span>
                  </button>
                </div>
              </div>
            </div>            <!-- Enhanced Stats Bar -->
            <div class="mt-4 pt-3 border-t border-base-300">
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div id="stats" class="opacity-70 text-sm font-medium stats-counter">
                  Loading countries...
                </div>
                <div id="filter-tags" class="flex flex-wrap gap-2">
                  <!-- Filter tags will be added here -->
                </div>
              </div>
            </div>
          </div>
        </header>        <!-- Main Content -->
        <main class="pt-6">
          <!-- Loading -->
          <div id="loading" class="max-w-7xl mx-auto px-4 pb-8">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 rounded-full animate-spin shadow-lg">
                <span class="material-icons text-white text-xl">language</span>
              </div>              <div class="mt-6 space-y-2">
                <p class="text-lg font-medium">Loading Countries</p>
                <p class="text-sm opacity-70">Fetching data from around the world...</p>
                <div class="flex justify-center mt-4">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div class="w-2 h-2 bg-secondary rounded-full animate-pulse" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-accent rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Countries Grid -->
          <section class="max-w-7xl mx-auto px-4 pb-12">
            <div id="countries-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              <!-- Countries will be inserted here -->
            </div>
            
            <!-- Enhanced No Results -->            <div id="no-results" class="hidden text-center py-16">
              <div class="max-w-md mx-auto">
                <div class="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span class="material-icons text-3xl opacity-60">search_off</span>
                </div>
                <h3 class="text-xl font-semibold mb-3">No countries found</h3>
                <p class="opacity-70 mb-6 leading-relaxed">We couldn't find any countries matching your search criteria. Try adjusting your filters or search terms.</p>
                <div class="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    id="clear-search" 
                    class="btn btn-primary"
                  >
                    <span class="material-icons text-sm">clear</span>
                    Clear Search
                  </button>
                  <button 
                    id="show-all" 
                    class="btn btn-outline"                  >
                    <span class="material-icons text-sm">visibility</span>
                    Show All Countries
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    `;
  }
  private attachEventListeners(): void {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      // Update theme toggle icon based on current theme
      this.updateThemeToggleIcon();
      
      themeToggle.addEventListener('click', () => {
        this.themeManager.toggleTheme();
        this.updateThemeToggleIcon();
      });
    }

    // Search input with debouncing
    const searchInput = document.getElementById('search') as HTMLInputElement;
    if (searchInput) {
      const debouncedSearch = debounce((value: string) => {
        this.filters.searchTerm = value;
        this.applyFilters();
      }, 300);
      
      searchInput.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        debouncedSearch(target.value);
      });
    }

    // Region filter
    const regionSelect = document.getElementById('region') as HTMLSelectElement;
    if (regionSelect) {
      regionSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        this.filters.region = target.value;
        this.applyFilters();
      });
    }

    // Sort dropdown
    const sortSelect = document.getElementById('sort') as HTMLSelectElement;
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const [sortBy, sortOrder] = target.value.split('-');
        this.filters.sortBy = sortBy as 'name' | 'population' | 'area';
        this.filters.sortOrder = sortOrder as 'asc' | 'desc';
        this.applyFilters();
      });
    }

    // Clear filters button
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearFilters();
      });
    }

    // Country details modal (event delegation)
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const button = target.closest('.country-details-btn') as HTMLElement;
      if (button && button.dataset.country) {
        try {
          const country = JSON.parse(button.dataset.country) as Country;
          this.modal.show(country);
        } catch (error) {
          console.error('Error parsing country data:', error);
        }
      }
    });    // Favorites button
    const favoritesBtn = document.getElementById('favorites-button');
    if (favoritesBtn) {
      favoritesBtn.addEventListener('click', () => {
        this.favoritesPanel.show();
      });
    }

    // Comparison button
    const comparisonBtn = document.getElementById('comparison-button');
    if (comparisonBtn) {
      comparisonBtn.addEventListener('click', () => {
        if (this.selectedCountries.length === 0) {
          alert('Please select countries to compare by clicking on them.');
          return;
        }
        this.comparisonModal.show(this.selectedCountries);
      });
    }

    // Help button
    const helpBtn = document.getElementById('help-button');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.showHelpModal();
      });
    }

    // Favorite and comparison buttons (event delegation)
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      // Handle favorite button clicks
      const favoriteBtn = target.closest('.favorite-btn') as HTMLElement;
      if (favoriteBtn && favoriteBtn.dataset.country) {
        try {
          const country = JSON.parse(favoriteBtn.dataset.country) as Country;
          this.onToggleFavorite(country);
        } catch (error) {
          console.error('Error parsing country data for favorite:', error);
        }
      }
      
      // Handle compare button clicks
      const compareBtn = target.closest('.compare-btn') as HTMLElement;
      if (compareBtn && compareBtn.dataset.country) {
        try {
          const country = JSON.parse(compareBtn.dataset.country) as Country;
          this.onAddToComparison(country);
        } catch (error) {
          console.error('Error parsing country data for comparison:', error);
        }
      }
    });
  }
  private updateThemeToggleIcon(): void {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle?.querySelector('.material-icons');
    if (icon && themeToggle) {
      const isDark = this.themeManager.getCurrentTheme() === 'dark';
      icon.textContent = isDark ? 'dark_mode' : 'light_mode';
      themeToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  private async loadCountries(): Promise<void> {
    try {
      this.isLoading = true;
      this.showLoading(true);
      
      this.countries = await CountriesService.getAllCountries();
      this.filteredCountries = [...this.countries];
      
      this.applyFilters();
      this.showLoading(false);
    } catch (error) {
      console.error('Error loading countries:', error);
      this.showError('Failed to load countries. Please try again later.');
      this.showLoading(false);
    } finally {
      this.isLoading = false;
    }
  }

  private applyFilters(): void {
    let filtered = [...this.countries];

    // Apply region filter
    if (this.filters.region !== 'all') {
      filtered = filtered.filter(country => country.region === this.filters.region);
    }

    // Apply search filter
    if (this.filters.searchTerm) {
      const searchTerm = this.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm) ||
        country.name.official.toLowerCase().includes(searchTerm) ||
        (country.capital && country.capital.some(cap => 
          cap.toLowerCase().includes(searchTerm)
        ))
      );
    }

    // Apply sorting
    filtered = sortCountries(filtered, this.filters.sortBy, this.filters.sortOrder);    this.filteredCountries = filtered;
    this.renderCountries();
    this.updateStats();
    this.updateFilterTags();
    this.updateFilterTags();
  }  private renderCountries(): void {
    const grid = document.getElementById('countries-grid');
    const noResults = document.getElementById('no-results');
    
    if (!grid || !noResults) return;

    if (this.filteredCountries.length === 0) {
      grid.innerHTML = '';
      noResults.classList.remove('hidden');
    } else {
      noResults.classList.add('hidden');
      
      grid.innerHTML = this.filteredCountries
        .map(country => new CountryCard(country).render())
        .join('');
    }
  }private updateStats(): void {
    const statsElement = document.getElementById('stats');
    if (!statsElement) return;

    const total = this.countries.length;
    const filtered = this.filteredCountries.length;
    
    let statsText = '';
    if (this.isLoading) {
      statsText = 'Loading countries...';
    } else if (filtered === total) {
      statsText = `${total} countries`;
    } else {
      statsText = `${filtered} of ${total} countries`;
    }
    
    statsElement.textContent = statsText;
    
    // Announce to screen readers when filtering results
    if (!this.isLoading && filtered !== total) {
      this.announceToScreenReader(`Showing ${filtered} countries out of ${total} total`);
    }
  }

  private updateFilterTags(): void {
    const filterTagsContainer = document.getElementById('filter-tags');
    if (!filterTagsContainer) return;

    const tags: string[] = [];

    // Add region filter tag
    if (this.filters.region !== 'all') {
      const regionEmojis: {[key: string]: string} = {
        'Africa': '🌍',
        'Americas': '🌎', 
        'Asia': '🌏',
        'Europe': '🇪🇺',
        'Oceania': '🏝️'
      };
      tags.push(`${regionEmojis[this.filters.region]} ${this.filters.region}`);
    }

    // Add search filter tag
    if (this.filters.searchTerm) {
      tags.push(`🔍 "${this.filters.searchTerm}"`);
    }

    // Add sort filter tag if not default
    if (this.filters.sortBy !== 'name' || this.filters.sortOrder !== 'asc') {
      const sortLabels: {[key: string]: string} = {
        'name-asc': '📝 A → Z',
        'name-desc': '📝 Z → A',
        'population-desc': '👥 Most People',
        'population-asc': '👥 Least People',
        'area-desc': '📏 Largest',
        'area-asc': '📏 Smallest'
      };
      const sortKey = `${this.filters.sortBy}-${this.filters.sortOrder}`;
      tags.push(sortLabels[sortKey] || `Sort: ${this.filters.sortBy}`);
    }

    filterTagsContainer.innerHTML = tags.map(tag => `
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        ${tag}
      </span>
    `).join('');
  }
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Ctrl+F or Cmd+F to open favorites panel
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !e.shiftKey) {
        e.preventDefault();
        this.favoritesPanel.show();
      }

      // Ctrl+Shift+C or Cmd+Shift+C to open comparison (if countries selected)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (this.selectedCountries.length > 0) {
          this.comparisonModal.show(this.selectedCountries);
        }
      }      // Ctrl+Shift+R or Cmd+Shift+R to clear all filters
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        this.clearFilters();
      }

      // Ctrl+? or Cmd+? to open help modal
      if ((e.ctrlKey || e.metaKey) && e.key === '?') {
        e.preventDefault();
        this.showHelpModal();
      }

      // Escape to clear search when search is focused
      if (e.key === 'Escape') {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        if (searchInput === document.activeElement) {
          searchInput.blur();
          if (searchInput.value) {
            searchInput.value = '';
            this.filters.searchTerm = '';
            this.applyFilters();
          }
        }
      }
    });
  }

  private enhanceNoResultsHandlers(): void {
    // Handle clear search button in no results
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      
      if (target.closest('#clear-search')) {
        const searchInput = document.getElementById('search') as HTMLInputElement;
        if (searchInput) {
          searchInput.value = '';
          this.filters.searchTerm = '';
          this.applyFilters();
        }
      }
      
      if (target.closest('#show-all')) {
        this.clearFilters();
      }
    });
  }

  private enhanceAccessibility(): void {
    // Add skip link for keyboard navigation
    const skipLink = document.createElement('a');
    skipLink.href = '#countries-grid';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add aria-live region for dynamic updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);

    // Add proper ARIA labels and roles
    const searchInput = document.getElementById('search');
    const regionSelect = document.getElementById('region');
    const sortSelect = document.getElementById('sort');
    const countriesGrid = document.getElementById('countries-grid');

    if (searchInput) {
      searchInput.setAttribute('aria-label', 'Search countries by name or capital');
      searchInput.setAttribute('role', 'searchbox');
    }

    if (regionSelect) {
      regionSelect.setAttribute('aria-label', 'Filter countries by region');
    }

    if (sortSelect) {
      sortSelect.setAttribute('aria-label', 'Sort countries');
    }

    if (countriesGrid) {
      countriesGrid.setAttribute('role', 'main');
      countriesGrid.setAttribute('aria-label', 'Countries grid');
    }
  }

  private announceToScreenReader(message: string): void {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after a short delay to allow for re-announcements
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  private clearFilters(): void {
    this.filters = {
      region: 'all',
      searchTerm: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };

    // Reset form inputs
    const searchInput = document.getElementById('search') as HTMLInputElement;
    const regionSelect = document.getElementById('region') as HTMLSelectElement;
    const sortSelect = document.getElementById('sort') as HTMLSelectElement;

    if (searchInput) searchInput.value = '';
    if (regionSelect) regionSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'name-asc';

    this.applyFilters();
  }

  private showLoading(show: boolean): void {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('countries-grid');
    
    if (!loading || !grid) return;

    if (show) {
      loading.classList.remove('hidden');
      grid.innerHTML = '';
    } else {
      loading.classList.add('hidden');
    }
  }  private showError(message: string): void {
    const grid = document.getElementById('countries-grid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <span class="material-icons text-4xl text-red-400 mb-3">error</span>        <h3 class="text-lg font-semibold mb-2">Something went wrong</h3>
        <p class="opacity-70 mb-4 text-sm">${message}</p>
        <button 
          onclick="location.reload()" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center mx-auto"
        >
          <span class="material-icons mr-1 text-sm">refresh</span>
          Try Again
        </button>
      </div>
    `;
  }

  // Callback methods for favorites and comparison
  private onFavoriteCountrySelect(country: Country): void {
    this.modal.show(country);
  }

  private onToggleFavorite(country: Country): void {
    if (this.favoritesManager.isFavorite(country.cca2)) {
      this.favoritesManager.removeFavorite(country.cca2);
    } else {
      this.favoritesManager.addFavorite(country);
    }
    // Re-render cards to update favorite states
    this.renderCountries();
  }

  private onAddToComparison(country: Country): void {
    if (this.selectedCountries.length >= 3) {
      alert('You can compare up to 3 countries at once. Please remove one first.');
      return;
    }
    
    if (!this.selectedCountries.find(c => c.cca2 === country.cca2)) {
      this.selectedCountries.push(country);
      this.updateComparisonButton();
    }
  }
  private updateComparisonButton(): void {
    const button = document.getElementById('comparison-button');
    if (button) {
      const count = this.selectedCountries.length;
      const textSpan = button.querySelector('span:not(.material-icons)');
      if (textSpan) {
        textSpan.textContent = count > 0 ? `Compare (${count})` : 'Compare';
      }
      
      if (count > 0) {
        button.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
        button.classList.add('bg-blue-600', 'hover:bg-blue-700', 'text-white');
      } else {
        button.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'text-white');
        button.classList.add('bg-gray-100', 'hover:bg-gray-200', 'dark:bg-gray-700', 'dark:hover:bg-gray-600', 'text-gray-700', 'dark:text-gray-300');
      }
    }
  }

  private setupFavoritesCallbacks(): void {
    // Listen for favorites changes to update the favorites button
    this.favoritesManager.onFavoritesChange((favorites) => {
      this.updateFavoritesButton(favorites.length);
    });
  }

  private updateFavoritesButton(count: number): void {
    const favoritesBtn = document.getElementById('favorites-button');
    if (favoritesBtn) {
      const countDisplay = count > 0 ? ` (${count})` : '';
      const textSpan = favoritesBtn.querySelector('span:not(.material-icons)');
      if (textSpan) {
        textSpan.textContent = `Favorites${countDisplay}`;
      }
      
      // Update button style based on whether there are favorites
      if (count > 0) {
        favoritesBtn.classList.remove('bg-purple-100', 'hover:bg-purple-200', 'dark:bg-purple-700', 'dark:hover:bg-purple-600', 'text-purple-700', 'dark:text-purple-300');
        favoritesBtn.classList.add('bg-purple-600', 'hover:bg-purple-700', 'text-white');
        
        // Update icon to filled heart
        const icon = favoritesBtn.querySelector('.material-icons');
        if (icon) {
          icon.textContent = 'favorite';
        }
      } else {
        favoritesBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700', 'text-white');
        favoritesBtn.classList.add('bg-purple-100', 'hover:bg-purple-200', 'dark:bg-purple-700', 'dark:hover:bg-purple-600', 'text-purple-700', 'dark:text-purple-300');
        
        // Update icon to outline heart
        const icon = favoritesBtn.querySelector('.material-icons');
        if (icon) {
          icon.textContent = 'favorite_border';
        }
      }
    }
  }

  private onComparisonClose(): void {
    // Clear the selected countries when comparison modal closes
    this.selectedCountries = [];
    this.updateComparisonButton();
  }

  private showHelpModal(): void {
    // Create help modal dynamically
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-all duration-300';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '1rem';    overlay.innerHTML = `
      <div class="modal-box max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span class="material-icons text-white">help</span>
            </div>
            <div><h2 class="text-2xl font-bold">Help & Tips</h2>
                <p class="text-sm opacity-70">Learn how to use Walther's Room</p>
              </div>
            </div>
            <button 
              class="close-help btn btn-sm btn-circle btn-ghost"
              aria-label="Close help"
            >
              <span class="material-icons text-2xl group-hover:rotate-90 transition-transform duration-200">close</span>
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Features -->
          <div>            <h3 class="text-lg font-semibold mb-3 flex items-center">
              <span class="material-icons mr-2 text-blue-500">star</span>
              Features
            </h3>
            <div class="grid gap-3">
              <div class="flex items-start space-x-3 p-3 rounded-lg bg-base-200 border border-base-300">
                <span class="material-icons text-purple-500 mt-0.5">favorite</span>
                <div>
                  <div class="font-medium">Favorites</div>
                  <div class="text-sm opacity-70">Save countries you're interested in and access them quickly</div>
                </div>
              </div>              <div class="flex items-start space-x-3 p-3 rounded-lg bg-base-200 border border-base-300">
                <span class="material-icons text-green-500 mt-0.5">compare</span>
                <div>
                  <div class="font-medium">Comparison</div>
                  <div class="text-sm opacity-70">Compare up to 3 countries side by side with detailed statistics</div>
                </div>
              </div>
              <div class="flex items-start space-x-3 p-3 rounded-lg bg-base-200 border border-base-300">
                <span class="material-icons text-blue-500 mt-0.5">search</span>
                <div>
                  <div class="font-medium">Search & Filter</div>
                  <div class="text-sm opacity-70">Find countries by name, capital, or filter by region and sort options</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Keyboard Shortcuts -->
          <div>
            <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
              <span class="material-icons mr-2 text-green-500">keyboard</span>
              Keyboard Shortcuts
            </h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span class="theme-text-secondary">Focus search</span>
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono theme-text-primary">Ctrl+K</kbd>
              </div>
              <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span class="theme-text-secondary">Open favorites</span>
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono theme-text-primary">Ctrl+F</kbd>
              </div>
              <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span class="theme-text-secondary">Open comparison</span>
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono theme-text-primary">Ctrl+Shift+C</kbd>
              </div>
              <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span class="theme-text-secondary">Clear all filters</span>
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono theme-text-primary">Ctrl+Shift+R</kbd>
              </div>              <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span class="theme-text-secondary">Close modals/clear search</span>
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono theme-text-primary">Escape</kbd>
              </div>
              <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <span class="theme-text-secondary">Show this help</span>
                <kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono theme-text-primary">Ctrl+?</kbd>
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div>
            <h3 class="text-lg font-semibold theme-text-primary mb-3 flex items-center">
              <span class="material-icons mr-2 text-orange-500">lightbulb</span>
              Tips
            </h3>
            <ul class="space-y-2 text-sm theme-text-secondary">
              <li class="flex items-start space-x-2">
                <span class="material-icons text-xs mt-1 text-blue-500">fiber_manual_record</span>
                <span>Click the heart icon on country cards to add them to favorites</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="material-icons text-xs mt-1 text-blue-500">fiber_manual_record</span>
                <span>Click the compare icon to add countries to comparison, then click "Compare" in the header</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="material-icons text-xs mt-1 text-blue-500">fiber_manual_record</span>
                <span>Use the search bar to find countries by name, capital city, or other attributes</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="material-icons text-xs mt-1 text-blue-500">fiber_manual_record</span>
                <span>Filter by region and sort by various criteria to explore different perspectives</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Add close functionality
    const closeBtn = overlay.querySelector('.close-help');
    closeBtn?.addEventListener('click', () => {
      overlay.remove();
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(overlay);
  }
}

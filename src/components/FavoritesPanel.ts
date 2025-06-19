import type { Country } from '../types/country';
import {
  FavoritesManager,
  type FavoriteCountry,
} from '../utils/favoritesManager';

export class FavoritesPanel {
  private panel: HTMLElement | null = null;
  private favoritesManager: FavoritesManager;
  private onCountrySelect?: (country: Country) => void;

  constructor(onCountrySelect?: (country: Country) => void) {
    this.favoritesManager = FavoritesManager.getInstance();
    this.onCountrySelect = onCountrySelect;
    this.createPanel();
    this.setupEventListeners();
  }
  private createPanel(): void {
    // Create drawer
    this.panel = document.createElement('div');
    this.panel.className = 'drawer drawer-end z-50';
    this.panel.innerHTML = `
      <input id="favorites-drawer-toggle" type="checkbox" class="drawer-toggle" />
      <div class="drawer-side">
        <label for="favorites-drawer-toggle" aria-label="close sidebar" class="drawer-overlay"></label>
        <aside class="min-h-full w-96 max-w-[90vw] bg-base-200 flex flex-col">
          <!-- Header -->
          <div class="p-6 border-b border-base-300 bg-gradient-to-r from-warning/10 to-accent/10">
            <div class="flex justify-between items-center">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-warning rounded-xl flex items-center justify-center">
                  <span class="material-icons text-warning-content">star</span>
                </div>
                <div>
                  <h2 class="text-xl font-bold">Favorites</h2>
                  <p class="text-sm opacity-70" id="favorites-count">0 countries saved</p>
                </div>
              </div>
              <button 
                class="close-panel btn btn-sm btn-circle btn-ghost"
                aria-label="Close favorites"
              >
                <span class="material-icons">close</span>
              </button>
            </div>
          </div>

          <!-- Search favorites -->
          <div class="p-4 border-b border-base-300">
            <div class="relative">
              <span class="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 opacity-60 text-sm">search</span>
              <input
                type="text"
                id="favorites-search"
                placeholder="Search favorites..."
                class="input input-bordered input-sm w-full pl-10"
              />
            </div>
          </div>

          <!-- Favorites list -->
          <div class="flex-1 overflow-y-auto p-4">
            <div id="favorites-list">
              <!-- Favorites will be rendered here -->
            </div>
            
            <!-- Empty state -->
            <div id="favorites-empty" class="hidden text-center py-8">
              <div class="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="material-icons text-2xl opacity-60">star_border</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">No favorites yet</h3>
              <p class="opacity-70 text-sm leading-relaxed mb-4">Start exploring countries and click the star icon to add them to your favorites!</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-base-300 bg-base-100">
            <div class="flex space-x-2">
              <button 
                id="clear-favorites" 
                class="btn btn-sm btn-error btn-outline flex-1"
              >
                <span class="material-icons text-sm">delete</span>
                Clear All
              </button>
              <button 
                id="compare-favorites" 
                class="btn btn-sm btn-primary btn-outline flex-1"
                disabled
              >
                <span class="material-icons text-sm">compare</span>
                Compare
              </button>
            </div>
          </div>
        </aside>
      </div>
    `;

    document.body.appendChild(this.panel);
  }

  private setupEventListeners(): void {
    // Close button
    const closeBtn = this.panel?.querySelector('.close-panel');
    closeBtn?.addEventListener('click', () => this.close());

    // Clear favorites
    const clearBtn = this.panel?.querySelector('#clear-favorites');
    clearBtn?.addEventListener('click', () => this.clearFavorites());

    // Compare favorites
    const compareBtn = this.panel?.querySelector('#compare-favorites');
    compareBtn?.addEventListener('click', () => this.compareFavorites());

    // Search favorites
    const searchInput = this.panel?.querySelector(
      '#favorites-search'
    ) as HTMLInputElement;
    searchInput?.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.filterFavorites(query);
    });

    // Listen for favorites changes
    this.favoritesManager.onFavoritesChange((favorites) => {
      this.updateFavoritesList(favorites);
      this.updateCompareButton(favorites);
    }); // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const toggle = this.panel?.querySelector(
          '#favorites-drawer-toggle'
        ) as HTMLInputElement;
        if (toggle?.checked) {
          this.close();
        }
      }
    });
  }
  show(): void {
    const toggle = this.panel?.querySelector(
      '#favorites-drawer-toggle'
    ) as HTMLInputElement;
    if (toggle) {
      toggle.checked = true;
    }

    // Load current favorites
    const favorites = this.favoritesManager.getFavorites();
    this.updateFavoritesList(favorites);
    this.updateCompareButton(favorites);
  }

  close(): void {
    const toggle = this.panel?.querySelector(
      '#favorites-drawer-toggle'
    ) as HTMLInputElement;
    if (toggle) {
      toggle.checked = false;
    }
  }

  private updateFavoritesList(favorites: FavoriteCountry[]): void {
    const listContainer = this.panel?.querySelector('#favorites-list');
    const emptyState = this.panel?.querySelector('#favorites-empty');
    const countElement = this.panel?.querySelector('#favorites-count');

    if (!listContainer || !emptyState || !countElement) return;

    // Update count
    countElement.textContent = `${favorites.length} ${favorites.length === 1 ? 'country' : 'countries'} saved`;

    if (favorites.length === 0) {
      listContainer.innerHTML = '';
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      listContainer.innerHTML = favorites
        .map((favorite) => this.renderFavoriteItem(favorite))
        .join('');
    }
  }
  private renderFavoriteItem(favorite: FavoriteCountry): string {
    const addedDate = new Date(favorite.addedAt).toLocaleDateString();

    return `
      <div class="favorite-item card card-compact bg-base-100 mb-3 shadow-sm hover:shadow-md transition-all duration-200 group" data-cca2="${favorite.cca2}">
        <div class="card-body">
          <div class="flex items-center space-x-3">
            <img 
              src="${favorite.flag}" 
              alt="Flag of ${favorite.name}"
              class="w-12 h-8 object-cover rounded shadow-sm"
            />
            <div class="flex-1 min-w-0">
              <h4 class="font-medium group-hover:text-primary transition-colors truncate">${favorite.name}</h4>
              <p class="text-xs opacity-60">Added ${addedDate}</p>
            </div>
            <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                class="view-country btn btn-xs btn-ghost"
                title="View details"
                data-cca2="${favorite.cca2}"
              >
                <span class="material-icons text-sm">visibility</span>
              </button>
              <button 
                class="remove-favorite btn btn-xs btn-ghost text-error"
                title="Remove from favorites"
                data-cca2="${favorite.cca2}"
              >
                <span class="material-icons text-sm">star</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private filterFavorites(query: string): void {
    if (!query.trim()) {
      const favorites = this.favoritesManager.getFavorites();
      this.updateFavoritesList(favorites);
      return;
    }

    const filteredFavorites = this.favoritesManager.searchFavorites(query);
    this.updateFavoritesList(filteredFavorites);
  }

  private updateCompareButton(favorites: FavoriteCountry[]): void {
    const compareBtn = this.panel?.querySelector(
      '#compare-favorites'
    ) as HTMLButtonElement;
    if (compareBtn) {
      compareBtn.disabled = favorites.length < 2;
      compareBtn.title =
        favorites.length < 2
          ? 'Add at least 2 countries to compare'
          : 'Compare selected favorites';
    }
  }

  private clearFavorites(): void {
    if (
      confirm(
        'Are you sure you want to remove all favorites? This action cannot be undone.'
      )
    ) {
      this.favoritesManager.clearFavorites();
    }
  }

  private compareFavorites(): void {
    const favorites = this.favoritesManager.getFavorites();
    if (favorites.length >= 2) {
      // This will be implemented when we integrate with the comparison component
      console.log('Compare favorites:', favorites.slice(0, 3));
      // For now, just close the panel
      this.close();
    }
  }
  destroy(): void {
    this.panel?.remove();
  }
}

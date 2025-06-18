export interface FavoriteCountry {
  cca2: string;
  name: string;
  flag: string;
  addedAt: number;
}

export class FavoritesManager {
  private static instance: FavoritesManager;
  private favorites: FavoriteCountry[] = [];
  private readonly STORAGE_KEY = 'walthers-room-favorites';
  private callbacks: Array<(favorites: FavoriteCountry[]) => void> = [];

  private constructor() {
    this.loadFavorites();
  }

  static getInstance(): FavoritesManager {
    if (!FavoritesManager.instance) {
      FavoritesManager.instance = new FavoritesManager();
    }
    return FavoritesManager.instance;
  }

  getFavorites(): FavoriteCountry[] {
    return [...this.favorites];
  }

  isFavorite(cca2: string): boolean {
    return this.favorites.some(fav => fav.cca2 === cca2);
  }

  addFavorite(country: { cca2: string; name: { common: string }; flags: { png: string } }): void {
    if (this.isFavorite(country.cca2)) return;

    const favorite: FavoriteCountry = {
      cca2: country.cca2,
      name: country.name.common,
      flag: country.flags.png,
      addedAt: Date.now()
    };

    this.favorites.unshift(favorite); // Add to beginning
    this.saveFavorites();
    this.notifyCallbacks();
  }

  removeFavorite(cca2: string): void {
    const index = this.favorites.findIndex(fav => fav.cca2 === cca2);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
      this.notifyCallbacks();
    }
  }

  toggleFavorite(country: { cca2: string; name: { common: string }; flags: { png: string } }): boolean {
    if (this.isFavorite(country.cca2)) {
      this.removeFavorite(country.cca2);
      return false;
    } else {
      this.addFavorite(country);
      return true;
    }
  }

  clearFavorites(): void {
    this.favorites = [];
    this.saveFavorites();
    this.notifyCallbacks();
  }

  onFavoritesChange(callback: (favorites: FavoriteCountry[]) => void): void {
    this.callbacks.push(callback);
  }

  private loadFavorites(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.favorites = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load favorites from localStorage:', error);
      this.favorites = [];
    }
  }

  private saveFavorites(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.favorites));
    } catch (error) {
      console.warn('Failed to save favorites to localStorage:', error);
    }
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => callback(this.favorites));
  }

  // Get favorites count
  getCount(): number {
    return this.favorites.length;
  }

  // Get recently added favorites
  getRecent(limit = 5): FavoriteCountry[] {
    return this.favorites.slice(0, limit);
  }

  // Search favorites
  searchFavorites(query: string): FavoriteCountry[] {
    const searchTerm = query.toLowerCase();
    return this.favorites.filter(fav => 
      fav.name.toLowerCase().includes(searchTerm)
    );
  }
}

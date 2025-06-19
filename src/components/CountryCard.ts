import type { Country } from '../types/country';
import { formatPopulation, formatArea } from '../utils/helpers';
import { FavoritesManager } from '../utils/favoritesManager';

export class CountryCard {
  private country: Country;
  private favoritesManager: FavoritesManager;

  constructor(country: Country) {
    this.country = country;
    this.favoritesManager = FavoritesManager.getInstance();
  }

  render(): string {
    const { name, flags, population, area, capital, region, maps } =
      this.country;

    const capitalDisplay = capital ? capital.join(', ') : 'No capital';
    const isFavorite = this.favoritesManager.isFavorite(this.country.cca2);

    return `
      <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-base-300 group">
        <figure class="relative overflow-hidden">
          <img 
            src="${flags.png}" 
            alt="Flag of ${name.common}"
            class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='"
          />
          <div class="absolute top-3 right-3">
            <div class="badge badge-neutral badge-sm">${this.country.cca2}</div>
          </div>
          <div class="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div class="badge badge-primary badge-sm">${region}</div>
          </div>
        </figure>
        
        <div class="card-body p-5">
          <h2 class="card-title text-base line-clamp-1">
            ${name.common}
            ${isFavorite ? '<div class="badge badge-secondary badge-sm">★</div>' : ''}
          </h2>
          <p class="text-base-content/70 text-sm line-clamp-1">${name.official}</p>
          
          <div class="space-y-2 text-sm mt-3">
            <div class="flex items-center text-base-content/80">
              <span class="material-icons text-blue-500 text-base mr-3">location_city</span>
              <span class="font-medium w-16 text-xs uppercase tracking-wide opacity-60">Capital</span>
              <span class="line-clamp-1 flex-1">${capitalDisplay}</span>
            </div>
            
            <div class="flex items-center text-base-content/80">
              <span class="material-icons text-purple-500 text-base mr-3">people</span>
              <span class="font-medium w-16 text-xs uppercase tracking-wide opacity-60">People</span>
              <span class="line-clamp-1 flex-1">${formatPopulation(population)}</span>
            </div>
            
            <div class="flex items-center text-base-content/80">
              <span class="material-icons text-orange-500 text-base mr-3">straighten</span>
              <span class="font-medium w-16 text-xs uppercase tracking-wide opacity-60">Area</span>
              <span class="line-clamp-1 flex-1">${formatArea(area)} km²</span>
            </div>
          </div>
          
          <div class="card-actions justify-between mt-4 gap-2">
            <!-- Action Buttons Row 1 -->
            <div class="flex gap-2 w-full">
              <button 
                class="favorite-btn btn btn-sm flex-1 ${isFavorite ? 'btn-secondary' : 'btn-outline'} hover-lift"
                data-country='${JSON.stringify(this.country)}'
                title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
              >
                <span class="material-icons text-sm">
                  ${isFavorite ? 'favorite' : 'favorite_border'}
                </span>
                <span class="hidden sm:inline">${isFavorite ? 'Saved' : 'Save'}</span>
              </button>
              
              <button 
                class="compare-btn btn btn-sm btn-accent btn-outline flex-1 hover-lift"
                data-country='${JSON.stringify(this.country)}'
                title="Add to comparison"
              >
                <span class="material-icons text-sm">compare</span>
                <span class="hidden sm:inline">Compare</span>
              </button>
            </div>
            
            <!-- Action Buttons Row 2 -->
            <div class="flex gap-2 w-full">
              ${
                maps?.googleMaps
                  ? `
                <a 
                  href="${maps.googleMaps}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="btn btn-sm btn-success flex-1 hover-lift"
                >
                  <span class="material-icons text-sm">map</span>
                  <span>Map</span>
                </a>
              `
                  : `
                <div class="btn btn-sm btn-disabled flex-1 cursor-not-allowed">
                  <span class="material-icons text-sm">map_off</span>
                  <span>No Map</span>
                </div>
              `
              }
              <button 
                class="btn btn-sm btn-primary flex-1 country-details-btn hover-lift"
                data-country='${JSON.stringify(this.country)}'
                title="View detailed information"
              >
                <span class="material-icons text-sm">info</span>
                <span>Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

import type { Country } from '../types/country';
import { CountriesService } from '../services/countriesService';
import { formatPopulation, formatArea } from '../utils/helpers';
import { LoadingState } from './LoadingState';
import { KeyboardNavigation } from '../utils/keyboardNavigation';

export class FlagsApp {
  private countries: Country[] = [];
  private filteredCountries: Country[] = [];
  private searchTerm = '';
  private selectedRegion = 'all';
  private loadingState: LoadingState | null = null;
  private keyboardNavigation: KeyboardNavigation | null = null;

  constructor() {
    this.init();
  }
  private async init(): Promise<void> {
    this.createLayout();
    this.loadingState = new LoadingState('loading');
    this.keyboardNavigation = new KeyboardNavigation();
    this.attachEventListeners();
    await this.loadCountries();
  }

  private createLayout(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="min-h-screen bg-base-200">
        <!-- Simple Header -->
        <header class="bg-base-100 shadow-sm border-b">
          <div class="max-w-6xl mx-auto px-4 py-6">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="text-center md:text-left">
                <h1 class="text-3xl font-bold text-primary">World Flags</h1>
                <p class="text-base-content/70">Explore countries around the world</p>
              </div>
              
              <div class="flex gap-3">
                <input
                  type="text"
                  id="search"
                  placeholder="Search countries..."
                  class="input input-bordered w-64"
                />
                <select id="region" class="select select-bordered">
                  <option value="all">All Regions</option>
                  <option value="Africa">Africa</option>
                  <option value="Americas">Americas</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="max-w-6xl mx-auto px-4 py-8">
          <div id="loading" class="text-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
            <p class="mt-4">Loading countries...</p>
          </div>
          
          <div id="countries-grid" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <!-- Countries will be inserted here -->
          </div>
          
          <div id="no-results" class="hidden text-center py-12">
            <p class="text-lg">No countries found</p>
            <button id="clear-search" class="btn btn-primary mt-4">Clear Search</button>
          </div>
        </main>

        <!-- Simple Modal -->
        <dialog id="country-modal" class="modal">
          <div class="modal-box w-11/12 max-w-2xl">
            <form method="dialog">
              <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <div id="modal-content">
              <!-- Country details will be inserted here -->
            </div>
          </div>
          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    `;
  }

  private attachEventListeners(): void {
    const searchInput = document.getElementById('search') as HTMLInputElement;
    const regionSelect = document.getElementById('region') as HTMLSelectElement;
    const clearButton = document.getElementById('clear-search');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchTerm = (e.target as HTMLInputElement).value;
        this.filterAndRenderCountries();
      });
    }

    if (regionSelect) {
      regionSelect.addEventListener('change', (e) => {
        this.selectedRegion = (e.target as HTMLSelectElement).value;
        this.filterAndRenderCountries();
      });
    }

    if (clearButton) {
      clearButton.addEventListener('click', () => {
        searchInput.value = '';
        regionSelect.value = 'all';
        this.searchTerm = '';
        this.selectedRegion = 'all';
        this.filterAndRenderCountries();
      });
    }
  }
  private async loadCountries(): Promise<void> {
    try {
      this.countries = await CountriesService.getAllCountries();
      this.filteredCountries = [...this.countries];
      this.hideLoading();
      this.renderCountries();
    } catch (error) {
      console.error('Error loading countries:', error);
      this.showError(
        error instanceof Error ? error.message : 'Failed to load countries'
      );
    }
  }

  private filterAndRenderCountries(): void {
    this.filteredCountries = this.countries.filter((country) => {
      const matchesSearch =
        !this.searchTerm ||
        country.name.common
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        country.capital?.[0]
          ?.toLowerCase()
          .includes(this.searchTerm.toLowerCase());

      const matchesRegion =
        this.selectedRegion === 'all' || country.region === this.selectedRegion;

      return matchesSearch && matchesRegion;
    });

    this.renderCountries();
  }
  private renderCountries(): void {
    const grid = document.getElementById('countries-grid');
    const noResults = document.getElementById('no-results');

    if (!grid || !noResults) return;

    if (this.filteredCountries.length === 0) {
      grid.classList.add('hidden');
      noResults.classList.remove('hidden');
      return;
    }

    noResults.classList.add('hidden');
    grid.classList.remove('hidden');

    grid.innerHTML = this.filteredCountries
      .map((country) => this.createCountryCard(country))
      .join('');

    // Make cards focusable for keyboard navigation
    if (this.keyboardNavigation) {
      this.keyboardNavigation.makeCardsFocusable();
    }

    // Add click listeners to cards
    grid.addEventListener('click', (e) => {
      const card = (e.target as Element).closest('[data-country-code]');
      if (card) {
        const countryCode = card.getAttribute('data-country-code');
        const country = this.countries.find((c) => c.cca2 === countryCode);
        if (country) {
          this.showCountryModal(country);
        }
      }
    });
  }

  private createCountryCard(country: Country): string {
    const { name, flags, population, area, capital, region, cca2 } = country;
    const capitalDisplay = capital?.[0] || 'N/A';
    return `
      <div class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer country-card" 
           data-country-code="${cca2}"
           tabindex="-1"
           role="button"
           aria-label="View details for ${name.common}">
        <figure class="h-48">
          <img 
            src="${flags.png}" 
            alt="Flag of ${name.common}"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </figure>
        <div class="card-body p-4">
          <h3 class="card-title text-lg">${name.common}</h3>
          <div class="space-y-1 text-sm">
            <p><span class="font-medium">Capital:</span> ${capitalDisplay}</p>
            <p><span class="font-medium">Region:</span> ${region}</p>
            <p><span class="font-medium">Population:</span> ${formatPopulation(population)}</p>
            <p><span class="font-medium">Area:</span> ${formatArea(area)} km²</p>
          </div>
        </div>
      </div>
    `;
  }

  private showCountryModal(country: Country): void {
    const modal = document.getElementById('country-modal') as HTMLDialogElement;
    const content = document.getElementById('modal-content');

    if (!modal || !content) return;

    const {
      name,
      flags,
      population,
      area,
      capital,
      region,
      subregion,
      currencies,
      languages,
    } = country;

    const capitalDisplay = capital?.join(', ') || 'N/A';
    const currencyDisplay = currencies
      ? Object.values(currencies)
          .map((c) => `${c.name} (${c.symbol})`)
          .join(', ')
      : 'N/A';
    const languageDisplay = languages
      ? Object.values(languages).join(', ')
      : 'N/A';

    content.innerHTML = `
      <div class="text-center mb-6">
        <img 
          src="${flags.png}" 
          alt="Flag of ${name.common}"
          class="w-32 h-20 object-cover mx-auto rounded shadow-md mb-4"
        />
        <h2 class="text-2xl font-bold">${name.common}</h2>
        <p class="text-base-content/70">${name.official}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><span class="font-medium">Capital:</span> ${capitalDisplay}</p>
          <p><span class="font-medium">Region:</span> ${region}</p>
          <p><span class="font-medium">Subregion:</span> ${subregion || 'N/A'}</p>
        </div>
        <div>
          <p><span class="font-medium">Population:</span> ${formatPopulation(population)}</p>
          <p><span class="font-medium">Area:</span> ${formatArea(area)} km²</p>
          <p><span class="font-medium">Code:</span> ${country.cca2}</p>
        </div>
        <div class="md:col-span-2">
          <p><span class="font-medium">Currencies:</span> ${currencyDisplay}</p>
          <p><span class="font-medium">Languages:</span> ${languageDisplay}</p>
        </div>
      </div>
    `;

    modal.showModal();
  }
  private hideLoading(): void {
    if (this.loadingState) {
      this.loadingState.hide();
    }
  }
  private showError(message: string = 'An error occurred'): void {
    if (this.loadingState) {
      this.loadingState.showError(message, () => {
        this.loadingState?.show('Loading countries...');
        this.loadCountries();
      });
    }

    const gridElement = document.getElementById('countries-grid');
    if (gridElement) {
      gridElement.classList.add('hidden');
    }
  }
}

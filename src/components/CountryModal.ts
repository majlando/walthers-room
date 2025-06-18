import type { Country } from '../types/country';
import { formatPopulation, formatArea, formatCurrencies, formatLanguages } from '../utils/helpers';

export class CountryModal {
  private modal: HTMLElement | null = null;

  constructor() {
    this.createModal();
  }private createModal(): void {
    // Create DaisyUI modal
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.innerHTML = `
      <div class="modal-box max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span class="material-icons text-white">public</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold">Country Details</h2>
              <p class="text-sm opacity-70">Detailed information and statistics</p>
            </div>
          </div>
          <button 
            class="close-modal btn btn-sm btn-circle btn-ghost"
            aria-label="Close modal"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
        <div id="modal-content">
          <!-- Content will be inserted here -->
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    `;

    // Add event listener for close button
    const closeBtn = this.modal.querySelector('.close-modal');
    closeBtn?.addEventListener('click', () => this.close());

    // Add escape key listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('modal-open')) {
        this.close();
      }
    });

    document.body.appendChild(this.modal);
  }  show(country: Country): void {
    const content = this.modal?.querySelector('#modal-content');
    if (!content) return;

    content.innerHTML = this.renderCountryDetails(country);
    
    // Use DaisyUI modal classes
    this.modal?.classList.add('modal-open');
    
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    // Use DaisyUI modal classes
    this.modal?.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  private renderCountryDetails(country: Country): string {
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
      maps,
      timezones,
      continents,
      car,
      cca2,
      cca3
    } = country;    const capitalDisplay = capital ? capital.join(', ') : 'No capital';
    const subregionDisplay = subregion || 'No subregion';
    const timezonesDisplay = timezones ? timezones.join(', ') : 'No timezone data';
    const continentsDisplay = continents ? continents.join(', ') : 'No continent data';    return `
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Flag and Basic Info -->
        <div class="space-y-6">
          <div class="relative group">
            <img 
              src="${flags.svg || flags.png}" 
              alt="Flag of ${name.common}"
              class="w-full max-w-lg mx-auto rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              onerror="this.src='${flags.png}'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </div>
          
          <div class="text-center space-y-4">            <div>
              <h3 class="text-3xl font-bold mb-2">${name.common}</h3>
              <p class="text-lg opacity-70">${name.official}</p>
            </div>
              <div class="flex justify-center space-x-3">
              <div class="badge badge-primary">${cca2}</div>
              <div class="badge badge-secondary">${cca3}</div>
            </div>

            ${maps?.googleMaps ? `
              <a 
                href="${maps.googleMaps}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="btn btn-primary"
              >
                <span class="material-icons">map</span>
                Explore on Google Maps
                <span class="material-icons text-sm">open_in_new</span>
              </a>
            ` : `
              <div class="btn btn-disabled">
                <span class="material-icons">map_off</span>
                Maps Not Available
              </div>
            `}
          </div>
        </div>
        
        <!-- Detailed Information -->
        <div class="space-y-6">          <!-- Geographic Information -->
          <div class="card bg-primary/10 border border-primary/20">
            <div class="card-body">
              <h4 class="card-title text-xl flex items-center">
                <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <span class="material-icons text-primary-content text-lg">public</span>
                </div>
                Geographic Information
              </h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-primary/20 last:border-b-0">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-primary">location_on</span>
                    Region
                  </span>
                  <span class="font-medium">${region}</span>
                </div>
                ${subregionDisplay !== 'No subregion' ? `
                  <div class="flex items-center justify-between py-2 border-b border-primary/20 last:border-b-0">
                    <span class="font-medium opacity-70 flex items-center">
                      <span class="material-icons text-sm mr-2 text-primary">place</span>
                      Subregion
                    </span>
                    <span class="font-medium">${subregionDisplay}</span>
                  </div>
                ` : ''}
                <div class="flex items-center justify-between py-2 border-b border-primary/20 last:border-b-0">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-primary">location_city</span>
                    Capital
                  </span>                  <span class="font-medium text-right">${capitalDisplay}</span>
                </div>
                <div class="flex items-center justify-between py-2">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-primary">terrain</span>
                    Continents
                  </span>
                  <span class="font-medium text-right">${continentsDisplay}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Demographics -->
          <div class="card bg-secondary/10 border border-secondary/20">
            <div class="card-body">
              <h4 class="card-title text-xl flex items-center">
                <div class="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center mr-3">
                  <span class="material-icons text-secondary-content text-lg">groups</span>
                </div>
                Demographics
              </h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-secondary/20 last:border-b-0">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-secondary">people</span>
                    Population
                  </span>
                  <div class="text-right">
                    <div class="font-bold">${formatPopulation(population)}</div>
                    <div class="text-xs opacity-60">${population.toLocaleString()}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between py-2">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-secondary">square_foot</span>
                    Area
                  </span>
                  <div class="text-right">
                    <div class="font-bold">${formatArea(area)} km²</div>
                    <div class="text-xs opacity-60">${(area / 1000).toFixed(1)}K km²</div>
                  </div>
                </div>
              </div>
            </div>
          </div>          <!-- Culture & Language -->
          <div class="card bg-accent/10 border border-accent/20">
            <div class="card-body">
              <h4 class="card-title text-xl flex items-center">
                <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mr-3">
                  <span class="material-icons text-accent-content text-lg">language</span>
                </div>
                Culture & Language
              </h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-accent/20 last:border-b-0">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-accent">translate</span>
                    Languages
                  </span>
                  <span class="font-medium text-right max-w-xs">${formatLanguages(languages)}</span>
                </div>
                <div class="flex items-center justify-between py-2">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-accent">payments</span>
                    Currency
                  </span>
                  <span class="font-medium text-right max-w-xs">${formatCurrencies(currencies)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="card bg-neutral/10 border border-neutral/20">
            <div class="card-body">
              <h4 class="card-title text-xl flex items-center">
                <div class="w-8 h-8 bg-neutral rounded-lg flex items-center justify-center mr-3">
                  <span class="material-icons text-neutral-content text-lg">info</span>
                </div>
                Additional Details
              </h4>
              <div class="space-y-3">
                <div class="flex items-center justify-between py-2 border-b border-neutral/20 last:border-b-0">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-neutral">schedule</span>
                    Timezones
                  </span>
                  <span class="font-medium text-right max-w-xs">${timezonesDisplay}</span>
                </div>
                <div class="flex items-center justify-between py-2">
                  <span class="font-medium opacity-70 flex items-center">
                    <span class="material-icons text-sm mr-2 text-neutral">drive_eta</span>
                    Driving Side
                  </span>
                  <span class="font-medium">${car?.side ? (car.side === 'left' ? '🚗 Left Side' : '🚙 Right Side') : 'No data'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  destroy(): void {
    this.modal?.remove();
  }
}

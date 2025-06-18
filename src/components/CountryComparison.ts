import type { Country } from '../types/country';
import { formatPopulation, formatArea, formatCurrencies, formatLanguages } from '../utils/helpers';

export class CountryComparison {
  private modal: HTMLElement | null = null;
  private countries: Country[] = [];
  private onClose?: () => void;

  constructor(onClose?: () => void) {
    this.onClose = onClose;
    this.createModal();
  }
  private createModal(): void {
    // Create DaisyUI modal
    this.modal = document.createElement('div');
    this.modal.className = 'modal';
    this.modal.innerHTML = `
      <div class="modal-box max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-br from-success to-accent rounded-xl flex items-center justify-center">
              <span class="material-icons text-white">compare</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold">Country Comparison</h2>
              <p class="text-sm opacity-70">Compare countries side by side</p>
            </div>
          </div>
          <button 
            class="close-modal btn btn-sm btn-circle btn-ghost"
            aria-label="Close comparison"
          >
            <span class="material-icons">close</span>
          </button>
        </div>
        <div id="comparison-content">
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
  }
  show(countries: Country[]): void {
    if (countries.length < 2) {
      console.warn('Need at least 2 countries for comparison');
      return;
    }

    this.countries = countries.slice(0, 3); // Limit to 3 countries
    const content = this.modal?.querySelector('#comparison-content');
    if (!content) return;

    content.innerHTML = this.renderComparison();
    
    // Use DaisyUI modal classes
    this.modal?.classList.add('modal-open');
    
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    // Use DaisyUI modal classes
    this.modal?.classList.remove('modal-open');
    document.body.style.overflow = '';
    
    // Call the onClose callback
    if (this.onClose) {
      this.onClose();
    }
  }

  private renderComparison(): string {
    const gridCols = this.countries.length === 2 ? 'grid-cols-2' : 'grid-cols-3';
    
    return `
      <div class="space-y-8">
        <!-- Countries Overview -->
        <div class="grid ${gridCols} gap-6">
          ${this.countries.map(country => this.renderCountryCard(country)).join('')}
        </div>        <!-- Detailed Comparison Table -->
        <div class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th class="text-left font-semibold">Attribute</th>
                ${this.countries.map(country => `
                  <th class="text-center font-semibold">
                    <div class="flex items-center justify-center space-x-2">
                      <img src="${country.flags.png}" alt="${country.name.common}" class="w-6 h-4 object-cover rounded">
                      <span>${country.name.common}</span>
                    </div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${this.renderComparisonRows()}
            </tbody>
          </table>
        </div>

        <!-- Visual Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${this.renderPopulationChart()}
          ${this.renderAreaChart()}
        </div>
      </div>
    `;
  }
  private renderCountryCard(country: Country): string {
    return `
      <div class="card bg-base-100 shadow-lg p-6 text-center">
        <img 
          src="${country.flags.svg || country.flags.png}" 
          alt="Flag of ${country.name.common}"
          class="w-full h-32 object-cover rounded-lg mb-4 shadow-md"
        />
        <h3 class="text-xl font-bold mb-2">${country.name.common}</h3>
        <p class="opacity-70 text-sm">${country.name.official}</p>
        <div class="flex justify-center space-x-2 mt-3">
          <div class="badge badge-primary">${country.cca2}</div>
          <div class="badge badge-secondary">${country.region}</div>
        </div>
      </div>
    `;
  }

  private renderComparisonRows(): string {
    const attributes = [
      {
        label: 'Population',
        icon: 'people',
        getValue: (country: Country) => ({
          raw: country.population,
          formatted: formatPopulation(country.population),
          full: country.population.toLocaleString()
        })
      },
      {
        label: 'Area (km²)',
        icon: 'square_foot',
        getValue: (country: Country) => ({
          raw: country.area,
          formatted: formatArea(country.area) + ' km²',
          full: country.area.toLocaleString() + ' km²'
        })
      },
      {
        label: 'Population Density',
        icon: 'density_medium',
        getValue: (country: Country) => ({
          raw: country.population / country.area,
          formatted: Math.round(country.population / country.area) + '/km²',
          full: (country.population / country.area).toFixed(2) + ' people/km²'
        })
      },
      {
        label: 'Capital',
        icon: 'location_city',
        getValue: (country: Country) => ({
          raw: country.capital?.[0] || 'N/A',
          formatted: country.capital?.[0] || 'No capital',
          full: country.capital?.join(', ') || 'No capital'
        })
      },
      {
        label: 'Region',
        icon: 'public',
        getValue: (country: Country) => ({
          raw: country.region,
          formatted: country.region,
          full: country.subregion ? `${country.region} (${country.subregion})` : country.region
        })
      },
      {
        label: 'Languages',
        icon: 'translate',
        getValue: (country: Country) => ({
          raw: Object.keys(country.languages || {}).length,
          formatted: Object.keys(country.languages || {}).length + ' languages',
          full: formatLanguages(country.languages)
        })
      },
      {
        label: 'Currencies',
        icon: 'payments',
        getValue: (country: Country) => ({
          raw: Object.keys(country.currencies || {}).length,
          formatted: Object.keys(country.currencies || {}).length + ' currencies',
          full: formatCurrencies(country.currencies)
        })
      }
    ];

    return attributes.map(attr => {
      const values = this.countries.map(country => attr.getValue(country));
      const isNumeric = typeof values[0].raw === 'number';
        return `
        <tr class="hover:bg-base-200 transition-colors">
          <td class="py-3 px-4 font-medium opacity-70">
            <div class="flex items-center space-x-2">
              <span class="material-icons text-sm text-primary">${attr.icon}</span>
              <span>${attr.label}</span>
            </div>
          </td>
          ${values.map((value) => {
            const isHighest = isNumeric && values.every(v => v.raw <= value.raw);
            const isLowest = isNumeric && values.every(v => v.raw >= value.raw);
            const cellClass = isHighest && values.length > 1 ? 'text-success font-semibold' : 
                             isLowest && values.length > 1 ? 'text-warning' : 
                             '';
            
            return `
              <td class="py-3 px-4 text-center ${cellClass}" title="${value.full}">
                ${value.formatted}
                ${isHighest && values.length > 1 ? '<span class="material-icons text-sm ml-1 text-success">trending_up</span>' : ''}
                ${isLowest && values.length > 1 ? '<span class="material-icons text-sm ml-1 text-warning">trending_down</span>' : ''}
              </td>
            `;
          }).join('')}
        </tr>
      `;
    }).join('');
  }
  private renderPopulationChart(): string {
    const maxPopulation = Math.max(...this.countries.map(c => c.population));
    
    return `
      <div class="card bg-base-100 shadow-lg p-6">
        <h4 class="text-lg font-semibold mb-4 flex items-center">
          <span class="material-icons mr-2 text-secondary">people</span>
          Population Comparison
        </h4>
        <div class="space-y-3">
          ${this.countries.map(country => {
            const percentage = (country.population / maxPopulation) * 100;
            return `
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm opacity-70">${country.name.common}</span>
                  <span class="text-sm font-medium">${formatPopulation(country.population)}</span>
                </div>
                <div class="w-full bg-base-300 rounded-full h-3">
                  <div 
                    class="bg-gradient-to-r from-secondary to-accent h-3 rounded-full transition-all duration-1000 ease-out" 
                    style="width: ${percentage}%"
                  ></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  private renderAreaChart(): string {
    const maxArea = Math.max(...this.countries.map(c => c.area));
    
    return `
      <div class="card bg-base-100 shadow-lg p-6">
        <h4 class="text-lg font-semibold mb-4 flex items-center">
          <span class="material-icons mr-2 text-accent">square_foot</span>
          Area Comparison
        </h4>
        <div class="space-y-3">
          ${this.countries.map(country => {
            const percentage = (country.area / maxArea) * 100;
            return `
              <div>
                <div class="flex justify-between items-center mb-1">
                  <span class="text-sm opacity-70">${country.name.common}</span>
                  <span class="text-sm font-medium">${formatArea(country.area)} km²</span>
                </div>
                <div class="w-full bg-base-300 rounded-full h-3">
                  <div 
                    class="bg-gradient-to-r from-warning to-accent h-3 rounded-full transition-all duration-1000 ease-out" 
                    style="width: ${percentage}%"
                  ></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
  destroy(): void {
    this.modal?.remove();
  }
}

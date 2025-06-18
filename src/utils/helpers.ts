import type { Country } from '../types/country';

export function formatPopulation(population: number): string {
  if (population >= 1000000000) {
    return `${(population / 1000000000).toFixed(1)}B`;
  } else if (population >= 1000000) {
    return `${(population / 1000000).toFixed(1)}M`;
  } else if (population >= 1000) {
    return `${(population / 1000).toFixed(1)}K`;
  }
  return population.toString();
}

export function formatArea(area: number): string {
  return new Intl.NumberFormat('en-US').format(area);
}

export function formatCurrencies(currencies: Country['currencies']): string {
  if (!currencies) return 'No currency data';
  
  const currencyList = Object.values(currencies)
    .map(currency => `${currency.name} (${currency.symbol})`)
    .join(', ');
  
  return currencyList || 'No currency data';
}

export function formatLanguages(languages: Country['languages']): string {
  if (!languages) return 'No language data';
  
  const languageList = Object.values(languages).join(', ');
  return languageList || 'No language data';
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function sortCountries(
  countries: Country[],
  sortBy: 'name' | 'population' | 'area',
  sortOrder: 'asc' | 'desc'
): Country[] {
  return [...countries].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.common.localeCompare(b.name.common);
        break;
      case 'population':
        comparison = a.population - b.population;
        break;
      case 'area':
        comparison = a.area - b.area;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

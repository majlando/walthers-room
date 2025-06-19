import type { Country } from '../types/country';

const BASE_URL = 'https://restcountries.com/v3.1';

export class CountriesService {
  private static cache: Country[] | null = null;
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;

  private static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static async fetchWithRetry(
    url: string,
    retries = this.MAX_RETRIES
  ): Promise<Response> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        console.warn(`Fetch failed, retrying... (${retries} attempts left)`);
        await this.delay(this.RETRY_DELAY);
        return this.fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }

  static async getAllCountries(): Promise<Country[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      // Use working essential fields for the main country list
      const fields =
        'name,flags,cca2,cca3,region,subregion,population,area,capital';
      const response = await this.fetchWithRetry(
        `${BASE_URL}/all?fields=${fields}`
      );

      const countries: Country[] = await response.json();
      this.cache = countries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );

      return this.cache;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch countries data');
    }
  }
  static async getCountriesByRegion(region: string): Promise<Country[]> {
    try {
      // Use working essential fields for region searches
      const fields =
        'name,flags,cca2,cca3,region,subregion,population,area,capital';
      const response = await this.fetchWithRetry(
        `${BASE_URL}/region/${region}?fields=${fields}`
      );

      const countries: Country[] = await response.json();
      return countries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
    } catch (error) {
      console.error('Error fetching countries by region:', error);
      throw new Error('Failed to fetch countries by region. Please try again.');
    }
  }
  static async searchCountries(searchTerm: string): Promise<Country[]> {
    try {
      // Use working essential fields for search results
      const fields =
        'name,flags,cca2,cca3,region,subregion,population,area,capital';
      const response = await this.fetchWithRetry(
        `${BASE_URL}/name/${searchTerm}?fields=${fields}`
      );

      const countries: Country[] = await response.json();
      return countries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
    } catch (error) {
      console.error('Error searching countries:', error);
      // Return empty array for search errors (no matches found)
      return [];
    }
  }
  static async getCountryDetails(cca2: string): Promise<Country | null> {
    try {
      // Get additional details for a specific country for the modal
      const response = await this.fetchWithRetry(`${BASE_URL}/alpha/${cca2}`);

      const countries: Country[] = await response.json();
      return countries[0] || null;
    } catch (error) {
      console.error('Error fetching country details:', error);
      throw new Error('Failed to load country details. Please try again.');
    }
  }

  static getRegions(): string[] {
    return ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  }
}

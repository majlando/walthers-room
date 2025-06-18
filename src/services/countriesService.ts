import type { Country } from '../types/country';

const BASE_URL = 'https://restcountries.com/v3.1';

export class CountriesService {
  private static cache: Country[] | null = null;  static async getAllCountries(): Promise<Country[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      // Use working essential fields for the main country list
      const fields = 'name,flags,cca2,cca3,region,subregion,population,area,capital';
      const response = await fetch(`${BASE_URL}/all?fields=${fields}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const countries: Country[] = await response.json();
      this.cache = countries.sort((a, b) => 
        a.name.common.localeCompare(b.name.common)
      );
      
      return this.cache;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error('Failed to fetch countries data');
    }
  }  static async getCountriesByRegion(region: string): Promise<Country[]> {
    try {
      // Use working essential fields for region searches
      const fields = 'name,flags,cca2,cca3,region,subregion,population,area,capital';
      const response = await fetch(`${BASE_URL}/region/${region}?fields=${fields}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const countries: Country[] = await response.json();
      return countries.sort((a, b) => 
        a.name.common.localeCompare(b.name.common)
      );
    } catch (error) {
      console.error('Error fetching countries by region:', error);
      throw new Error('Failed to fetch countries data');
    }
  }  static async searchCountries(searchTerm: string): Promise<Country[]> {
    try {
      // Use working essential fields for search results
      const fields = 'name,flags,cca2,cca3,region,subregion,population,area,capital';
      const response = await fetch(`${BASE_URL}/name/${searchTerm}?fields=${fields}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const countries: Country[] = await response.json();
      return countries.sort((a, b) => 
        a.name.common.localeCompare(b.name.common)
      );
    } catch (error) {
      console.error('Error searching countries:', error);
      return [];
    }
  }

  static async getCountryDetails(cca2: string): Promise<Country | null> {
    try {
      // Get additional details for a specific country for the modal
      const response = await fetch(`${BASE_URL}/alpha/${cca2}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const countries: Country[] = await response.json();
      return countries[0] || null;
    } catch (error) {
      console.error('Error fetching country details:', error);
      return null;
    }
  }

  static getRegions(): string[] {
    return ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  }
}

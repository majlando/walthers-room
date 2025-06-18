// Simplified country interface with only essential fields
export interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  flags: {
    png: string;
    svg: string;
  };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  languages?: {
    [key: string]: string;
  };
}

// Simple filter interface
export interface CountryFilters {
  region: string;
  searchTerm: string;
}

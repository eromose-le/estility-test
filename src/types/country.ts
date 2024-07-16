export interface Country {
  name: { common: string; official: string };
  region: string;
  population: number;
  languages: { [key: string]: string };
  currencies: { [key: string]: { name: string; symbol: string } };
  capital: string[];
  latlng: number[];
  flags: { svg: string };
  coatOfArms: { svg: string };
  startOfWeek: string;
  maps: {
    googleMaps: string;
  };
}

export type Currency = {
  name: string;
  symbol: string;
};

export type Currencies = {
  [key: string]: Currency;
};

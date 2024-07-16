import { Currencies } from "../types/country";

export function formatPopulation(number: number): string {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(2) + "m";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(2) + "k";
  } else {
    return number.toString() || "";
  }
}

export function formatCurrencies(currencies: Currencies): string[] {
  return Object.keys(currencies).map(
    (key) => `${key}, ${currencies[key].symbol}`
  );
}

export function formatLatLng(latlng: number[]): string {
  const [latitude, longitude] = latlng;
  return (
    `${latitude.toFixed(2)} latitude, ${longitude.toFixed(2)} longitude` ||
    "N/A"
  );
}

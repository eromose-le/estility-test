import { useEffect, useState } from "react";
import "./App.css";

interface Country {
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

type Currency = {
  name: string;
  symbol: string;
};

type Currencies = {
  [key: string]: Currency;
};

function formatPopulation(number: number): string {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(2) + "m";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(2) + "k";
  } else {
    return number.toString();
  }
}

function formatCurrencies(currencies: Currencies): string[] {
  const formattedCurrencies: string[] = [];

  for (const key in currencies) {
    if (currencies.hasOwnProperty(key)) {
      const currency = currencies[key];
      formattedCurrencies.push(`${key}, ${currency.symbol}`);
    }
  }

  return formattedCurrencies;
}

function formatLatLng(latlng: number[]): string {
  const [latitude, longitude] = latlng;
  return `${latitude.toFixed(2)} latitude, ${longitude.toFixed(2)} longitude`;
}

function App() {
  const [country, setCountry] = useState<Country | null>(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data: Country[]) => {
        const nigeriaData = data.find(
          (country) => country.name.common === "Nigeria"
        );
        setCountry(nigeriaData || null);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!country) {
    return <div>Loading...</div>;
  }

  console.log(country);

  return (
    <>
      <div className="container">
        <div className="card">
          <div className="flag">
            <img
              src={country?.flags?.svg}
              alt={`${country?.name?.common} "Flag"`}
            />
          </div>
          <h1>{country?.name?.official}</h1>
          <p>Africa</p>
          <div className="details">
            <p>
              <span role="img" aria-label="People">
                👥
              </span>{" "}
              {formatPopulation(country?.population)} People
            </p>
            <p>
              <span role="img" aria-label="Language">
                📢
              </span>{" "}
              {country?.languages?.eng || "more language"}
            </p>
            <p>
              <span role="img" aria-label="Currency">
                💵
              </span>{" "}
              {formatCurrencies(country?.currencies)}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="coat-of-arms">
            <img src={country.coatOfArms.svg} alt="Nigeria Coat of Arms" />
          </div>
          <h1>{country?.capital}</h1>
          <div className="location">
            <p>
              <span role="img" aria-label="Coordinates">
                📍
              </span>{" "}
              {formatLatLng(country?.latlng)}
            </p>
          </div>
          <div className="time">
            <p>
              <span role="img" aria-label="Day">
                🕒
              </span>{" "}
              {country?.startOfWeek?.toUpperCase()}
            </p>
          </div>
          <div className="info">
            <p>
              <span role="img" aria-label="Info">
                ℹ️
              </span>{" "}
              No definitions available.
            </p>
          </div>
          <p>{country?.region}</p>
          <a
            href={country?.maps?.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
          >
            Map Link
          </a>
        </div>
      </div>
    </>
  );
}

export default App;

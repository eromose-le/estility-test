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
  const [countryName, setCountryName] = useState<string>("Nigeria");
  const [country, setCountry] = useState<Country | null>(null);

  const fetchCountryData = (name: string) => {
    fetch(`https://restcountries.com/v3.1/name/${name}`)
      .then((response) => response.json())
      .then((data: Country[]) => {
        const countryData = data[0];
        setCountry(countryData || null);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleSearch = () => {
    fetchCountryData(countryName);
  };

  useEffect(() => {
    fetchCountryData("Nigeria");
  }, []);

  if (!country) {
    return <div>Loading...</div>;
  }

  const countryDetails = [
    {
      name: country?.name?.official,
      region: country?.region,
      image: country?.flags?.svg,
      alt: country?.name?.common,
      details: [
        {
          icon: "👥",
          value: `${formatPopulation(country?.population)} People `,
        },
        {
          icon: "📢",
          value: `${Object.values(country?.languages).join(", ") || "Nill"} `,
        },
        { icon: "💵", value: formatCurrencies(country?.currencies) },
      ],
    },
    {
      name: country?.name?.official,
      region: country?.region,
      image: country?.coatOfArms?.svg,
      alt: country?.name?.common,
      details: [
        { icon: "📍", value: country?.capital },
        { icon: "🕒", value: formatLatLng(country?.latlng) },
        { icon: "ℹ️", value: country?.startOfWeek?.toUpperCase() },
        { icon: "🕒", value: "No definitions available." },
        { icon: "🕒", value: country?.region },
        { icon: "🕒", value: country?.maps?.googleMaps },
      ],
    },
  ];

  return (
    <>
      <div className="app-container">
        <div className="card-container">
          <div className="card">
            <div className="image">
              <img
                src={country?.flags?.svg}
                alt={`${country?.name?.common} "Flag"`}
              />
            </div>
            <div className="content">
              <div className="divider"></div>
              <h1>{country?.name?.official}</h1>
              <div className="details">
                <p>{country?.region}</p>
                <div className="info">
                  <span role="img" aria-label="People">
                    👥
                  </span>
                  <p className="center-info">
                    {formatPopulation(country?.population)} People
                  </p>
                </div>
                <div className="info">
                  <span role="img" aria-label="Language">
                    📢
                  </span>
                  <p className="center-info">
                    {Object.values(country?.languages).join(", ") ||
                      "more language"}
                  </p>
                </div>
                <div className="info">
                  <span role="img" aria-label="Currency">
                    💵
                  </span>
                  <p className="center-info">
                    {formatCurrencies(country?.currencies)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="image image-fit">
              <img
                src={country?.coatOfArms?.svg}
                alt={`${country?.name?.common} "Coat of Arms"`}
              />
            </div>
            <div className="content">
              <div className="details">
                <div className="info gap-3">
                  <span role="img" aria-label="Coordinates">
                    📍
                  </span>
                  <p>{country?.capital}</p>
                </div>

                <div className="info gap-3">
                  <span role="img" aria-label="Coordinates">
                    📍
                  </span>
                  <p>{formatLatLng(country?.latlng)}</p>
                </div>

                <div className="info gap-3">
                  <span role="img" aria-label="Day">
                    🕒
                  </span>
                  <p className="monday">
                    {country?.startOfWeek?.toUpperCase()}
                  </p>
                </div>

                <div className="info gap-3">
                  <span role="img" aria-label="Info">
                    ℹ️
                  </span>
                  <p className="defination">📍 No definitions available.</p>
                </div>

                <div className="info gap-3">
                  <span role="img" aria-label="region">
                    ℹ️
                  </span>
                  <p>{country?.region}</p>
                </div>

                <div className="info gap-3">
                  <span role="img" aria-label="region">
                    ℹ️
                  </span>
                  <a
                    href={country?.maps?.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Map Link
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            placeholder="Enter country name"
          />
          <button onClick={handleSearch}>Get Details</button>
        </div>
      </div>
    </>
  );
}

export default App;

import { useEffect, useState } from "react";
import "./App.css";
import Link from "./components/Link";

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
    return number?.toString() || "";
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
        {
          icon: "ℹ️",
          value: country?.startOfWeek?.toUpperCase(),
          className: "monday",
        },
        {
          icon: "🕒",
          value: "🕒  No definitions available.",
          className: "defination",
        },
        { icon: "🕒", value: country?.region },
        {
          icon: "🕒",
          value: country?.maps?.googleMaps,
          title: "Map Link",
          type: "component",
        },
      ],
    },
  ];

  return (
    <>
      <div className="app-container">
        <div className="card-container">
          {countryDetails.map((country: any, index) => {
            return (
              <div>
                {index === 0 && (
                  <div key={country[0]?.name} className="card">
                    <div className="image">
                      <img
                        src={country?.image}
                        alt={`${country?.alt} "Flag"`}
                      />
                    </div>
                    <div className="content">
                      <div className="divider"></div>
                      <h1>{country?.name}</h1>
                      <div className="details">
                        <p className="mx-0">{country?.region}</p>
                        {country?.details?.map((details: any) => (
                          <div key={details?.value}>
                            <div className="info">
                              <span role="img" aria-label="People">
                                {details?.icon}
                              </span>
                              <p className="center-info">{details?.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {countryDetails?.map((country: any, index) => {
            return (
              <div key={country[1]?.name}>
                {index === 1 && (
                  <div className="card">
                    <div className="image image-fit">
                      <img
                        src={country?.image}
                        alt={`${country?.alt} "Coat of Arms"`}
                      />
                    </div>
                    <div className="content">
                      <div className="details">
                        {country?.details?.map((details: any) => {
                          return (
                            <div key={details?.value}>
                              {details?.type === "component" ? (
                                <div className="info gap-3">
                                  <span role="img" aria-label="region">
                                    ℹ️
                                  </span>
                                  <Link
                                    href={details.value}
                                    title={details?.title}
                                  />
                                </div>
                              ) : (
                                <div className="info gap-3">
                                  <span role="img" aria-label="Coordinates">
                                    {details?.icon}
                                  </span>
                                  <p className={`${details?.className || ""}`}>
                                    {details?.value}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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

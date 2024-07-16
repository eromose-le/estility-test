// App.tsx
import React, { useEffect, useState } from "react";
import "./App.css";
import CountryCard from "./CountryCard";

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

  const [countryName, setCountryName] = useState<string>("Nigeria");

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
          value: `${formatPopulation(country?.population)} People`,
        },
        {
          icon: "📢",
          value: `${Object.values(country?.languages).join(", ") || "Nill"}`,
        },
        {
          icon: "💵",
          value: formatCurrencies(country?.currencies),
        },
      ],
      className: "",
    },
    {
      name: country?.name?.official,
      region: country?.region,
      image: country?.coatOfArms?.svg,
      alt: country?.name?.common,
      details: [
        { icon: "📍", value: country?.capital, className: "gap-3" },
        {
          icon: "📍",
          value: formatLatLng(country?.latlng),
          className: "gap-3",
        },
        {
          icon: "🕒",
          value: country?.startOfWeek?.toUpperCase(),
          className: "gap-3 monday",
        },
        {
          icon: "ℹ️",
          value: "No definitions available.",
          className: "gap-3 defination",
        },
        { icon: "ℹ️", value: country?.region, className: "gap-3" },
        {
          icon: "ℹ️",
          value: country?.maps?.googleMaps,
          className: "gap-3",
          isLink: true,
        },
      ],
      className: "image-fit",
    },
  ];

  return (
    <>
      <div className="app-container">
        <div className="search-container">
          <input
            list="country-suggestions"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            placeholder="Enter country name"
          />
          <datalist id="country-suggestions">
            <option value="Nigeria" />
            <option value="Canada" />
            <option value="Australia" />
            <option value="Germany" />
            <option value="Brazil" />
            <option value="Japan" />
            <option value="South Africa" />
            <option value="India" />
            <option value="United States" />
            <option value="United Kingdom" />
          </datalist>
          <button onClick={handleSearch}>Get Details</button>
        </div>
        <div className="container">
          {countryDetails.map((detail, index) => (
            <CountryCard
              key={index}
              name={detail.name}
              region={detail.region}
              image={detail.image}
              alt={detail.alt}
              details={detail.details}
              className={detail.className}
              imageClassName={index === 1 ? "image-fit" : ""}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

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

interface Detail {
  icon: string;
  value: string | string[];
  className?: string;
  title?: string;
  type?: "component";
}

function formatPopulation(number: number): string {
  if (number >= 1_000_000) {
    return (number / 1_000_000).toFixed(2) + "m";
  } else if (number >= 1_000) {
    return (number / 1_000).toFixed(2) + "k";
  } else {
    return number.toString() || "";
  }
}

function formatCurrencies(currencies: Currencies): string[] {
  return Object.keys(currencies).map(
    (key) => `${key}, ${currencies[key].symbol}`
  );
}

function formatLatLng(latlng: number[]): string {
  const [latitude, longitude] = latlng;
  return (
    `${latitude.toFixed(2)} latitude, ${longitude.toFixed(2)} longitude` ||
    "Nill"
  );
}

function App() {
  const [countryName, setCountryName] = useState<string>("Nigeria");
  const [country, setCountry] = useState<Country | null>(null);

  const fetchCountryData = async (name: string) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${name}`
      );
      const data: Country[] = await response.json();
      setCountry(data[0] || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCountryData(countryName);
  }, [countryName]);

  if (!country) {
    <div>Loading...</div>;
  }

  const countryDetails = [
    {
      name: country?.name?.official || "N/A",
      region: country?.region || "N/A",
      image: country?.flags?.svg || "N/A",
      alt: country?.name?.common || "N/A",
      details: [
        {
          icon: "👥",
          value: `${formatPopulation(country?.population || 0)} People`,
          infoClassName: "info-left",
        },
        {
          icon: "📢",
          value: `${
            Object.values(country?.languages || {}).join(", ") || "N/A"
          }`,
          infoClassName: "info-left",
        },
        {
          icon: "💵",
          value: formatCurrencies(country?.currencies || {}) ?? "N/A",
          infoClassName: "info-left",
        },
      ],
    },
    {
      name: country?.name.official || "N/A",
      region: country?.region || "N/A",
      image: country?.coatOfArms.svg || "N/A",
      alt: country?.name.common || "N/A",
      details: [
        {
          icon: "📍",
          value: country?.capital.join(", ") || "N/A",
          className: "px-4",
        },
        {
          icon: "🕒",
          value: formatLatLng(country?.latlng || [0, 0]) || "N/A",
          className: "px-4",
        },
        {
          icon: "ℹ️",
          value: country?.startOfWeek.toUpperCase() || "N/A",
          className: "monday px-4",
        },
        {
          icon: "🕒",
          value: "🕒  No definitions available.",
          className: "definition",
        },
        { icon: "🕒", value: country?.region || "N/A", className: "px-4" },
        {
          icon: "🕒",
          value: country?.maps?.googleMaps || "N/A",
          className: "px-4",
          title: "Map Link",
          type: "component",
        },
      ],
    },
  ];

  return (
    <div className="app-container">
      <div className="card-container">
        {countryDetails?.map((country, index) => (
          <div key={index} className="card">
            <div className={`image ${index === 1 ? "image-fit" : ""}`}>
              <img
                src={country.image}
                alt={`${country.alt} ${index === 0 ? "Flag" : "Coat of Arms"}`}
              />
            </div>
            <div className="content">
              {index === 0 ? (
                <div>
                  <h1>{country.name}</h1>
                  <p className="region">{country.region}</p>
                </div>
              ) : null}

              <div className="details">
                {country.details.map((detail: any, detailIndex) => (
                  <div
                    key={detailIndex}
                    className={`${detail?.infoClassName} info`}
                  >
                    <span role="img" aria-label={detail.icon}>
                      {detail.icon}
                    </span>
                    {detail.type === "component" ? (
                      <Link
                        href={detail.value as string}
                        title={detail.title}
                      />
                    ) : (
                      <p className={detail.className || ""}>{detail.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="search-container">
        <input
          type="text"
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
          placeholder="Enter country name"
        />
        <button onClick={() => fetchCountryData(countryName)}>
          Get Details
        </button>
      </div>
    </div>
  );
}

export default App;

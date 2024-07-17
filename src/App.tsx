import { FormEvent, useEffect, useState } from "react";
import "./App.css";
import Link from "./components/Link";
import { Country } from "./types/country";
import {
  formatCurrencies,
  formatLatLng,
  formatPopulation,
} from "./utils/helper";

const BASE_URL = "https://restcountries.com/v3.1/name/";

const COUNTRY_SUGGESTIONS = [
  "Nigeria",
  "Canada",
  "Australia",
  "Germany",
  "Brazil",
  "Japan",
  "South Africa",
  "United States",
  "United Kingdom",
];

function App() {
  const [countryName, setCountryName] = useState<string>("Nigeria");
  const [country, setCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchCountryData = async (name: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BASE_URL}${name}`);
      const data: Country[] = await response.json();
      setCountry(data[0] || null);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchCountryData(countryName);
  }, []);

  const ErrorMessage: JSX.Element = <div className="error">No Data found</div>;

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
          className: "px-4 map",
          title: "Map Link",
          type: "component",
        },
      ],
    },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchCountryData(countryName);
  };

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
                {country?.details.map((detail: any, detailIndex) => (
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
                        className={detail.className}
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

      <>
        <form className="search-container" onSubmit={handleSubmit}>
          <input
            list="country-suggestions"
            type="text"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            placeholder="Enter country name"
          />
          <datalist id="country-suggestions">
            {COUNTRY_SUGGESTIONS.map((country) => (
              <option key={country} value={country} />
            ))}
          </datalist>
          <button type="submit">
            {isLoading ? "fetching.." : "Get Details"}
          </button>
          {(isError || !country) && ErrorMessage}
        </form>
      </>
    </div>
  );
}

export default App;

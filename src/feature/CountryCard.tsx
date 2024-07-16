// CountryCard.tsx
import React from "react";

interface Detail {
  icon: string;
  value: string | string[];
  isLink?: boolean;
  className?: string;
}

interface CountryCardProps {
  name: string;
  region: string;
  image: string;
  alt: string;
  details: Detail[];
  className: string;
  imageClassName?: string;
}

const CountryCard: React.FC<CountryCardProps> = ({
  name,
  region,
  image,
  alt,
  details,
  className,
  imageClassName,
}) => {
  return (
    <div className={`card ${className}`}>
      <div className={`image ${imageClassName}`}>
        <img src={image} alt={`${alt}`} />
      </div>
      <div className="content">
        <div className="divider"></div>
        <h1>{name}</h1>
        <div className="details">
          <p>{region}</p>
          {details.map((detail, index) => (
            <div className={`info ${detail.className || ""}`} key={index}>
              <span role="img" aria-label="Icon">
                {detail.icon}
              </span>
              {detail.isLink ? (
                <a
                  href={detail.value as string}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Map Link
                </a>
              ) : (
                <p className="center-info">
                  {Array.isArray(detail.value)
                    ? detail.value.join(", ")
                    : detail.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryCard;

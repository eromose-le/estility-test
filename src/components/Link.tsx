import React from "react";

interface LinkProps {
  href: string;
  title: string;
}

const Link: React.FC<LinkProps> = ({ href, title }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {title}
    </a>
  );
};

export default Link;

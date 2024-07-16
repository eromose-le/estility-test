import React from "react";

interface LinkProps {
  href: string;
  title: string;
  className?: string;
}

const Link: React.FC<LinkProps> = ({ href, title, className }) => {
  return (
    <a
      className={className || ""}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {title}
    </a>
  );
};

export default Link;

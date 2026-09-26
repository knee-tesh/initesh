import Link from "next/link";
import { portfolioData } from "@/data/portfolio";

const NAV = [
  { href: "/#impact", label: "Impact" },
  { href: "/#leadership", label: "Leadership" },
  { href: "/#experience", label: "Experience" },
  { href: "/#expertise", label: "Expertise" },
  { href: "/#contact", label: "Contact", cta: true },
];

const name = portfolioData.profile.name;
const monogram = name
  .split(" ")
  .map((part) => part[0])
  .join("");

export default function SiteHeader() {
  return (
    <header className="portfolio-header">
      <div className="portfolio-shell portfolio-header-inner">
        <a className="portfolio-skip" href="#main-content">
          Skip to content
        </a>
        <Link className="portfolio-monogram" href="/#overview">
          {monogram}
          <span aria-hidden="true">.</span>
          <span className="portfolio-visually-hidden">{`${name}, back to top`}</span>
        </Link>
        <nav className="portfolio-nav" aria-label="Primary">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={item.cta ? "portfolio-nav-cta" : undefined}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";
import { portfolioData } from "@/data/portfolio";

const LINKS = [
  { href: "/#impact", label: "Impact" },
  { href: "/#leadership", label: "Leadership" },
  { href: "/#case-study", label: "Case study" },
  { href: "/#experience", label: "Experience" },
  { href: "/#expertise", label: "Expertise" },
  { href: "/#engagements", label: "Engagements" },
  { href: "/#contact", label: "Contact" },
];

const name = portfolioData.profile.name;
const monogram = name
  .split(" ")
  .map((part) => part[0])
  .join("");

export default function Footer() {
  return (
    <footer className="portfolio-footer">
      <div className="portfolio-shell portfolio-footer-inner">
        <Link className="portfolio-monogram" href="/#overview">
          {monogram}
          <span aria-hidden="true">.</span>
          <span className="portfolio-visually-hidden">{`${name}, back to top`}</span>
        </Link>
        <nav className="portfolio-footer-nav" aria-label="Footer">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="portfolio-footer-meta">
          <a className="portfolio-footer-email" href={`mailto:${portfolioData.contact.email}`}>
            {portfolioData.contact.email}
          </a>
          <p className="portfolio-label">
            &copy; {new Date().getFullYear()} {name}
          </p>
        </div>
      </div>
    </footer>
  );
}

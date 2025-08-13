import {
  FooterSection,
  SocialLink,
  FooterStats,
} from "../../interfaces/footer";

export const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How It Works" },
      { href: "/docs", label: "Documentation" },
      { href: "#", label: "Security" },
      { href: "#", label: "Roadmap" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs#developers", label: "API Documentation" },
      { href: "#", label: "SDK Downloads" },
      { href: "#", label: "GitHub Repository" },
      { href: "#", label: "Integration Guides" },
      { href: "#", label: "Developer Support" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "#", label: "Blog & News" },
      { href: "#", label: "Careers" },
      { href: "#", label: "Contact Support" },
      { href: "#", label: "Legal & Terms" },
    ],
  },
];

export const socialLinks: SocialLink[] = [
  {
    href: "#",
    label: "Twitter",
    icon: "twitter",
  },
  {
    href: "#",
    label: "Pinterest",
    icon: "pinterest",
  },
  {
    href: "#",
    label: "LinkedIn",
    icon: "linkedin",
  },
  {
    href: "https://github.com/ruhulamin1398/Next-generation-USD__NexUSD__Hybrid-USD-Pegged-Stablecoin-Ecosystem",
    label: "GitHub",
    icon: "github",
  },
];

export const footerStats: FooterStats[] = [
  { label: "Live on Multiple Chains", value: "active" },
  { label: "$1.2B+ Total Value Locked", value: "tvl" },
  { label: "24/7 Monitored Reserves", value: "monitoring" },
];

export const legalLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Cookie Policy" },
  { href: "#", label: "Security" },
];

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import CTAsection from "./components/CTA";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "NexUSD - Next-Generation USD Stablecoin",
  description:
    "Hybrid USD-pegged stablecoin ecosystem backed by both fiat reserves and crypto assets. Scalable, transparent, and interoperable across multiple blockchains.",
  keywords:
    "stablecoin, USD, DeFi, blockchain, crypto, fiat-backed, hybrid, multi-chain, Web3",
  authors: [{ name: "NexUSD Team" }],

  // Open Graph tags for social media sharing
  openGraph: {
    title: "NexUSD - Next-Generation USD Stablecoin",
    description:
      "Hybrid USD-pegged stablecoin ecosystem backed by both fiat reserves and crypto assets. Scalable, transparent, and interoperable across multiple blockchains.",
    url: "https://nex-usd.vercel.app/",
    siteName: "NexUSD",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/feature.png",
        width: 1200,
        height: 630,
        alt: "NexUSD - Next-Generation USD Stablecoin Platform",
        type: "image/png",
      },
    ],
  },

  // Twitter Card tags
  twitter: {
    card: "summary_large_image",
    title: "NexUSD - Next-Generation USD Stablecoin",
    description:
      "Hybrid USD-pegged stablecoin ecosystem backed by both fiat reserves and crypto assets.",
    images: ["/feature.png"],
    creator: "@nexusd", // Replace with your actual Twitter handle
    site: "@nexusd", // Replace with your actual Twitter handle
  },

  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Manifest and theme
  manifest: "/manifest.json", // You can create this later for PWA features
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}
      >
        <ThemeProvider>
          <Navigation />
          {children}

          <CTAsection />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

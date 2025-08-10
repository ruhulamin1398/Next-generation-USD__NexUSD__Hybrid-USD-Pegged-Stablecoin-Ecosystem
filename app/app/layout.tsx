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

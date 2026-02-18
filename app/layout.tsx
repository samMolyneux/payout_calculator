import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://payoutcalculator.app"),
  title: "Payout Calculator - Cash Game Payout Splitter",
  description:
    "Quickly calculate and simplify cash game payouts. Enter buy-ins and cash-outs, and get the minimum transactions needed to settle up.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Payout Calculator - Cash Game Payout Splitter",
    description:
      "Quickly calculate and simplify cash game payouts. Enter buy-ins and cash-outs, and get the minimum transactions needed to settle up.",
    url: "https://payoutcalculator.app",
    siteName: "Payout Calculator",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: "Payout Calculator - Cash Game Payout Splitter",
    description:
      "Quickly calculate and simplify cash game payouts. Enter buy-ins and cash-outs, and get the minimum transactions needed to settle up.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}

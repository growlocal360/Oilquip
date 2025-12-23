import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oilquip, Inc. | Rooted in Resolve - Fluid Power Solutions Since 1960",
  description:
    "Oilquip is a fluid power distributor and engineering firm established in 1960. Moog authorized integrator specializing in design & engineering, power generation, fluid conditioning, and repairs.",
  keywords: [
    "fluid power",
    "hydraulics",
    "Moog integrator",
    "power generation",
    "Lake Charles LA",
    "actuator repair",
    "fluid conditioning",
  ],
  openGraph: {
    title: "Oilquip, Inc. | Rooted in Resolve",
    description:
      "A legacy of turning fluid power into precision, motion into mastery. Since 1960.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-steel-950 text-steel-100`}
      >
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

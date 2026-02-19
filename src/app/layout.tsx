import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dent-X Dental Clinic | Best Dentist in Rajkot",
    template: "%s | Dent-X Dental",
  },
  description:
    "Dent-X Dental Clinic in Rajkot offers Root Canal, Dental Implants, Teeth Whitening, Braces & Smile Designing. 17+ years of trusted dental care with 65,000+ happy patients.",
  keywords: [
    "Dentist in Rajkot",
    "Dental Clinic Rajkot",
    "Root Canal Treatment",
    "Dental Implants",
    "Teeth Whitening",
    "Braces in Rajkot",
    "Smile Designing",
  ],
  authors: [{ name: "Dent-X Dental" }],
  creator: "Dent-X Dental",
  metadataBase: new URL("https://dentxdental.com"), // change when domain is live
  openGraph: {
    title: "Dent-X Dental Clinic | Your Smile, Our Passion",
    description:
      "Trusted dental clinic in Rajkot with 17+ years of excellence and 65,000+ happy patients.",
    url: "https://dentxdental.com",
    siteName: "Dent-X Dental",
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-[#1A364D]`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dentxdental.com"),

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

  openGraph: {
    title: "Dent-X Dental Clinic | Your Smile, Our Passion",
    description:
      "Trusted dental clinic in Rajkot with 17+ years of excellence and 65,000+ happy patients.",
    url: "https://dentxdental.com",
    siteName: "Dent-X Dental",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Dent-X Dental Clinic | Best Dentist in Rajkot",
    description:
      "17+ years of trusted dental care in Rajkot. Root Canal, Implants, Braces & Smile Designing.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >

        <LayoutWrapper>
          {children}
        </LayoutWrapper>

        <WhatsAppButton />
      </body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, DM_Serif_Text } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";
import { generateBusinessSchema } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerifText = DM_Serif_Text({
  variable: "--font-dm-serif-text",
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dentxdental.co.in"),

  title: {
    default: "Dent X Dental Clinic | Best Dentist in Rajkot Gujarat",
    template: "%s | Dent X Dental Clinic",
  },

  description:
    "Dent X Dental Clinic in Rajkot offers advanced dental treatments including root canal, dental implants, braces, teeth whitening & cosmetic dentistry. 17+ years experience.",

  keywords: [
    "Dentist in Rajkot",
    "Best Dental Clinic Rajkot",
    "Root Canal Treatment Rajkot",
    "Dental Implants Rajkot",
    "Teeth Whitening Rajkot",
    "Braces in Rajkot",
    "Smile Designing Rajkot",
    "Cosmetic Dentistry Rajkot",
    "Dental Specialist Rajkot",
    "Gujarat Dental Clinic",
    "Emergency Dentist Rajkot",
    "Pediatric Dentist Rajkot"
  ],

  authors: [{ name: "Dent X Dental Clinic", url: "https://dentxdental.co.in" }],
  creator: "Dent X Dental Clinic",
  publisher: "Dent X Dental Clinic",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: "https://dentxdental.co.in",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dentxdental.co.in",
    siteName: "Dent X Dental Clinic",
    title: "Dent X Dental Clinic | Best Dentist in Rajkot Gujarat",
    description:
      "Leading dental clinic in Rajkot with 17+ years of excellence. Specializing in root canal, dental implants, braces, and cosmetic dentistry. Book appointment today!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dent X Dental Clinic - Best Dentist in Rajkot Gujarat",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@dentxclinic",
    creator: "@dentxclinic",
    title: "Dent X Dental Clinic | Best Dentist in Rajkot Gujarat",
    description:
      "Leading dental clinic in Rajkot with 17+ years of excellence. Advanced dental treatments including implants, root canal & cosmetic dentistry.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#2FA4C5" },
    ],
  },

  manifest: "/site.webmanifest",

  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },

  category: "Healthcare",
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
  // Business Schema JSON-LD for Local SEO
  const businessSchema = generateBusinessSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessSchema)
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifText.variable} antialiased min-h-screen flex flex-col`}
      >

        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
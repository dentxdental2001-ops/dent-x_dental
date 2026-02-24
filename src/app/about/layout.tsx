import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Dent X Dental Clinic | Best Dentist in Rajkot Gujarat",
  description: "Learn about Dent X Dental Clinic, Rajkot's leading dental clinic with 17+ years of excellence. Meet our expert team and see our state-of-the-art dental facilities.",
  keywords: [
    "About Dent X Dental",
    "Best Dentist Rajkot",
    "Dental Clinic Team Rajkot",
    "Experienced Dentist Gujarat",
    "Dental Specialist Rajkot",
    "Modern Dental Clinic",
    "Dental Care Excellence",
    "Professional Dental Team"
  ],
  openGraph: {
    title: "About Dent X Dental Clinic | Expert Dental Care in Rajkot",
    description: "Discover why Dent X is Rajkot's trusted dental clinic. 17+ years of excellence, expert team, and advanced technology for comprehensive dental care.",
    url: "https://dentxdental.co.in/about",
    images: [
      {
        url: "/about-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dent X Dental Clinic Team and Facilities",
      },
    ],
  },
  alternates: {
    canonical: "https://dentxdental.co.in/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
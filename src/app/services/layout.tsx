import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Services in Rajkot | Root Canal, Implants & Cosmetic Dentistry",
  description: "Complete dental services in Rajkot including root canal treatment, dental implants, braces, teeth whitening, and cosmetic dentistry. Expert care with advanced technology.",
  keywords: [
    "Dental Services Rajkot",
    "Root Canal Treatment Rajkot",
    "Dental Implants Rajkot",
    "Braces Rajkot",
    "Teeth Whitening Rajkot",
    "Cosmetic Dentistry Rajkot",
    "Dental Clinic Services Gujarat",
    "Advanced Dental Care Rajkot"
  ],
  openGraph: {
    title: "Comprehensive Dental Services in Rajkot | Dent X Dental Clinic",
    description: "Expert dental services including root canal, implants, braces & cosmetic dentistry in Rajkot. Advanced technology, experienced doctors.",
    url: "https://dentxdental.co.in/services",
    images: [
      {
        url: "/services-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dental Services at Dent X Clinic Rajkot",
      },
    ],
  },
  alternates: {
    canonical: "https://dentxdental.co.in/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
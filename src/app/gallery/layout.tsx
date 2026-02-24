import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Before & After Gallery | Dental Transformations in Rajkot",
  description: "View amazing dental transformations at Dent X Dental Clinic, Rajkot. See real before & after results of root canal, implants, braces, and smile makeovers.",
  keywords: [
    "Dental Before After Rajkot",
    "Smile Transformation Gallery",
    "Dental Results Rajkot",
    "Teeth Makeover Results",
    "Dental implant before after",
    "Braces results Rajkot",
    "Smile designing gallery",
    "Dental photography Rajkot"
  ],
  openGraph: {
    title: "Amazing Dental Transformations | Dent X Gallery Rajkot",
    description: "See incredible before & after dental transformations. Real results from our expert dental treatments in Rajkot including implants, braces & smile makeovers.",
    url: "https://dentxdental.co.in/gallery",
    images: [
      {
        url: "/gallery-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dental Before After Gallery - Dent X Clinic Rajkot",
      },
    ],
  },
  alternates: {
    canonical: "https://dentxdental.co.in/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
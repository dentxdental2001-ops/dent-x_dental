import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Reviews & Testimonials | Best Dentist in Rajkot",
  description: "Read genuine patient testimonials about Dent X Dental Clinic Rajkot. See why we are rated as the best dental clinic in Rajkot with 5-star reviews.",
  keywords: [
    "Dental Reviews Rajkot",
    "Patient Testimonials",
    "Best Dentist Reviews Rajkot",
    "Dental Clinic Feedback",
    "Happy Patients Rajkot",
    "Dental Treatment Reviews",
    "5 Star Dental Clinic",
    "Patient Experience Rajkot"
  ],
  openGraph: {
    title: "Patient Testimonials | Why Choose Dent X Dental Clinic Rajkot",
    description: "Read what our patients say about their experience at Dent X Dental Clinic. Genuine reviews from satisfied patients in Rajkot.",
    url: "https://dentxdental.co.in/testimonials",
    images: [
      {
        url: "/testimonials-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Patient Testimonials - Dent X Dental Clinic Rajkot",
      },
    ],
  },
  alternates: {
    canonical: "https://dentxdental.co.in/testimonials",
  },
};

export default function TestimonialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
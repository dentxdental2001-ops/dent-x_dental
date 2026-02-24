import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Dent X Dental Clinic | Book Appointment in Rajkot",
  description: "Contact Dent X Dental Clinic in Rajkot for appointments. Call us, visit our clinic, or book online. Expert dental care with convenient location and timings.",
  keywords: [
    "Contact Dentist Rajkot",
    "Book Dental Appointment",
    "Dental Clinic Address Rajkot",
    "Emergency Dentist Contact",
    "Dent X Phone Number",
    "Dental Consultation Rajkot",
    "Clinic Timings Rajkot",
    "Dental Appointment Booking"
  ],
  openGraph: {
    title: "Contact & Book Appointment | Dent X Dental Clinic Rajkot",
    description: "Get in touch with Dent X Dental Clinic for expert dental care in Rajkot. Easy appointment booking, convenient location, and flexible timings.",
    url: "https://dentxdental.co.in/contact",
    images: [
      {
        url: "/contact-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Dent X Dental Clinic - Location and Contact Details",
      },
    ],
  },
  alternates: {
    canonical: "https://dentxdental.co.in/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
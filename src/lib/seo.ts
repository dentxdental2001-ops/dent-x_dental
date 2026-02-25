import { Metadata } from "next";

// SEO Constants
export const SITE_CONFIG = {
  name: "Dent X Dental Clinic",
  description: "Leading dental clinic in Rajkot offering comprehensive dental treatments with 17+ years of excellence",
  url: "https://dentxdental.co.in",
  ogImage: "/og-image.jpg",
  creator: "Dent X Dental Clinic",
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
};

// Business Information for Schema
export const BUSINESS_INFO = {
  name: "Dent X Dental Clinic",
  alternateName: "Dent X Dental",
  description: "Leading dental clinic in Rajkot offering comprehensive dental treatments including root canal, dental implants, braces, and cosmetic dentistry with 17+ years of excellence.",
  telephone: "+91-9876543210",
  email: "info@dentxdental.co.in",
  priceRange: "₹₹",
  address: {
    streetAddress: "123 Main Street",
    addressLocality: "Rajkot",
    addressRegion: "Gujarat",
    postalCode: "360001",
    addressCountry: "IN"
  },
  geo: {
    latitude: "22.3039",
    longitude: "70.8022"
  },
  openingHours: [
    {
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00"
    },
    {
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "18:00"
    }
  ],
  sameAs: [
    "https://www.google.com/maps/place/your-google-maps-url",
    "https://www.facebook.com/dentxclinic",
    "https://www.instagram.com/dentxclinic"
  ]
};

// Generate base metadata
export function generateBaseMetadata(
  title: string,
  description: string,
  path: string = "",
  keywords?: string[]
): Metadata {
  const url = `${SITE_CONFIG.url}${path}`;
  
  return {
    title,
    description,
    keywords: keywords || SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.creator, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.creator,
    publisher: SITE_CONFIG.creator,
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
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: SITE_CONFIG.name,
      title,
      description,
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - ${SITE_CONFIG.name}`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@dentxclinic",
      creator: "@dentxclinic",
      title,
      description,
      images: [SITE_CONFIG.ogImage],
    },
  };
}

// Generate service metadata
export function generateServiceMetadata(
  serviceTitle: string,
  serviceDescription: string,
  slug: string
): Metadata {
  const title = `${serviceTitle} in Rajkot | Advanced ${serviceTitle} Treatment`;
  const description = `${serviceDescription} Expert ${serviceTitle.toLowerCase()} treatment at Dent X Dental Clinic, Rajkot with advanced technology and experienced specialists.`;
  
  const keywords = [
    `${serviceTitle} Rajkot`,
    `${serviceTitle} Treatment`,
    `${serviceTitle} Specialist Rajkot`,
    `${serviceTitle} Cost Rajkot`,
    `Best ${serviceTitle} Clinic`,
    `Advanced ${serviceTitle}`,
    `${serviceTitle} Gujarat`,
    `Dental ${serviceTitle} Rajkot`
  ];

  return generateBaseMetadata(title, description, `/services/${slug}`, keywords);
}

// Generate Business Schema
export function generateBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "LocalBusiness", "MedicalBusiness"],
    ...BUSINESS_INFO,
    "url": SITE_CONFIG.url,
    "address": {
      "@type": "PostalAddress",
      ...BUSINESS_INFO.address
    },
    "geo": {
      "@type": "GeoCoordinates",
      ...BUSINESS_INFO.geo
    },
    "openingHoursSpecification": BUSINESS_INFO.openingHours.map(hours => ({
      "@type": "OpeningHoursSpecification",
      ...hours
    })),
    "currenciesAccepted": "INR",
    "paymentAccepted": "Cash, Credit Card, Debit Card, UPI",
    "image": [
      `${SITE_CONFIG.url}/clinic-image-1.jpg`,
      `${SITE_CONFIG.url}/clinic-image-2.jpg`
    ],
    "logo": `${SITE_CONFIG.url}/logo.png`,
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Professional License",
        "name": "Bachelor of Dental Surgery (BDS)"
      }
    ],
    "medicalSpecialty": [
      "Endodontics",
      "Implantology",
      "Orthodontics",
      "Cosmetic Dentistry",
      "Periodontology"
    ],
    "serviceType": "Dental Care",
    "areaServed": {
      "@type": "City",
      "name": "Rajkot",
      "containedInPlace": {
        "@type": "State",
        "name": "Gujarat",
        "containedInPlace": {
          "@type": "Country",
          "name": "India"
        }
      }
    }
  };
}

// Generate FAQ Schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { servicesData } from "../../lib/servicesData";
import ServiceDetailPage from "./ServiceDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for each service page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found | Dent X Dental Clinic",
    };
  }

  const title = `${service.title} in Rajkot | Advanced ${service.title} Treatment`;
  const description = `${service.short} Expert ${service.title.toLowerCase()} treatment at Dent X Dental Clinic, Rajkot with advanced technology and experienced specialists.`;

  return {
    title,
    description,
    keywords: [
      `${service.title} Rajkot`,
      `${service.title} Treatment`,
      `${service.title} Specialist Rajkot`,
      `${service.title} Cost Rajkot`,
      `Best ${service.title} Clinic`,
      `Advanced ${service.title}`,
      `${service.title} Gujarat`,
      `Dental ${service.title} Rajkot`
    ],
    openGraph: {
      title,
      description,
      url: `https://dentxdental.co.in/services/${slug}`,
      images: [
        {
          url: `/services/${slug}-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${service.title} Treatment at Dent X Dental Clinic Rajkot`,
        },
      ],
    },
    alternates: {
      canonical: `https://dentxdental.co.in/services/${slug}`,
    },
  };
}

// Generate static params for all services
export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = servicesData.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  // Service Schema JSON-LD
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "name": service.title,
    "alternateName": service.title,
    "description": service.detail.what,
    "providedBy": {
      "@type": "Dentist",
      "name": "Dent X Dental Clinic",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Rajkot",
        "addressRegion": "Gujarat",
        "addressCountry": "IN"
      }
    },
    "bodyLocation": {
      "@type": "BodySystem",
      "name": "Mouth"
    },
    "procedureType": {
      "@type": "MedicalProcedureType",
      "name": "Dental Procedure"
    },
    "preparation": service.detail.treatment,
    "followup": "Regular dental checkups recommended",
    "benefits": `Professional ${service.title.toLowerCase()} treatment with advanced technology`,
    "risks": "Minimal risks when performed by qualified dentist",
    "averageTimeRequired": "PT1H",
    "procedureCode": {
      "@type": "MedicalCode",
      "codingSystem": "Dental Procedure Codes"
    }
  };

  // FAQ Schema for service if applicable
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is ${service.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": service.detail.what
        }
      },
      {
        "@type": "Question",
        "name": `How is ${service.title} performed at Dent X?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": service.detail.treatment
        }
      },
      {
        "@type": "Question",
        "name": `Why choose Dent X for ${service.title} in Rajkot?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Dent X Dental Clinic offers advanced ${service.title.toLowerCase()} treatment with experienced specialists, modern technology, and personalized care in Rajkot.`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <ServiceDetailPage service={service} />
    </>
  );
}
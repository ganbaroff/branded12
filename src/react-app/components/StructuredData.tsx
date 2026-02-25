import { useLanguage } from '@/react-app/hooks/useLanguage';

export default function StructuredData() {
  const { language } = useLanguage();

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "AdvertisingAgency",
    "name": "B2Brand Creative Agency",
    "description": language === 'az'
      ? "Bakıda kreativ marketinq agentliyi. SMM, video çəkiliş, AI kontent, target reklam və brendinq."
      : language === 'ru'
      ? "Креативное маркетинговое агентство в Баку. SMM, видеосъемка, AI контент, таргетированная реклама и брендинг."
      : "Creative marketing agency in Baku. SMM, video production, AI content, targeted advertising and branding.",
    "url": "https://b2brand.az",
    "logo": "https://b2brand.az/logo.png",
    "image": "https://b2brand.az/og-image.png",
    "telephone": "+994501234567",
    "email": "info@b2brand.az",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "28 May Street",
      "addressLocality": "Baku",
      "addressCountry": "AZ"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.4093",
      "longitude": "49.8671"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Azerbaijan"
    },
    "sameAs": [
      "https://www.facebook.com/b2brand",
      "https://www.instagram.com/b2brand",
      "https://www.linkedin.com/company/b2brand"
    ],
    "priceRange": "$$",
    "openingHours": "Mo-Fr 09:00-18:00",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "120"
    }
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Marketing Services",
    "provider": {
      "@type": "Organization",
      "name": "B2Brand Creative Agency"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Azerbaijan"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Marketing Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "SMM Management"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Video Production"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "AI Content Creation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Targeted Advertising"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Branding"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
    </>
  );
}

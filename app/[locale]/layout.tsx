import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal"],
  display: 'swap',
});

const siteUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://www.khashika.com'
    : 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: "Khashika - Joaillerie Indienne d'Exception",
    template: '%s | Khashika',
  },
  description:
    'Découvrez notre collection de bijoux artisanaux en argent massif, inspirés de la tradition indienne. Créations uniques depuis 1924. Bijoux indiens de qualité, techniques Kundan et Meenakari.',
  keywords: [
    'bijoux indiens',
    'argent massif',
    'bijoux artisanaux',
    'joaillerie indienne',
    'bijoux traditionnels',
    'Khashika',
    'bijoux en argent',
    'bijoux de luxe',
    'artisanat bijoux',
  ],
  authors: [{ name: 'Khashika' }],
  creator: 'Khashika',
  publisher: 'Khashika',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Khashika',
    title: 'Khashika – Bijoux Indiens en Argent Massif',
    description: 'Découvrez notre collection de bijoux artisanaux en argent massif, inspirés de la tradition indienne.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khashika – Bijoux Indiens en Argent Massif',
    description: 'Bijoux artisanaux en argent massif, inspirés de la tradition indienne.',
  },
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
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
  other: {
    'theme-color': '#f4f1eb',
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params: _params,
}: Props) {
  // Params are available but not needed in this layout
  await _params;
  // JSON-LD Schema.org pour Organization (SEO Technique)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Khashika',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Joaillerie Indienne d\'Exception - Bijoux artisanaux en argent massif depuis 1924',
    foundingDate: '1924',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressLocality: 'CERNAY',
      streetAddress: '43, Rue du Raisin',
      postalCode: '68700',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'evelyne.stutz@khashika.com',
      telephone: '+33629068595',
      availableLanguage: ['French'],
    },
    sameAs: [
      'https://instagram.com/khashika',
      'https://facebook.com/khashika',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  };

  // JSON-LD pour WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Khashika',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <div className={`${arimo.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <Navbar />
                {children}
                <Footer />
                <AIChatbot />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </div>
    </>
  );
}

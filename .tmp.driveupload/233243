import type { Metadata } from "next";
import { Karma } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import { CartProvider } from "@/lib/context/CartContext";
import { WishlistProvider } from "@/lib/context/WishlistContext";
import { ThemeProvider } from "@/components/ThemeProvider";

const karma = Karma({
  variable: "--font-karma",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Schema.org pour Organization
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
    },
    sameAs: [
      // Ajouter les réseaux sociaux si disponibles
    ],
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${karma.variable} font-serif antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              {children}
              <Footer />
              <AIChatbot />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

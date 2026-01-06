import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Plan du site | Khashika',
  description: 'Plan du site Khashika - Boutique de bijoux indiens artisanaux et accessoires de mode',
};

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-secondary mb-12">
          Plan du site
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Accueil */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Accueil
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Accueil
                </Link>
              </li>
            </ul>
          </section>

          {/* La Boutique */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              La boutique
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/shop" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Boutique en ligne
                </Link>
              </li>
            </ul>
          </section>

          {/* Types de bijoux */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Types de bijoux
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/shop?types=bagues" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Bagues
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?types=boucles-oreilles" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Boucles d'oreilles
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?types=colliers" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Colliers
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?types=pendentifs" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Pendentifs
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?types=bracelets" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?types=chaines-cheville" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Chaînes cheville
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?types=clous-oreilles" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Clous d'oreilles
                </Link>
              </li>
            </ul>
          </section>

          {/* Bijoux argent */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Bijoux argent
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/shop?materials=argent&types=bagues" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Bagues argent
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=argent&types=boucles-oreilles" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Boucles d'oreilles argent
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=argent&types=bracelets" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Bracelets argent
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=argent&types=colliers" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Colliers argent
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=argent&types=pendentifs" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Pendentifs argent
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=argent&types=chaines-cheville" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Chaînes cheville argent
                </Link>
              </li>
            </ul>
          </section>

          {/* Pierres semi-précieuses */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Pierres semi-précieuses
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/shop?stones=turquoise" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Turquoise
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=amethyste" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Améthyste
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=lapis-lazuli" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Lapis-lazuli
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=grenat" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Grenat
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=pierre-de-lune" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Pierre de lune
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=corail" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Corail
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=onyx" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Onyx
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=malachite" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Malachite
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=labradorite" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Labradorite
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=citrine" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Citrine
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=quartz-rose" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Quartz rose
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?stones=aventurine" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Aventurine
                </Link>
              </li>
            </ul>
          </section>

          {/* Bijoux fantaisie */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Bijoux fantaisie
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/shop?materials=laiton&types=bagues" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Bagues fantaisie
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=laiton&types=boucles-oreilles" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Boucles d'oreilles fantaisie
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=laiton&types=bracelets" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Bracelets fantaisie
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=laiton&types=colliers" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Colliers fantaisie
                </Link>
              </li>
              <li>
                <Link href="/fr/shop?materials=laiton&types=pendentifs" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Pendentifs fantaisie
                </Link>
              </li>
            </ul>
          </section>

          {/* Accessoires de mode */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Accessoires de mode
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/accessoires" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Tous les accessoires
                </Link>
              </li>
              <li>
                <Link href="/fr/accessoires?accessories=pashminas" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Pashminas
                </Link>
              </li>
              <li>
                <Link href="/fr/accessoires?accessories=foulards" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Foulards
                </Link>
              </li>
              <li>
                <Link href="/fr/accessoires?accessories=pochettes" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Pochettes
                </Link>
              </li>
              <li>
                <Link href="/fr/accessoires?accessories=sacs" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Sacs
                </Link>
              </li>
            </ul>
          </section>

          {/* Pages pratiques */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Pages pratiques
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/legal/cgv" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link href="/fr/legal/livraison" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/fr/contact" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/fr/plan-du-site" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Plan du site
                </Link>
              </li>
            </ul>
          </section>

          {/* Pages annexes */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Autour du bijou
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/pierres-semi-precieuses" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Les pierres semi-précieuses
                </Link>
              </li>
              <li>
                <Link href="/fr/entretien-bijoux" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Entretien des bijoux
                </Link>
              </li>
              <li>
                <Link href="/fr/culture-bijou-indien" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  L'Inde et la culture du bijou
                </Link>
              </li>
              <li>
                <Link href="/fr/entretien-pashminas" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Entretien des pashminas
                </Link>
              </li>
            </ul>
          </section>

          {/* Mon compte */}
          <section>
            <h2 className="text-xl font-serif text-secondary mb-4 pb-2 border-b-2 border-[#D4AF37]">
              Mon compte
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/fr/login" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/fr/cart" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Panier
                </Link>
              </li>
              <li>
                <Link href="/fr/wishlist" className="text-[#2596be] hover:text-[#1e7a9a] hover:underline">
                  Liste de souhaits
                </Link>
              </li>
            </ul>
          </section>
        </div>

        {/* Section recherche */}
        <div className="mt-16 p-8 bg-[#F4EAD8] rounded-lg">
          <h2 className="text-2xl font-serif text-secondary mb-4">
            Rechercher un bijou indien
          </h2>
          <p className="text-gray-700 mb-6">
            Découvrez nos collections de bijoux artisanaux indiens : bagues argent, bracelets pierre semi-précieuse, 
            colliers, boucles d'oreilles, pendentifs, chaînes cheville, pashminas et accessoires de mode en provenance d'Inde.
          </p>
          <Link
            href="/fr/shop"
            className="inline-block px-6 py-3 bg-[#2596be] text-white hover:bg-[#1e7a9a] transition-colors rounded"
          >
            Découvrir la boutique
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-serif text-secondary mb-4">
            Nous contacter
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>43, Rue du Raisin</p>
            <p>68700 CERNAY</p>
            <p>
              <a href="tel:+33629068595" className="text-[#2596be] hover:underline">
                +33 6.29.06.85.95
              </a>
            </p>
            <p>
              <Link href="/fr/contact" className="text-[#2596be] hover:underline">
                Formulaire de contact
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}





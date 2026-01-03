import type { Metadata } from 'next';
import { Link } from '@/navigation';

export const metadata: Metadata = {
  title: 'Plan du site - Khashika',
  description: 'Navigation complète du site Khashika',
};

export default function PlanDuSitePage() {
  return (
    <div className="min-h-screen bg-[#F4EAD8] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-serif text-4xl text-[#2D2926] mb-8">Plan du site</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Boutique */}
          <section>
            <h2 className="text-xl font-semibold text-[#2D2926] mb-4 border-b border-[#D4AF37] pb-2">
              Boutique
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-[#2596be] hover:underline">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/bijoux/bracelets" className="text-[#2596be] hover:underline">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/bijoux/colliers" className="text-[#2596be] hover:underline">
                  Colliers
                </Link>
              </li>
              <li>
                <Link href="/bijoux/bagues" className="text-[#2596be] hover:underline">
                  Bagues
                </Link>
              </li>
              <li>
                <Link href="/bijoux/boucles-oreilles" className="text-[#2596be] hover:underline">
                  Boucles d'oreilles
                </Link>
              </li>
              <li>
                <Link href="/accessoires/pashminas" className="text-[#2596be] hover:underline">
                  Pashminas
                </Link>
              </li>
            </ul>
          </section>

          {/* Compte */}
          <section>
            <h2 className="text-xl font-semibold text-[#2D2926] mb-4 border-b border-[#D4AF37] pb-2">
              Mon compte
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-[#2596be] hover:underline">
                  Connexion / Inscription
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-[#2596be] hover:underline">
                  Panier
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="text-[#2596be] hover:underline">
                  Commander
                </Link>
              </li>
            </ul>
          </section>

          {/* Légal */}
          <section>
            <h2 className="text-xl font-semibold text-[#2D2926] mb-4 border-b border-[#D4AF37] pb-2">
              Informations légales
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/cgv" className="text-[#2596be] hover:underline">
                  Conditions générales de vente
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}



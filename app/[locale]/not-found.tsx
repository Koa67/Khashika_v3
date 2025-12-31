import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Illustration ou texte stylé */}
        <h1 className="font-serif text-9xl font-bold text-gold-fusion mb-4">404</h1>
        <h2 className="font-serif text-2xl text-[#2D2926] mb-4">
          Page introuvable
        </h2>
        <p className="text-[#2D2926]/70 mb-8">
          Cette page n&apos;existe pas ou a été déplacée. 
          Découvrez nos collections à la place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/fr" 
            className="inline-flex items-center justify-center gap-2 bg-[#8B4E4E] text-white font-medium px-6 py-3 rounded-none hover:bg-[#6B3D3D] transition-colors"
          >
            <Home className="w-4 h-4" />
            Accueil
          </Link>
          <Link 
            href="/shop" 
            className="inline-flex items-center justify-center gap-2 bg-transparent border border-[#EAB615]/40 text-[#2D2926] font-medium px-6 py-3 rounded-none hover:bg-[#EAB615]/10 transition-colors"
          >
            <Search className="w-4 h-4" />
            Voir la boutique
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-[#EAB615]/20">
          <p className="text-sm text-[#2D2926]/60 mb-4">Peut-être cherchez-vous:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/shop?category=colliers" className="text-[#8B4E4E] hover:underline text-sm">Colliers</Link>
            <span className="text-[#2D2926]/30">•</span>
            <Link href="/shop?category=bracelets" className="text-[#8B4E4E] hover:underline text-sm">Bracelets</Link>
            <span className="text-[#2D2926]/30">•</span>
            <Link href="/shop?category=boucles" className="text-[#8B4E4E] hover:underline text-sm">Boucles d&apos;oreilles</Link>
          </div>
        </div>
      </div>
    </div>
  );
}



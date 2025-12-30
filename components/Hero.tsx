'use client';

import Image from 'next/image';
import { Link } from '@/navigation';
import { Truck, Lock, RefreshCw, Gem } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {/* Image Hero */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-khashika.png"
          alt="Khashika - Bijoux d'Inde"
          fill
          priority={true}
          className="object-cover"
          quality={90}
          sizes="100vw"
        />
        {/* Overlay sombre pour lisibilité du texte */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Contenu centré */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg">
            Khashika
          </h1>
          <p className="font-sans text-xl md:text-2xl lg:text-3xl text-white/90 mb-10 drop-shadow-md">
            Bijoux d&apos;Inde et ethniques, accessoires de mode.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#8B4E4E] text-white font-serif text-lg md:text-xl font-bold py-4 px-10 rounded-none hover:bg-[#6B3D3D] transition-colors duration-300 uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            DÉCOUVRIR LA COLLECTION
          </Link>
        </div>
      </div>

      {/* BANDEAU RÉASSURANCE - UNE SEULE LIGNE */}
      <div className="absolute bottom-0 left-0 right-0 z-20 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center gap-1 md:gap-2">
            
            <div className="flex items-center gap-2 px-3 md:px-6 py-3 bg-black/70 backdrop-blur-sm border border-[#F0C11D]/50">
              <Truck className="w-6 h-6 text-[#F0C11D] flex-shrink-0" />
              <span className="text-[14px] md:text-base text-white font-medium whitespace-nowrap">Livraison gratuite dès 50 €</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 md:px-6 py-3 bg-black/70 backdrop-blur-sm border border-[#F0C11D]/50">
              <Lock className="w-6 h-6 text-[#F0C11D] flex-shrink-0" />
              <span className="text-[14px] md:text-base text-white font-medium whitespace-nowrap">Paiement sécurisé</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 md:px-6 py-3 bg-black/70 backdrop-blur-sm border border-[#F0C11D]/50">
              <RefreshCw className="w-6 h-6 text-[#F0C11D] flex-shrink-0" />
              <span className="text-[14px] md:text-base text-white font-medium whitespace-nowrap">Retours 30j</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 md:px-6 py-3 bg-black/70 backdrop-blur-sm border border-[#F0C11D]/50">
              <Gem className="w-6 h-6 text-[#F0C11D] flex-shrink-0" />
              <span className="text-[14px] md:text-base text-white font-medium whitespace-nowrap">Fabrication artisanale</span>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}


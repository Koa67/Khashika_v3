'use client';

import Image from 'next/image';
import { Link } from '@/navigation';
import { Truck, Lock, RefreshCw, Gem, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Hero() {
  const [showChevron, setShowChevron] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setShowChevron(scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full">
      {/* Image Hero - affichée en entier */}
      <Image
        src="/images/hero-khashika-new.webp"
        alt="Khashika - Bijoux d'Inde"
        width={1920}
        height={1080}
        priority={true}
        fetchPriority="high"
        className="w-full h-auto"
        quality={90}
        sizes="100vw"
      />

      {/* Overlay sombre pour lisibilité du texte */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Contenu centré superposé */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
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

      {/* Chevron scroll indicator */}
      <button
        onClick={() => {
          const collectionSection = document.getElementById('notre-collection');
          if (collectionSection) {
            collectionSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-300 cursor-pointer ${
          showChevron ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-label="Voir la collection"
      >
        <ChevronDown
          className="w-8 h-8 text-white drop-shadow-lg animate-bounce hover:scale-125 transition-transform"
          strokeWidth={2}
        />
      </button>

      {/* INFOS PRATIQUES - Colonne à droite */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3">
        <div className="flex items-center gap-3 group bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg hover:bg-white/80 transition-all">
          <div className="w-9 h-9 rounded-full bg-[#8B4E4E]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Truck className="w-4 h-4 text-[#8B4E4E]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Livraison offerte</p>
            <p className="text-xs text-gray-700">Dès 50 € d&apos;achat</p>
          </div>
        </div>

        <div className="flex items-center gap-3 group bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg hover:bg-white/80 transition-all">
          <div className="w-9 h-9 rounded-full bg-[#8B4E4E]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Lock className="w-4 h-4 text-[#8B4E4E]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Paiement sécurisé</p>
            <p className="text-xs text-gray-700">CB, PayPal, Apple Pay</p>
          </div>
        </div>

        <div className="flex items-center gap-3 group bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg hover:bg-white/80 transition-all">
          <div className="w-9 h-9 rounded-full bg-[#8B4E4E]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <RefreshCw className="w-4 h-4 text-[#8B4E4E]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Retours faciles</p>
            <p className="text-xs text-gray-700">30 jours pour changer d&apos;avis</p>
          </div>
        </div>

        <div className="flex items-center gap-3 group bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg hover:bg-white/80 transition-all">
          <div className="w-9 h-9 rounded-full bg-[#8B4E4E]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Gem className="w-4 h-4 text-[#8B4E4E]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Fait main</p>
            <p className="text-xs text-gray-700">Artisanat indien authentique</p>
          </div>
        </div>
      </div>
    </section>
  );
}


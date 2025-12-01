'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {/* Image Hero */}
      <div className="absolute inset-0">
        <Image
          src="/images/image_4.png"
          alt="Khashika - Bijoux d'Inde et ethniques"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>

      {/* Overlay sombre pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent" />

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
            className="inline-block bg-[#2596be] text-white font-serif text-lg md:text-xl font-bold py-4 px-10 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-300 uppercase tracking-widest shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
          >
            DÉCOUVRIR LA COLLECTION
          </Link>
        </div>
      </div>
    </section>
  );
}


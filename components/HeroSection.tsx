'use client';

import { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    title: 'Collection Exclusive',
    subtitle: 'Découvrez nos bijoux artisanaux',
    image: '/placeholder-image.svg',
  },
  {
    id: 2,
    title: 'Nouveautés 2025',
    subtitle: 'Des créations uniques et raffinées',
    image: '/placeholder-image.svg',
  },
  {
    id: 3,
    title: 'Luxe Authentique',
    subtitle: 'L\'élégance à votre portée',
    image: '/placeholder-image.svg',
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-[600px] overflow-hidden bg-pattern">
      {/* Dégradé de fond */}
      <div className="absolute inset-0 bg-gradient-to-r from-turquoise-50 to-gold-50 opacity-95"></div>
      
      {/* Motif indien discret en overlay */}
      <div className="absolute inset-0 bg-[url('/patterns/indian-motif.svg')] opacity-5"></div>

      {/* Carrousel */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="container mx-auto px-4 h-full flex items-center justify-center">
              <div className="text-center relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold font-heading text-turquoise-700 mb-4 drop-shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
                  {slide.title}
                </h1>
                <p className="font-light text-xl md:text-2xl text-gray-600 mb-8 font-body">
                  {slide.subtitle}
                </p>
                <button
                  className="transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform focus:ring-2 focus:ring-primary/50 focus:outline-none bg-primary text-white font-body font-semibold py-3 px-8 rounded-lg"
                  aria-label="Découvrir nos collections"
                >
                  Découvrir
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Boutons de navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
          aria-label="Slide précédent"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
          aria-label="Slide suivant"
        >
          →
        </button>

        {/* Indicateurs */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


'use client';

import { useState, useEffect } from 'react';

export default function PromotionSection() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            if (prev.hours === 0) return prev;
            return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          }
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        return { ...prev, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 py-12 text-center animate-fade-in-down" style={{ animationDelay: '200ms' }}>
        <h2 className="text-2xl font-semibold font-heading text-gold-600 mb-4">
          Promotion du Mois
        </h2>
        <p className="text-lg font-sans text-gray-700 mb-8">
          Profitez de nos offres exceptionnelles
        </p>

        {/* Compteur */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px] border border-primary/20">
            <div className="font-heading text-3xl md:text-4xl font-medium text-primary">
              {formatTime(timeLeft.hours)}
            </div>
            <div className="font-body text-sm mt-1 text-gray-700">Heures</div>
          </div>
          <span className="font-heading text-3xl text-secondary">:</span>
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px] border border-primary/20">
            <div className="font-heading text-3xl md:text-4xl font-medium text-primary">
              {formatTime(timeLeft.minutes)}
            </div>
            <div className="font-body text-sm mt-1 text-gray-700">Minutes</div>
          </div>
          <span className="font-heading text-3xl text-secondary">:</span>
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px] border border-primary/20">
            <div className="font-heading text-3xl md:text-4xl font-medium text-primary">
              {formatTime(timeLeft.seconds)}
            </div>
            <div className="font-body text-sm mt-1 text-gray-700">Secondes</div>
          </div>
        </div>

        <p className="font-body text-sm mb-6 text-gray-600">
          Offre expire dans {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </p>

        <button
          className="transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform focus:ring-2 focus:ring-primary/50 focus:outline-none bg-primary text-white font-body font-semibold py-3 px-8 rounded-lg"
          aria-label="Voir les offres promotionnelles"
        >
          Voir les offres
        </button>
      </div>
    </section>
  );
}


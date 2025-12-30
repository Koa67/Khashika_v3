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
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white border border-[#F0C11D]/40 rounded-none shadow-lg p-8 py-12 text-center animate-fade-in-down" style={{ animationDelay: '200ms' }}>
        <h2 className="font-serif text-2xl font-semibold text-[#2D2420] mb-4">
          Promotion du Mois
        </h2>
        <p className="text-lg font-sans text-[#2D2420] mb-8">
          Profitez de nos offres exceptionnelles
        </p>

        {/* Compteur */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="bg-white rounded-none p-4 min-w-[80px] border border-[#F0C11D]/30">
            <div className="font-serif text-3xl md:text-4xl font-medium text-[#F0C11D]">
              {formatTime(timeLeft.hours)}
            </div>
            <div className="text-sm mt-1 text-[#2D2420]">Heures</div>
          </div>
          <span className="font-serif text-3xl text-[#F0C11D]">:</span>
          <div className="bg-white rounded-none p-4 min-w-[80px] border border-[#F0C11D]/30">
            <div className="font-serif text-3xl md:text-4xl font-medium text-[#F0C11D]">
              {formatTime(timeLeft.minutes)}
            </div>
            <div className="text-sm mt-1 text-[#2D2420]">Minutes</div>
          </div>
          <span className="font-serif text-3xl text-[#F0C11D]">:</span>
          <div className="bg-white rounded-none p-4 min-w-[80px] border border-[#F0C11D]/30">
            <div className="font-serif text-3xl md:text-4xl font-medium text-[#F0C11D]">
              {formatTime(timeLeft.seconds)}
            </div>
            <div className="text-sm mt-1 text-[#2D2420]">Secondes</div>
          </div>
        </div>

        <p className="text-sm mb-6 text-[#2D2420]">
          Offre expire dans {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </p>

        <button
          className="transition-all duration-300 hover:scale-[1.02] hover:shadow-md transform focus:ring-2 focus:ring-[#8B4E4E]/50 focus:outline-none bg-[#8B4E4E] text-white font-serif font-semibold py-3 px-8 rounded-none"
          aria-label="Voir les offres promotionnelles"
        >
          Voir les offres
        </button>
      </div>
    </section>
  );
}


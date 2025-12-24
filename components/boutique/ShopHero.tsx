'use client';

import { motion } from 'framer-motion';

interface ShopHeroProps {
  productCount: number;
}

export default function ShopHero({ productCount }: ShopHeroProps) {
  return (
    <section className="relative h-48 md:h-64 bg-gradient-to-r from-[#1a1a2e] to-[#2a2a4e] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,150,190,0.3),transparent_70%)]" />
      </div>
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-2"
          >
            Notre Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg"
          >
            Découvrez nos {productCount} trésors uniques
          </motion.p>
        </div>
      </div>
    </section>
  );
}


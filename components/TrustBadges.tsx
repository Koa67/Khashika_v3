import { Lock, Truck, Star } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200">
      {/* Badge Paiement Sécurisé */}
      <div className="flex items-center gap-2">
        <Lock className="w-5 h-5 text-[#8B4E4E]" />
        <span className="font-body text-sm text-gray-700">Paiement Sécurisé</span>
      </div>

      {/* Badge Livraison Gratuite */}
      <div className="flex items-center gap-2">
        <Truck className="w-5 h-5 text-[#8B4E4E]" />
        <span className="font-body text-sm text-gray-700">Livraison Gratuite</span>
      </div>

      {/* Badge Avis */}
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-gold-fusion fill-[#E8B71B]" />
        <span className="font-body text-sm text-gray-700">4.9/5 (128 avis)</span>
      </div>
    </div>
  );
}




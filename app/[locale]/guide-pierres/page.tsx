'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';

const stones = [
  { id: 'amethyste', name: 'Améthyste', image: '/images/pierres/amethyste.jpg', short: "Sagesse et sérénité", full: "Quartz violet aux reflets diaphanes, l'améthyste incarne la sagesse et l'humilité. Elle favorise l'élévation spirituelle, dissipe la colère, la peur et l'anxiété. Elle purifie l'atmosphère des lieux où elle se trouve.", signs: ['Sagittaire', 'Vierge', 'Poissons', 'Verseau', 'Capricorne'], slug: 'amethyste' },
  { id: 'apatite', name: 'Apatite', image: '/images/pierres/apatite.jpg', short: "Courage et motivation", full: "Pierre de l'inspiration et de la motivation, l'apatite donne du courage et facilite les contacts. Elle aide à surmonter la timidité et renforce la confiance en soi.", signs: ['Gémeaux', 'Balance', 'Sagittaire'], slug: 'apatite' },
  { id: 'aventurine', name: 'Aventurine', image: '/images/pierres/aventurine.jpg', short: "Calme intérieur", full: "Pierre d'une grande douceur, l'aventurine apaise les problèmes liés au cœur. Elle procure une tranquillité intérieure, dissout la mélancolie et renforce la maîtrise de soi.", signs: ['Cancer', 'Taureau', 'Balance'], slug: 'aventurine' },
  { id: 'citrine', name: 'Citrine', image: '/images/pierres/citrine.jpg', short: "Énergie solaire", full: "Pierre chaleureuse et énergisante, la citrine purifie les chakras sans nécessiter de nettoyage. Elle absorbe et transforme l'énergie négative, stimulant créativité et joie de vivre.", signs: ['Lion', 'Vierge', 'Balance', 'Scorpion', 'Gémeaux'], slug: 'citrine' },
  { id: 'chrysoprase', name: 'Chrysoprase', image: '/images/pierres/chrysoprase.jpg', short: "Apaisement du cœur", full: "Reconnue pour ses bienfaits sur le cœur, la chrysoprase apaise la colère et inspire la foi et la simplicité. Elle donne du courage aux timides et offre une protection contre les énergies négatives.", signs: ['Cancer', 'Balance'], slug: 'chrysoprase' },
  { id: 'corail', name: 'Corail', image: '/images/pierres/corail.jpg', short: "Vitalité et magnétisme", full: "Le corail rouge réunit les forces des règnes minéral, végétal et animal. Il concentre les énergies cosmiques, développe le magnétisme personnel et stimule la circulation sanguine.", signs: ['Vierge', 'Gémeaux', 'Lion', 'Cancer'], slug: 'corail' },
  { id: 'cornaline', name: 'Cornaline', image: '/images/pierres/cornaline.jpg', short: "Ancrage et vitalité", full: "Pierre d'ancrage par excellence, la cornaline restaure vitalité et motivation. Particulièrement bénéfique pour les femmes, elle dissipe l'apathie et remplace les émotions négatives par l'amour de la vie.", signs: ['Vierge', 'Taureau', 'Scorpion', 'Bélier'], slug: 'cornaline' },
  { id: 'emeraude', name: 'Émeraude', image: '/images/pierres/emeraude.jpg', short: "Renouveau et espoir", full: "Symbole d'espérance et de renouveau, l'émeraude représente l'intelligence universelle. Elle détient l'équilibre parfait de la force créatrice et favorise l'ouverture d'esprit.", signs: ['Taureau', 'Balance', 'Cancer', 'Lion', 'Scorpion'], slug: 'emeraude' },
  { id: 'grenat', name: 'Grenat', image: '/images/pierres/grenat.jpg', short: "Circulation et énergie", full: "D'un rouge profond comparable au vin, le grenat régule la circulation sanguine et la tension artérielle. Il soulage les insuffisances veineuses et réchauffe les extrémités froides.", signs: ['Scorpion', 'Bélier', 'Taureau'], slug: 'grenat' },
  { id: 'iolite', name: 'Iolite', image: '/images/pierres/iolite.jpg', short: "Intuition et clairvoyance", full: "Pierre fine d'une transparence remarquable, l'iolite favorise la méditation profonde. Elle éveille la clairvoyance, affine l'intuition et accompagne le voyage intérieur.", signs: ['Vierge', 'Poissons', 'Scorpion', 'Sagittaire'], slug: 'iolite' },
  { id: 'jade', name: 'Jade', image: '/images/pierres/jade.jpg', short: "Pureté et harmonie", full: "Riche en légendes et mystères, le jade incarne pureté et sérénité. Il favorise la méditation, procure paix et harmonie au corps et à l'esprit, et purifie les organes.", signs: ['Scorpion', 'Gémeaux'], slug: 'jade' },
  { id: 'labradorite', name: 'Labradorite', image: '/images/pierres/labradorite.jpg', short: "Bouclier protecteur", full: "Pierre de protection incontournable, la labradorite agit comme un bouclier. Elle absorbe les énergies négatives et les dissout, tout en amplifiant le charisme personnel.", signs: ['Sagittaire', 'Cancer', 'Poissons', 'Gémeaux'], slug: 'labradorite' },
  { id: 'lapis-lazuli', name: 'Lapis-lazuli', image: '/images/pierres/lapis-lazuli.jpg', short: "Confiance et expression", full: "Le lapis-lazuli restaure la confiance en soi et encourage à prendre le contrôle de sa vie. Il facilite l'expression des sentiments et favorise la communication authentique.", signs: ['Sagittaire', 'Verseau', 'Poissons'], slug: 'lapis-lazuli' },
  { id: 'malachite', name: 'Malachite', image: '/images/pierres/malachite.jpg', short: "Soin et sensibilité", full: "Anti-inflammatoire naturel, la malachite soulage entorses, rhumatismes et inflammations articulaires. Elle développe les capacités réceptives et affine la sensibilité émotionnelle.", signs: ['Taureau', 'Balance', 'Capricorne', 'Scorpion'], slug: 'malachite' },
  { id: 'oeil-du-tigre', name: 'Œil du tigre', image: '/images/pierres/oeil-du-tigre.jpg', short: "Protection et clarté", full: "Pierre protectrice par excellence, l'œil du tigre renvoie les énergies négatives vers leur émetteur. Il favorise la clarté d'intention, aide à atteindre ses objectifs et équilibre le yin et le yang.", signs: ['Gémeaux', 'Vierge', 'Lion'], slug: 'oeil-du-tigre' },
  { id: 'onyx', name: 'Onyx', image: '/images/pierres/onyx.jpg', short: "Ancrage et stabilité", full: "Pierre d'enracinement profond, l'onyx confère maîtrise de soi, sens des responsabilités et stabilité. Elle représente la sagesse, la quête de vérité et l'équilibre du yin et du yang.", signs: ['Lion', 'Capricorne', 'Sagittaire'], slug: 'onyx' },
  { id: 'peridot', name: 'Péridot', image: '/images/pierres/peridot.jpg', short: "Régénération vitale", full: "Pierre rare du renouveau, le péridot est énergisant, reconstituant et purificateur. Il insuffle vitalité au corps et à l'esprit, et facilite la digestion.", signs: ['Lion', 'Balance', 'Capricorne', 'Taureau'], slug: 'peridot' },
  { id: 'pierre-de-lune', name: 'Pierre de lune', image: '/images/pierres/pierre-de-lune.jpg', short: "Féminité et douceur", full: "Pierre de la féminité par excellence, elle régule les cycles menstruels et soutient la maternité. Elle contribue au bonheur conjugal et apporte poésie, douceur et sensibilité.", signs: ['Cancer', 'Poissons', 'Capricorne'], slug: 'pierre-de-lune' },
  { id: 'pyrite', name: 'Pyrite', image: '/images/pierres/pyrite.jpg', short: "Mental et mémoire", full: "Excellent bouclier énergétique, la pyrite favorise la diplomatie et stimule les facultés intellectuelles. Elle renforce la mémoire, consolide la confiance en soi et apaise l'anxiété.", signs: ['Bélier', 'Balance', 'Lion'], slug: 'pyrite' },
  { id: 'quartz-rose', name: 'Quartz rose', image: '/images/pierres/quartz-rose.jpg', short: "Amour inconditionnel", full: "Pierre de l'amour par excellence, le quartz rose favorise le bonheur conjugal et apporte douceur et tendresse. Il procure paix intérieure et calme absolu. Associé au chakra du cœur.", signs: ['Taureau', 'Cancer', 'Vierge', 'Capricorne', 'Balance'], slug: 'quartz-rose' },
  { id: 'topaze', name: 'Topaze', image: '/images/pierres/topaze.jpg', short: "Clarté mentale", full: "Disponible dans une large palette de couleurs, la topaze renforce l'intelligence et concentre l'énergie. Elle améliore la circulation sanguine, combat l'insomnie et apaise l'angoisse.", signs: ['Balance', 'Gémeaux'], slug: 'topaze' },
  { id: 'tourmaline', name: 'Tourmaline', image: '/images/pierres/tourmaline.jpg', short: "Protection universelle", full: "Existant dans une multitude de couleurs, la tourmaline offre une protection essentielle. Elle attire amitié, affection et bonne fortune, tout en clarifiant les pensées.", signs: ['Tous les signes'], slug: 'tourmaline' },
  { id: 'turquoise', name: 'Turquoise', image: '/images/pierres/turquoise.jpg', short: "Communication sacrée", full: "Pierre positive par excellence, la turquoise aide à discerner le bien du mal. Elle diffuse confiance, renforce l'amitié et purifie les fluides vitaux du corps.", signs: ['Verseau', 'Poissons', 'Gémeaux', 'Sagittaire', 'Balance', 'Scorpion'], slug: 'turquoise' },
];

function StoneCard({ stone }: { stone: typeof stones[0] }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/shop?q=${stone.name}`}
        className="block bg-[#FAF9F7] hover:bg-white border border-transparent hover:border-[#EAB615] transition-all"
      >
        <div className="relative aspect-square overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
          <Image
            src={stone.image}
            alt={stone.name}
            fill
            className="object-contain p-1"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />
        </div>
        <div className="p-2 text-center">
          <h3 className="text-xs font-semibold text-[#2D2926] truncate">{stone.name}</h3>
          <p className="text-[10px] text-[#2D2926]/60 mt-0.5">{stone.short}</p>
        </div>
      </Link>

      {/* Tooltip au survol */}
      {isHovered && (
        <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 w-64 bg-white border border-[#EAB615] shadow-lg p-3 pointer-events-none">
          <h4 className="text-sm font-bold text-[#2D2926] mb-1">{stone.name}</h4>
          <p className="text-xs text-[#2D2926]/80 leading-relaxed mb-2">{stone.full}</p>
          <div className="border-t border-[#EAB615]/20 pt-2">
            <p className="text-[10px] font-semibold text-[#2D2926]/50 uppercase mb-1">Signes associés</p>
            <div className="flex flex-wrap gap-1">
              {stone.signs.map((sign) => (
                <span key={sign} className="text-[9px] px-1.5 py-0.5 bg-[#EAB615]/10 text-[#2D2926]/70">{sign}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuidePierresPage() {
  return (
    <div className="bg-white">
      <div className="bg-[#FAF9F7] py-6 text-center border-b border-[#EAB615]/20">
        <h1 className="text-2xl font-bold text-[#2D2926]">Guide des Pierres</h1>
        <p className="text-xs text-[#2D2926]/60 mt-1">Survolez pour découvrir les vertus</p>
      </div>

      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {stones.map((stone) => (
            <StoneCard key={stone.id} stone={stone} />
          ))}
        </div>
      </div>
    </div>
  );
}

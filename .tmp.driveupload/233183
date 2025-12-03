import Image from 'next/image';
import Link from 'next/link';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#f4f1eb] py-12 px-4 mt-24">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-serif text-[#1a1a1a] mb-6">
            Notre Histoire
          </h1>
          <p className="text-xl md:text-2xl font-sans text-[#1a1a1a]/70 max-w-3xl mx-auto leading-relaxed">
            Depuis 1924, Khashika perpétue l'art ancestral de la joaillerie indienne,
            créant des bijoux uniques qui racontent une histoire millénaire.
          </p>
        </div>

        {/* Layout Alterné - Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-[#2596be] mb-6">
              L'Artisanat Indien
            </h2>
            <div className="space-y-4 font-sans text-lg text-[#1a1a1a]/70 leading-relaxed">
              <p>
                Chaque bijou Khashika est le fruit d'un savoir-faire transmis de génération en génération.
                Nos artisans, basés dans les ateliers traditionnels du Rajasthan, travaillent l'argent massif
                avec des techniques séculaires : Kundan, Meenakari, et filigrane.
              </p>
              <p>
                Ces techniques, vieilles de plusieurs siècles, permettent de créer des pièces d'une finesse
                exceptionnelle, où chaque détail compte et où la main de l'artisan se ressent dans chaque courbe.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"
              alt="Atelier de joaillerie indienne"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Citation */}
        <div className="text-center my-24 py-12 border-y border-[#D4AF37]/30">
          <blockquote className="text-3xl md:text-4xl font-serif italic text-[#D4AF37] max-w-4xl mx-auto leading-relaxed">
            "Un bijou n'est pas seulement un objet, c'est une émotion portée, une histoire racontée,
            un héritage préservé."
          </blockquote>
          <p className="mt-6 font-sans text-sm text-[#1a1a1a]/60 uppercase tracking-wider">
            — Maître Artisan Khashika
          </p>
        </div>

        {/* Layout Alterné - Section 2 (Inversé) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80"
              alt="Bijoux indiens traditionnels"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2596be] mb-6">
              Les Pierres Précieuses
            </h2>
            <div className="space-y-4 font-sans text-lg text-[#1a1a1a]/70 leading-relaxed">
              <p>
                Nous sélectionnons nos pierres avec le plus grand soin : turquoise, améthyste, saphir,
                rubis, labradorite, pierre de lune... Chaque pierre est choisie pour sa beauté naturelle
                et sa signification symbolique dans la culture indienne.
              </p>
              <p>
                Les pierres sont montées à la main, selon les techniques traditionnelles, pour créer
                des bijoux qui ne se démodent jamais et qui portent en eux la magie de l'Inde.
              </p>
            </div>
          </div>
        </div>

        {/* Image Pleine Largeur */}
        <div className="relative aspect-[21/9] rounded-lg overflow-hidden mb-24">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=80"
            alt="Culture indienne et joaillerie"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Layout Alterné - Section 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-[#2596be] mb-6">
              L'Inde et la Culture
            </h2>
            <div className="space-y-4 font-sans text-lg text-[#1a1a1a]/70 leading-relaxed">
              <p>
                Khashika puise son inspiration dans la richesse culturelle de l'Inde. Chaque motif,
                chaque forme, chaque couleur raconte une histoire : celle des temples, des festivals,
                des traditions ancestrales.
              </p>
              <p>
                Nos bijoux sont plus que des accessoires : ce sont des ponts entre deux cultures,
                des témoignages de beauté intemporelle, des créations qui honorent l'héritage
                de l'artisanat indien tout en s'inscrivant dans la modernité.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/5] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80"
              alt="Temple indien et architecture"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Citation Finale */}
        <div className="text-center my-24 py-12">
          <p className="text-2xl md:text-3xl font-serif text-[#1a1a1a] max-w-3xl mx-auto leading-relaxed mb-8">
            Rejoignez-nous dans cette aventure où tradition et modernité se rencontrent,
            où chaque bijou devient une pièce unique de votre histoire.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#2596be] text-white font-sans font-semibold py-4 px-8 rounded transition-all hover:bg-[#2596be]/90 hover:scale-105"
          >
            Découvrir nos collections
          </Link>
        </div>
      </div>
    </div>
  );
}

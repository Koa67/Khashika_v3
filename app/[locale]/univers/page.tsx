import { Metadata } from 'next';
import Image from 'next/image';
import { Link } from '@/navigation';

export const metadata: Metadata = {
  title: 'Notre Univers | Khashika',
  description: "L'univers Khashika : culture du bijou indien et traditions artisanales.",
};

export default function UniversPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#2D2926] text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#EAB615] text-sm uppercase tracking-widest mb-2">Bienvenue dans</p>
          <h1 className="text-2xl font-bold mb-2">L&apos;Univers Khashika</h1>
          <p className="text-sm text-white/80 max-w-xl mx-auto">
            L&apos;Inde, ses traditions millénaires et l&apos;art du bijou indien.
            Une passion née d&apos;un voyage, devenue une aventure.
          </p>
        </div>
      </section>

      {/* Section 1: Culture du bijou */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid md:grid-cols-[1fr,200px] gap-6 items-start">
            <div>
              <h2 className="text-base font-bold text-[#2D2926] mb-4">Le bijou indien, un art ancestral</h2>
              <div className="space-y-4 text-sm text-[#2D2926]/85 leading-relaxed">
                <p>
                  Les Indiens sont reconnus dans le monde entier pour leurs créations hors du commun
                  dans le domaine de la joaillerie. Ils attachent une importance aux bijoux comparable
                  à aucun autre pays au monde.
                </p>
                <p>
                  C&apos;est pourquoi ils en ont créé pour quasiment toutes les parties du corps :
                  bracelets se portant par dizaines, bijoux de chevilles, bagues, colliers,
                  anneaux pour le nez, diadèmes pour les fêtes importantes...
                </p>
                <p>
                  Les jeunes filles indiennes ne conçoivent pas la vie sans bijoux. Avec l&apos;or,
                  les femmes indiennes considèrent l&apos;argent comme un métal de bon augure.
                  La bijouterie est un art à part entière.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full bg-[#FAF9F7]">
              <Image
                src="/images/univers/bijoux-inde-culture.jpg"
                alt="Culture du bijou indien"
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Pierres et signification */}
      <section className="py-10 bg-[#FAF9F7]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid md:grid-cols-[200px,1fr] gap-6 items-start">
            <div className="relative aspect-[4/3] w-full bg-white">
              <Image
                src="/images/univers/bijoux-indiens-pierre-metal.jpg"
                alt="Pierres et métaux indiens"
                fill
                className="object-contain"
                sizes="200px"
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#2D2926] mb-4">Pierres précieuses et significations</h2>
              <div className="space-y-4 text-sm text-[#2D2926]/85 leading-relaxed">
                <p>
                  L&apos;Inde est un pays particulièrement riche en pierres précieuses et semi-précieuses.
                  Elles sont appréciées pour leurs atouts esthétiques autant que pour leurs vertus thérapeutiques.
                </p>
                <p>
                  Selon l&apos;astrologie hindoue, chacune des neuf planètes de l&apos;univers est représentée
                  par une pierre spécifique. Chaque Indien connaît la planète dominante à l&apos;heure
                  et date de sa naissance, car elle est censée exercer une forte influence sur sa vie.
                </p>
                <p>
                  Dès les temps les plus anciens, les gemmes ont été perçues comme des signes divins
                  et le bijou indien leur relais.
                </p>
              </div>
              <Link href="/guide-pierres" className="inline-flex items-center mt-4 text-sm text-[#EAB615] font-medium hover:underline">
                Découvrir notre guide des pierres →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Savoir-faire */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-6 text-center">Savoir-faire artisanal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Minakari */}
            <div className="bg-[#FAF9F7] p-4 border border-[#EAB615]/20">
              <div className="relative aspect-square w-24 mx-auto mb-3 bg-white">
                <Image src="/images/univers/minakari.jpg" alt="Technique Minakari" fill className="object-contain" sizes="96px" />
              </div>
              <h3 className="text-sm font-bold text-[#2D2926] text-center">Minakari</h3>
              <p className="text-xs text-[#2D2926]/70 text-center mt-2 leading-relaxed">
                Méthode d&apos;émaillage traditionnelle populaire au Rajasthan.
                Les artisans appliquent des émaux colorés sur le métal pour créer
                des motifs d&apos;une beauté éclatante.
              </p>
            </div>

            {/* Kundan */}
            <div className="bg-[#FAF9F7] p-4 border border-[#EAB615]/20">
              <div className="aspect-square w-24 mx-auto mb-3 bg-white flex items-center justify-center text-4xl">💎</div>
              <h3 className="text-sm font-bold text-[#2D2926] text-center">Kundan</h3>
              <p className="text-xs text-[#2D2926]/70 text-center mt-2 leading-relaxed">
                Joaillerie traditionnelle de Delhi consistant à insérer une feuille d&apos;or
                entre chaque pierre et la monture. C&apos;est la plus ancienne méthode
                de joaillerie indienne.
              </p>
            </div>

            {/* Filigrane */}
            <div className="bg-[#FAF9F7] p-4 border border-[#EAB615]/20">
              <div className="aspect-square w-24 mx-auto mb-3 bg-white flex items-center justify-center text-4xl">✨</div>
              <h3 className="text-sm font-bold text-[#2D2926] text-center">Filigrane d&apos;Orissa</h3>
              <p className="text-xs text-[#2D2926]/70 text-center mt-2 leading-relaxed">
                Les États d&apos;Orissa et de l&apos;Andhra Pradesh sont célèbres pour leur
                travail fin des bijoux en argent, un filigrane délicat transmis
                de génération en génération.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Notre histoire (teaser) */}
      <section className="py-10 bg-[#2D2926] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#EAB615] text-sm uppercase tracking-widest mb-2">Namasté</p>
          <h2 className="text-base font-bold mb-4">Notre histoire</h2>
          <p className="text-sm text-white/80 mb-4">
            Née d&apos;un voyage en Inde en 2013, Khashika est une aventure passionnée.
            Chaque bijou est unique, sélectionné avec amour.
          </p>
          <Link href="/notre-histoire" className="inline-flex items-center text-sm text-[#EAB615] font-medium hover:underline">
            Lire notre histoire complète →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-4">Découvrez nos créations</h2>
          <p className="text-sm text-[#2D2926]/70 mb-6">
            Des bijoux de qualité, des créations authentiques et des pierres naturelles
            qui rendent chaque pièce unique et chargée de signification.
          </p>
          <Link href="/shop" className="inline-flex items-center justify-center px-6 py-2.5 bg-[#2D2926] text-white text-sm font-medium hover:bg-[#2D2926]/90 transition-colors">
            Entrer dans la boutique
          </Link>
        </div>
      </section>
    </div>
  );
}

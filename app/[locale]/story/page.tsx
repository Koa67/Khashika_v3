import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "L&apos;Esprit Khashika - Notre Histoire",
  description: 'Découvrez l&apos;histoire de Khashika, joaillerie indienne d&apos;exception depuis 1924. Artisanat traditionnel, techniques Kundan et Meenakari.',
};

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl text-[#2D2420] mb-6">
            L&apos;Esprit Khashika
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une tradition de joaillerie indienne depuis 1924
          </p>
        </div>

        {/* Layout magazine avec typographie Arimo - Style éditorial */}
        <article className="prose prose-lg max-w-none font-serif">
          {/* Section 1 */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[#2D2420] mb-6">
              Notre Héritage
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Depuis 1924, Khashika perpétue l&apos;art ancestral de la joaillerie indienne. 
                Chaque pièce que nous créons porte en elle l&apos;âme de traditions millénaires, 
                transmises de génération en génération.
              </p>
              <p>
                Nos artisans, héritiers de techniques séculaires comme le Kundan et le Meenakari, 
                façonnent chaque bijou avec une passion qui transcende le temps. L&apos;argent massif, 
                matière noble par excellence, devient sous leurs mains expertes une œuvre d&apos;art unique.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[#2D2420] mb-6">
              L&apos;Art du Kundan
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Le Kundan, technique emblématique de la joaillerie moghole, consiste à sertir 
                des pierres précieuses dans de l&apos;or pur. Chez Khashika, nous adaptons cette 
                technique ancestrale à l&apos;argent massif, créant des pièces d&apos;une élégance intemporelle.
              </p>
              <p>
                Chaque pierre est choisie avec soin : turquoise, lapis-lazuli, cornaline, 
                autant de gemmes qui racontent une histoire, celle de l&apos;Inde éternelle.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[#2D2420] mb-6">
              Le Meenakari : L&apos;Art de l&apos;Émail
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Le Meenakari, art de l&apos;émaillage sur métal, apporte à nos créations une palette 
                de couleurs vibrantes. Les motifs floraux et géométriques, inspirés de l&apos;art 
                moghol et rajasthani, ornent nos bijoux d&apos;une beauté incomparable.
              </p>
              <p>
                Chaque couleur est appliquée à la main, chaque motif dessiné avec précision, 
                faisant de chaque pièce une œuvre unique, témoin d&apos;un savoir-faire exceptionnel.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-[#2D2420] mb-6">
              Notre Engagement
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Chez Khashika, nous croyons en un commerce équitable et durable. Nos artisans 
                sont rémunérés justement, et nous nous engageons à préserver les techniques 
                traditionnelles tout en innovant pour répondre aux attentes contemporaines.
              </p>
              <p>
                Chaque bijou que vous portez raconte une histoire : celle de l&apos;Inde, de ses 
                traditions, de ses artisans, et maintenant, la vôtre.
              </p>
            </div>
          </section>

          {/* Call to action */}
          <div className="bg-[#FAF9F7] border border-[#F0C11D]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.25)] p-8 text-center">
            <h3 className="font-serif text-2xl text-[#2D2420] mb-4">
              Découvrez Nos Créations
            </h3>
            <p className="text-[#2D2420]/70 mb-6">
              Explorez notre collection de bijoux artisanaux, chacun porteur d&apos;une histoire unique.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#8B4E4E] text-white px-8 py-3 rounded-none font-medium hover:bg-[#6B3D3D] transition-colors"
            >
              Voir la Collection
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

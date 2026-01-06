import { Metadata } from 'next';
import { Link } from '@/navigation';

export const metadata: Metadata = {
  title: 'Notre Histoire | Khashika',
  description: "Découvrez l'histoire de Khashika, née d'une passion pour l'Inde et ses bijoux artisanaux.",
};

export default function NotreHistoirePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#2D2926] text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#EAB615] text-sm uppercase tracking-widest mb-2">Namasté</p>
          <h1 className="text-2xl font-bold mb-2">Notre Histoire</h1>
          <p className="text-sm text-white/80">
            Une passion pour l&apos;Inde et ses bijoux artisanaux
          </p>
        </div>
      </section>

      {/* Mon parcours */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-4">Mon parcours</h2>
          <div className="space-y-4 text-sm text-[#2D2926]/85 leading-relaxed">
            <p>
              J&apos;ai eu la chance de voyager dans de nombreux pays : la Namibie, l&apos;Australie, 
              la Nouvelle-Zélande, le Costa Rica, la Birmanie, la Thaïlande, la Grèce, 
              la Turquie, la Chine, Flores, Bali et bien d&apos;autres encore.
            </p>
            
            <p>
              En octobre 2013, pour la première fois, je suis partie en Inde avec mon mari. 
              Nous avons sillonné le Rajasthan avec Mintu, notre chauffeur devenu rapidement 
              un ami avec qui nous gardons contact. Nous avons ensuite eu la chance de passer 
              quelques jours dans les montagnes de Darjeeling, face à la majestueuse chaîne de l&apos;Himalaya.
            </p>
            
            <p className="text-[#2D2926] font-medium text-base border-l-2 border-[#EAB615] pl-4">
              Pour moi, l&apos;Asie est le continent le plus marquant. Mais l&apos;Inde a été une véritable 
              révélation : un monde à part, une civilisation singulière, des gens d&apos;une gentillesse rare. 
              Je suis tombée amoureuse de ce pays, et c&apos;est ainsi qu&apos;est née l&apos;envie de créer Khashika.
            </p>
          </div>
        </div>
      </section>

      {/* Naissance de Khashika */}
      <section className="py-10 bg-[#FAF9F7]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-4">La naissance de Khashika</h2>
          <div className="space-y-4 text-sm text-[#2D2926]/85 leading-relaxed">
            <p>
              Après 44 années de vie salariée, j&apos;ai cessé mon activité en mai 2013. 
              Avoir ma propre boutique a toujours été un rêve d&apos;enfant. Aujourd&apos;hui, 
              je peux enfin m&apos;y consacrer pleinement et partager avec mes clients mes trouvailles indiennes.
            </p>
            
            <p>
              Mes premiers achats en Inde, lors de ce voyage d&apos;octobre, ont été un pur bonheur. 
              Les Indiens ont un rapport au temps et à la négociation très différent du nôtre. 
              Ils sont toujours souriants, aimables et d&apos;une disponibilité remarquable.
            </p>
          </div>
        </div>
      </section>

      {/* Bijoux uniques */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-4">Des bijoux uniques</h2>
          <div className="space-y-4 text-sm text-[#2D2926]/85 leading-relaxed">
            <p>
              La plupart de mes bijoux sont en argent et ornés de pierres semi-précieuses. 
              Vous trouverez également quelques pièces fantaisie. Chaque bijou est unique 
              et fabriqué artisanalement — vous ne trouverez quasiment jamais deux pièces 
              identiques sur mon site.
            </p>
            
            <p>
              Dans les boutiques indiennes, il faut avoir l&apos;œil pour dénicher la perle rare. 
              C&apos;est pourquoi je retourne régulièrement en Inde, à la recherche des plus belles 
              pièces et pour entretenir le lien avec mes fournisseurs.
            </p>
          </div>
        </div>
      </section>

      {/* Section poétique */}
      <section className="py-10 bg-[#FAF9F7]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-4">Un pays qui fait rêver</h2>
          <div className="space-y-4 text-sm text-[#2D2926]/85 leading-relaxed">
            <p className="italic">
              L&apos;Inde continue de m&apos;émerveiller. Toute la vie se déroule dans la rue : 
              une population attachante, les couleurs éclatantes des saris, le ballet incessant 
              des klaxons où se croisent limousines et rickshaws, chariots surchargés et triporteurs 
              slalomant entre les vaches sacrées. Les odeurs enivrantes de fleurs et d&apos;encens, 
              parfois mêlées à celles moins nobles de la rue... Toutes ces images restent gravées. 
              J&apos;y ai rencontré des gens extraordinaires.
            </p>
          </div>
        </div>
      </section>

      {/* L'Inde */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-4">L&apos;Inde, un pays unique</h2>
          <div className="space-y-4 text-sm text-[#2D2926]/85 leading-relaxed">
            <p>
              L&apos;Inde est l&apos;un des plus grands pays du monde par sa superficie et le deuxième 
              plus peuplé, avec plus d&apos;un milliard d&apos;habitants. C&apos;est une terre d&apos;une diversité 
              extrême : géographique, climatique, culturelle, linguistique et ethnique.
            </p>
            <p>
              Peu de pays au monde voient coexister autant de personnes d&apos;origines, de croyances 
              et de langues différentes. Cette richesse se traduit par une multitude de fêtes 
              et de traditions célébrées dans chaque région.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-[#2D2926] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold mb-4">Découvrez nos créations</h2>
          <p className="text-sm text-white/80 mb-6">
            Découvrez notre sélection de bijoux indiens authentiques,
            choisis avec passion lors de nos voyages.
          </p>
          <Link href="/shop" className="inline-flex items-center justify-center px-6 py-2.5 bg-[#EAB615] text-[#2D2926] text-sm font-medium hover:bg-[#EAB615]/90 transition-colors">
            Entrer dans la boutique
          </Link>
        </div>
      </section>
    </div>
  );
}

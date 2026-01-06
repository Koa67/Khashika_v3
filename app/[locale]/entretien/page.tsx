import type { Metadata } from 'next';
import { Link } from '@/navigation';

export const metadata: Metadata = {
  title: 'Entretien bijoux argent et pierre | Khashika',
  description: 'Conseils pour entretenir vos bijoux en argent et pierres semi-précieuses.',
};

export default function EntretienPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#2D2926] text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-[#EAB615] text-sm uppercase tracking-widest mb-2">Conseils</p>
          <h1 className="text-2xl font-bold mb-2">Entretien de vos bijoux</h1>
          <p className="text-sm text-white/80">
            Les conseils de Khashika pour préserver l&apos;éclat de vos bijoux en argent et pierres
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-4">Comment entretenir vos bijoux en argent ?</h2>
          <div className="space-y-4 text-sm text-[#2D2926]/85 leading-relaxed">
            <p>
              Il existe divers procédés pour nettoyer et raviver la brillance d&apos;un bijou en argent terni.
            </p>
            <p>
              Pour l&apos;entretien de vos bijoux en argent, nettoyez simplement avec une <strong>brosse à dent souple et douce</strong> pour ne pas abîmer le métal et un peu d&apos;eau savonneuse ou du jus de citron. Le jus de citron lui rendra sa vraie valeur.
            </p>
            <p>
              Rincez doucement à l&apos;eau tiède puis frottez légèrement avec un <strong>chiffon spécial entretien argent</strong> ou une peau de chamois que vous trouverez en droguerie. Cela fonctionne également avec du dentifrice.
            </p>
            <p>
              Pour vos bijoux en argent avec des pierres précieuses ou semi-précieuses, nettoyez-les dans une eau savonneuse : cela leur permet de conserver tout leur éclat. Pour finir, essuyez-les avec un chiffon doux.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#FAF9F7]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-6">Les conseils de Khashika</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 border border-[#EAB615]/20 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#8B4E4E] text-white flex items-center justify-center font-semibold text-sm rounded">1</span>
                <p className="text-sm text-[#2D2926]/85 leading-relaxed">
                  Un bijou en argent ne s&apos;abîmera pas car l&apos;argent est un métal qui ne s&apos;altère pas. Il restera toujours beau.
                </p>
              </div>
            </div>
            <div className="bg-white p-4 border border-[#EAB615]/20 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#8B4E4E] text-white flex items-center justify-center font-semibold text-sm rounded">2</span>
                <p className="text-sm text-[#2D2926]/85 leading-relaxed">
                  Ne jamais mettre vos bijoux en argent en contact avec vos autres bijoux et surtout <strong>ranger vos bijoux à l&apos;abri de la lumière</strong>.
                </p>
              </div>
            </div>
            <div className="bg-white p-4 border border-[#EAB615]/20 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#8B4E4E] text-white flex items-center justify-center font-semibold text-sm rounded">3</span>
                <p className="text-sm text-[#2D2926]/85 leading-relaxed">
                  Il est vivement conseillé d&apos;<strong>enlever vos bijoux en argent</strong> pour faire le ménage, la lessive, la vaisselle ou le sport.
                </p>
              </div>
            </div>
            <div className="bg-white p-4 border border-[#EAB615]/20 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-[#8B4E4E] text-white flex items-center justify-center font-semibold text-sm rounded">4</span>
                <p className="text-sm text-[#2D2926]/85 leading-relaxed">
                  <strong>Quittez vos bijoux pour dormir.</strong> Évitez de mettre du parfum directement sur vos bijoux.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-[#FAF9F7] rounded-lg p-6 border-l-4 border-[#EAB615]">
            <h3 className="text-sm font-bold text-[#2D2926] mb-3">Astuce pour les nœuds</h3>
            <p className="text-sm text-[#2D2926]/85 leading-relaxed">
              Un nœud dans vos chaînes, bracelets ou chevillières en argent ? Placez-les au creux de votre main, enduisez-les d&apos;huile alimentaire et frottez doucement. <strong>Le nœud se défera tout seul.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-[#FAF9F7]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold text-[#2D2926] mb-4">À noter : le laiton</h2>
          <p className="text-sm text-[#2D2926]/85 leading-relaxed">
            Le laiton, c&apos;est comme l&apos;argent ! Avec le temps, il se ternit et prend une couleur mordorée. Le laiton est l&apos;un des métaux les plus esthétiques. Comme l&apos;argent, si vous ne portez pas souvent vos bijoux en laiton, ils s&apos;oxydent.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 bg-[#2D2926] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-base font-bold mb-4">Découvrez notre collection</h2>
          <p className="text-sm text-white/80 mb-6">
            Des bijoux artisanaux en argent et pierres semi-précieuses
          </p>
          <Link href="/shop" className="inline-flex items-center justify-center px-6 py-2.5 bg-[#EAB615] text-[#2D2926] text-sm font-medium hover:bg-[#EAB615]/90 transition-colors">
            Voir la boutique
          </Link>
        </div>
      </section>
    </div>
  );
}

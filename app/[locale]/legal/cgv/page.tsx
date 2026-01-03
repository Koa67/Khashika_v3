import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente - Khashika',
  description: 'CGV de la boutique Khashika',
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-[#F4EAD8] pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-serif text-4xl text-[#2D2926] mb-8">
          Conditions Générales de Vente
        </h1>
        
        <div className="prose prose-lg max-w-none text-[#2D2926]">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 1 - Objet</h2>
            <p>
              Les présentes conditions générales de vente régissent les relations 
              contractuelles entre Khashika et ses clients dans le cadre de la vente 
              de bijoux et accessoires sur le site khashika.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 2 - Prix</h2>
            <p>
              Les prix sont indiqués en euros TTC. Khashika se réserve le droit de 
              modifier ses prix à tout moment. Les produits sont facturés sur la base 
              des tarifs en vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 3 - Commande</h2>
            <p>
              Toute commande implique l'acceptation des présentes CGV. La validation 
              de la commande vaut acceptation des prix et description des produits.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 4 - Livraison</h2>
            <p>
              Les livraisons sont effectuées en France métropolitaine. Les délais de 
              livraison sont donnés à titre indicatif.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 5 - Retours</h2>
            <p>
              Conformément à la législation en vigueur, vous disposez d'un délai de 
              14 jours à compter de la réception de votre commande pour exercer votre 
              droit de rétractation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Article 6 - Contact</h2>
            <p>
              Pour toute question, contactez-nous à : evelyne.stutz@khashika.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

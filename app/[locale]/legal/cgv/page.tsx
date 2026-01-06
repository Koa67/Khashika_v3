import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CGV et Mentions Légales | Khashika',
  description: 'Conditions générales de vente et mentions légales de la boutique Khashika - Bijoux indiens artisanaux',
};

export default function CGVPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif text-secondary mb-8">
          Conditions générales de vente et mentions légales
        </h1>

        <div className="prose prose-lg max-w-none space-y-8">
          {/* Date */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Conditions applicables
            </h2>
            <p>
              Les présentes Conditions Générales de Vente régissent exclusivement les ventes sur le site internet{' '}
              <a href="https://www.khashika.com" className="text-[#2596be] hover:underline">
                www.khashika.com
              </a>
              . Toute commande implique la consultation préalable et l'acceptation des présentes Conditions Générales de Vente, qui sont accessibles à tout moment sur le présent site.
            </p>
            <p className="mt-4">
              <strong>Articles 1123 et suivants du Code Civil</strong>
              <br />
              Les personnes considérées juridiquement incapables de contracter, notamment les enfants mineurs non émancipés, devront obligatoirement demander l'autorisation de leur représentant légal avant de passer toute commande sur le site.
            </p>
          </section>

          {/* Authenticité */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Authenticité de nos bijoux
            </h2>
            <p>
              Tous les articles vendus sur le site sont neufs, fabriqués artisanalement dans différentes régions de l'Inde.
            </p>
          </section>

          {/* Comment acheter */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Comment acheter ?
            </h2>
            <p>
              Il suffit de sélectionner les articles de votre choix, de les placer ensuite dans votre panier en cliquant sur le bouton « Ajouter à mon panier ».
            </p>
            <p className="mt-4">
              Vous avez la possibilité d'accéder au contenu récapitulatif de votre panier à tout moment, tant que la commande n'est pas définitivement validée, de manière à pouvoir la modifier en cas d'erreurs dans la saisie des données. La commande sera enregistrée après confirmation de l'exactitude des renseignements fournis. Une fois que vous aurez cliqué sur le bouton « Valider ma commande », votre commande deviendra définitive.
            </p>
            <p className="mt-4">
              Seuls les produits disponibles peuvent être commandés. KHASHIKA s'engage à traiter votre commande rapidement.
            </p>
            <p className="mt-4">
              La confirmation de la commande entraîne acceptation des présentes conditions de vente, la reconnaissance d'en avoir parfaite connaissance et la renonciation à se prévaloir de ses propres conditions d'achat ou d'autres conditions.
            </p>
          </section>

          {/* Tarification */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              La tarification
            </h2>
            <p>
              Étant auto-entrepreneur, la TVA est non applicable (
              <a 
                href="http://www.legifrance.gouv.fr/affichCodeArticle.do?cidTexte=LEGITEXT000006069577&idArticle=LEGIARTI000021645089"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2596be] hover:underline"
              >
                art.293-B du CGI
              </a>
              ). Les tarifs indiqués sur le site sont donc hors taxe. La participation forfaitaire aux frais d'envoi et de traitement de la commande est offerte à partir de 50 euros d'achat.
            </p>
          </section>

          {/* Paiement */}
          <section id="ancrepaiement">
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Paiement
            </h2>
            <p>Le paiement s'effectue :</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>
                <strong>En ligne</strong>, au moment de la commande, par virement bancaire, par Paypal et carte bancaire.
                Vous ouvrez un{' '}
                <a 
                  href="https://www.paypal.com/fr/webapps/mpp/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2596be] hover:underline"
                >
                  compte PayPal
                </a>{' '}
                gratuitement, et faites vos achats en toute sécurité : votre email et mot de passe PayPal suffisent. Vos informations financières seront sécurisées.
              </li>
              <li>
                <strong>Par chèque bancaire</strong> à l'ordre de Evelyne STUTZ, 43, rue du raisin 68700 CERNAY.
                En cas de paiement par chèque, la commande sera traitée le jour même, mais l'envoi se fera uniquement après confirmation définitive par la banque du paiement, soit dans un délai de 8 à 10 jours.
              </li>
            </ul>
            <p className="mt-4">
              Seules seront honorées les commandes dont la transaction aura reçu l'autorisation de la Banque.
            </p>
            <p className="mt-4">
              Les produits demeurent la propriété de KHASHIKA jusqu'au paiement intégral de la facture.
            </p>
          </section>

          {/* Livraison */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Conditions de livraison
            </h2>
            <p>
              Les expéditions sont faites à l'adresse indiquée dans le bon de commande dans les trois jours ouvrés qui suivent la réception de la commande (sauf pour les paiements par chèque, voir les conditions ci-dessus).
            </p>
            <p className="mt-4">
              Les risques sont à la charge de l'acquéreur à compter du moment où les produits ont quitté KHASHIKA.
            </p>
            <p className="mt-4">
              En cas de dommage pendant le transport, la protestation motivée doit être formulée auprès du transporteur dans un délai de trois jours à compter de la livraison.
            </p>
            <p className="mt-4">
              Les délais de livraison ne sont donnés qu'à titre indicatif ; KHASHIKA ne sera pas responsable des éventuels retards survenus dans la livraison, dus au transporteur (grèves, forces majeures…).
            </p>
            <p className="mt-4">
              KHASHIKA n'est pas responsable de la perte éventuelle d'un colis. La responsabilité est celle du transporteur (La Poste).
            </p>

            <h3 className="text-xl font-serif text-secondary mt-6 mb-3">
              Vérification du colis
            </h3>
            <p>
              Vérifiez soigneusement l'état et le contenu du colis à sa réception.
              En cas de problème, merci de nous contacter au 06 29 06 85 95 ou par mail{' '}
              <a href="mailto:evelyne.stutz@khashika.com" className="text-[#2596be] hover:underline">
                evelyne.stutz@khashika.com
              </a>
              , pour un traitement rapide de votre réclamation.
            </p>
            <p className="mt-4">
              Une demande d'autorisation préalable est à faire auprès de KHASHIKA. Les marchandises devront être retournées à :
            </p>
            <p className="mt-2 font-semibold">
              Evelyne STUTZ<br />
              43, rue du Raisin<br />
              68700 CERNAY
            </p>

            <h3 className="text-xl font-serif text-secondary mt-6 mb-3">
              Droit de rétractation
            </h3>
            <p>
              Les acheteurs bénéficient d'un délai de rétractation de sept jours à compter de la livraison de leur commande pour faire retour du produit au vendeur pour échange ou remboursement sans pénalité, à l'exception des frais d'envoi. Les frais de retour sont à la charge de l'acheteur. Les marchandises retournées devront être en parfait état, aucune marchandise endommagée ne sera reprise.
            </p>
          </section>

          {/* Tarifs */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Tarifs
            </h2>
            <p>
              Les prix figurant dans le catalogue sont des prix TTC en euro. KHASHIKA se réserve le droit de modifier ses prix à tout moment, étant toutefois entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable à l'acheteur.
            </p>
            <p className="mt-4">
              KHASHIKA se réserve le droit de pouvoir modifier ses conditions de vente à tout moment. Dans ce cas, les conditions applicables seront celles en vigueur à la date de la commande par l'acheteur.
            </p>
            <p className="mt-4">
              L'acquisition d'un bien ou d'un service à travers le présent site implique une acceptation sans réserve par l'acheteur des présentes conditions de vente.
            </p>
          </section>

          {/* Caractéristiques */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Caractéristiques des biens et services proposés
            </h2>
            <p>
              Les produits et services offerts sont ceux qui figurent dans le catalogue publié dans le site de KHASHIKA.
              Ces produits et services sont vendus dans la limite des stocks disponibles.
            </p>
            <p className="mt-4">
              Les photographies du catalogue sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite avec le produit offert, notamment en ce qui concerne les couleurs.
            </p>
          </section>

          {/* Garantie */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Garantie
            </h2>
            <p>
              En cas de produit reçu non conforme ou défectueux, vous devez en faire la réclamation à KHASHIKA dans les 48h suivant la date de réception de votre colis : KHASHIKA vous l'échangera ou remboursera et prendra les frais de transport à sa charge. Passé ce délai de 48h, aucune réclamation ne sera prise en compte.
            </p>
          </section>

          {/* Responsabilité */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Responsabilité
            </h2>
            <p>
              Le vendeur, dans le processus de vente en ligne, n'est tenu que par une obligation de moyens ; sa responsabilité ne pourra être engagée pour un dommage résultant de l'utilisation du réseau Internet tel que perte de données, intrusion, virus, rupture du service, ou autres problèmes involontaires.
            </p>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Propriété intellectuelle
            </h2>
            <p>
              Tous les éléments du site de KHASHIKA sont et restent la propriété intellectuelle et exclusive de KHASHIKA.
              Personne n'est autorisé à reproduire, exploiter, rediffuser ou utiliser à quelque titre que ce soit, même partiellement, des éléments du site qu'ils soient logiciels, visuels ou sonores.
            </p>
            <p className="mt-4">
              Conformément à la loi relative à l'informatique, aux fichiers et aux libertés du 6 janvier 1978, les informations à caractère nominatif relatives aux acheteurs pourront faire l'objet d'un traitement automatisé.
            </p>
            <p className="mt-4">
              Les acheteurs peuvent s'opposer à la divulgation de leurs coordonnées en le signalant à KHASHIKA. De même, les utilisateurs disposent d'un droit d'accès et de rectification des données les concernant, conformément à la loi du 6 janvier 1978.
            </p>
          </section>

          {/* Mentions légales */}
          <section className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-serif text-secondary mb-4">
              Mentions légales
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Nom :</strong> KHASHIKA
              </p>
              <p>
                <strong>Adresse :</strong> 43, rue du raisin
              </p>
              <p>
                <strong>Code postal Ville :</strong> 68700 CERNAY
              </p>
              <p>
                <strong>Numéro de SIRET :</strong> 802 256 818 00013
              </p>
              <p className="mt-6 text-sm text-gray-600">
                Dernière mise à jour : 5 Juin 2014
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t">
            <a
              href="/fr"
              className="text-[#2596be] hover:text-[#1e7a9a] hover:underline"
            >
              ← Retour à l'accueil
            </a>
            <a
              href="/fr/shop"
              className="text-[#2596be] hover:text-[#1e7a9a] hover:underline"
            >
              Découvrir la boutique
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
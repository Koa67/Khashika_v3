import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Dashboard Admin - Khashika',
  description: 'Tableau de bord administrateur',
};

/**
 * DASHBOARD ANALYTICS
 * Affiche les KPI clés :
 * - Chiffre d'affaire total
 * - Commandes du jour
 * - Produits en rupture de stock
 * - Derniers inscrits
 */
export default async function AdminDashboardPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('admin');

  // TODO: Récupérer les données depuis Supabase
  // Pour l'instant, on affiche des données mock
  const stats = {
    totalRevenue: 125430.50,
    todayOrders: 12,
    outOfStock: 3,
    recentSignups: 5,
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-4xl text-[#2D2420] mb-8">{t('title')}</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Chiffre d'affaire total */}
          <div className="bg-[#FAF9F7] border border-[#EAB615]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.25)] p-6 border-l-4 border-[#8B4E4E]">
            <h3 className="text-sm text-[#2D2420]/60 uppercase tracking-wide mb-2">
              {t('totalRevenue')}
            </h3>
            <p className="text-3xl font-bold text-[#8B4E4E]">
              {stats.totalRevenue.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
          </div>

          {/* Commandes du jour */}
          <div className="bg-[#FAF9F7] border border-[#EAB615]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.25)] p-6 border-l-4 border-[#EAB615]">
            <h3 className="text-sm text-[#2D2420]/60 uppercase tracking-wide mb-2">
              {t('todayOrders')}
            </h3>
            <p className="text-3xl font-bold text-gold-fusion">{stats.todayOrders}</p>
          </div>

          {/* Produits en rupture */}
          <div className="bg-[#FAF9F7] border border-[#EAB615]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.25)] p-6 border-l-4 border-red-500">
            <h3 className="text-sm text-[#2D2420]/60 uppercase tracking-wide mb-2">
              {t('outOfStock')}
            </h3>
            <p className="text-3xl font-bold text-red-500">{stats.outOfStock}</p>
          </div>

          {/* Derniers inscrits */}
          <div className="bg-[#FAF9F7] border border-[#EAB615]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.25)] p-6 border-l-4 border-green-500">
            <h3 className="text-sm text-[#2D2420]/60 uppercase tracking-wide mb-2">
              {t('recentSignups')}
            </h3>
            <p className="text-3xl font-bold text-green-500">{stats.recentSignups}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#FAF9F7] border border-[#EAB615]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.25)] p-6 mb-8">
          <h2 className="font-serif text-2xl text-[#2D2420] mb-4">Actions rapides</h2>
          <div className="flex flex-wrap gap-4">
            <a
              href={`/${params.locale}/admin/orders`}
              className="bg-[#8B4E4E] text-white px-6 py-3 rounded-none font-medium hover:bg-[#6B3D3D] transition-colors"
            >
              {t('orders')}
            </a>
            <a
              href={`/${params.locale}/admin/products`}
              className="bg-[#EAB615] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#b8941f] transition-colors"
            >
              {t('products')}
            </a>
            <a
              href={`/${params.locale}/admin/customers`}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              {t('customers')}
            </a>
          </div>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="font-serif text-2xl text-[#2D2420] mb-4">Activité récente</h2>
          <p className="text-gray-600">Les dernières activités seront affichées ici.</p>
        </div>
      </div>
    </div>
  );
}
















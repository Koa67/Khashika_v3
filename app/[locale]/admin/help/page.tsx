'use client';

import { Search, Book, MessageCircle, Video, FileText, ExternalLink, ChevronRight } from 'lucide-react';

const helpCategories = [
  { title: 'Premiers pas', icon: Book, articles: 12, description: 'Guide de démarrage et configuration initiale' },
  { title: 'Gestion des produits', icon: FileText, articles: 24, description: 'Ajouter, modifier et organiser vos produits' },
  { title: 'Commandes & Livraisons', icon: FileText, articles: 18, description: 'Traiter les commandes et gérer les expéditions' },
  { title: 'Paiements', icon: FileText, articles: 8, description: 'Configuration Stripe et gestion des transactions' },
  { title: 'Marketing', icon: FileText, articles: 15, description: 'Promotions, newsletter et SEO' },
  { title: 'Rapports & Analytics', icon: FileText, articles: 10, description: 'Comprendre vos statistiques de vente' },
];

const popularArticles = [
  { title: 'Comment ajouter un nouveau produit ?', views: 1245 },
  { title: 'Configurer les frais de livraison', views: 987 },
  { title: 'Créer un code promo', views: 856 },
  { title: 'Gérer les stocks et alertes', views: 743 },
  { title: 'Exporter la liste des commandes', views: 621 },
];

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Centre d'aide</h1>
          <p className="text-gray-500 mt-1">Trouvez des réponses à vos questions</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#EAB615] to-[#d4a313] rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Comment pouvons-nous vous aider ?</h2>
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Rechercher dans l'aide..." className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {helpCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.title} className="bg-white rounded-xl border p-5 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-[#EAB615]/10 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#EAB615]" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#EAB615] transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mt-4">{category.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
              <p className="text-xs text-[#EAB615] mt-3">{category.articles} articles</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Articles populaires</h2>
          </div>
          <div className="divide-y">
            {popularArticles.map((article) => (
              <a key={article.title} href="#" className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <span className="text-sm text-gray-700">{article.title}</span>
                <span className="text-xs text-gray-400">{article.views} vues</span>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Contacter le support</h3>
                <p className="text-sm text-gray-500">Notre équipe répond sous 24h</p>
              </div>
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Ouvrir un ticket
            </button>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Tutoriels vidéo</h3>
                <p className="text-sm text-gray-500">Apprenez en regardant</p>
              </div>
            </div>
            <a href="#" className="flex items-center gap-2 mt-4 text-purple-600 hover:underline">
              <span>Voir les tutoriels</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

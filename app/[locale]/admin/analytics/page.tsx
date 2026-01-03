'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Eye, ShoppingCart, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  { label: 'Visiteurs', value: '12 456', change: 12.5, icon: Users },
  { label: 'Pages vues', value: '45 892', change: 8.3, icon: Eye },
  { label: 'Taux de conversion', value: '3.2%', change: -0.5, icon: ShoppingCart },
  { label: 'Panier moyen', value: '78 €', change: 5.2, icon: CreditCard },
];

const topPages = [
  { page: '/shop', views: 8456, unique: 5234 },
  { page: '/shop/bracelets', views: 3245, unique: 2156 },
  { page: '/shop/colliers', views: 2890, unique: 1987 },
  { page: '/product/bracelet-turquoise', views: 1567, unique: 1234 },
  { page: '/product/collier-lapis', views: 1234, unique: 987 },
];

const trafficSources = [
  { source: 'Google (Organic)', visitors: 5678, percent: 45.6 },
  { source: 'Direct', visitors: 3456, percent: 27.7 },
  { source: 'Instagram', visitors: 1890, percent: 15.2 },
  { source: 'Facebook', visitors: 890, percent: 7.1 },
  { source: 'Pinterest', visitors: 542, percent: 4.4 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500 mt-1">Analyse du trafic et des performances</p>
        </div>
        <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-sm rounded-md ${period === p ? 'bg-[#EAB615] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {p === '7d' ? '7 jours' : p === '30d' ? '30 jours' : '90 jours'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#EAB615]/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#EAB615]" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Pages les plus vues</h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th className="text-left pb-3">Page</th>
                  <th className="text-right pb-3">Vues</th>
                  <th className="text-right pb-3">Visiteurs uniques</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topPages.map((page) => (
                  <tr key={page.page}>
                    <td className="py-3 text-sm text-gray-900">{page.page}</td>
                    <td className="py-3 text-sm text-right font-medium">{page.views.toLocaleString()}</td>
                    <td className="py-3 text-sm text-right text-gray-600">{page.unique.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Sources de trafic</h2>
          </div>
          <div className="p-4 space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-900">{source.source}</span>
                  <span className="text-sm font-medium">{source.visitors.toLocaleString()} ({source.percent}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#EAB615] h-2 rounded-full" style={{ width: `${source.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Évolution du trafic</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Graphique de trafic (intégration Chart.js/Recharts à venir)</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { CreditCard, TrendingUp, ShoppingBag, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const salesStats = [
  { label: "Chiffre d'affaires", value: '12 456 €', change: 15.3, icon: CreditCard },
  { label: 'Commandes', value: '156', change: 8.2, icon: ShoppingBag },
  { label: 'Panier moyen', value: '79.85 €', change: 6.5, icon: Receipt },
  { label: 'Taux de conversion', value: '3.2%', change: -0.8, icon: TrendingUp },
];

const dailySales = [
  { date: '03/01', orders: 12, revenue: 956 },
  { date: '02/01', orders: 15, revenue: 1245 },
  { date: '01/01', orders: 8, revenue: 678 },
  { date: '31/12', orders: 22, revenue: 1890 },
  { date: '30/12', orders: 18, revenue: 1456 },
  { date: '29/12', orders: 14, revenue: 1123 },
  { date: '28/12', orders: 16, revenue: 1345 },
];

const topSelling = [
  { name: 'Bracelet Turquoise Argent', quantity: 45, revenue: 2025 },
  { name: 'Collier Lapis-Lazuli', quantity: 38, revenue: 3382 },
  { name: 'Boucles Améthyste', quantity: 32, revenue: 1216 },
  { name: 'Pashmina Soie Rose', quantity: 28, revenue: 980 },
  { name: 'Bague Pierre de Lune', quantity: 24, revenue: 1320 },
];

export default function SalesPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ventes</h1>
          <p className="text-gray-500 mt-1">Analyse des ventes et revenus</p>
        </div>
        <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
          {(['today', 'week', 'month', 'year'] as const).map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 text-sm rounded-md ${period === p ? 'bg-[#EAB615] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {p === 'today' ? "Aujourd'hui" : p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesStats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
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
            <h2 className="font-semibold text-gray-900">Ventes quotidiennes</h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th className="text-left pb-3">Date</th>
                  <th className="text-right pb-3">Commandes</th>
                  <th className="text-right pb-3">CA</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dailySales.map((day) => (
                  <tr key={day.date}>
                    <td className="py-3 text-sm text-gray-900">{day.date}</td>
                    <td className="py-3 text-sm text-right">{day.orders}</td>
                    <td className="py-3 text-sm text-right font-medium">{day.revenue} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Meilleures ventes</h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase">
                  <th className="text-left pb-3">Produit</th>
                  <th className="text-right pb-3">Qté</th>
                  <th className="text-right pb-3">CA</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {topSelling.map((product, i) => (
                  <tr key={product.name}>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#EAB615]/10 text-[#EAB615] text-xs flex items-center justify-center font-medium">{i + 1}</span>
                        <span className="text-sm text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-right">{product.quantity}</td>
                    <td className="py-3 text-sm text-right font-medium">{product.revenue} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

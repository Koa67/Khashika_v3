'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  ArrowRight,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

// Types
interface StatCard {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
}

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
}

interface TopProduct {
  id: string;
  name: string;
  image: string;
  sold: number;
  revenue: number;
  stock: number;
}

// Mock data
const stats: StatCard[] = [
  {
    title: "Chiffre d'affaires",
    value: '12 450 €',
    change: 12.5,
    changeLabel: 'vs mois dernier',
    icon: CreditCard,
    color: '#10B981',
  },
  {
    title: 'Commandes',
    value: '156',
    change: 8.2,
    changeLabel: 'vs mois dernier',
    icon: ShoppingBag,
    color: '#3B82F6',
  },
  {
    title: 'Clients',
    value: '2 340',
    change: 15.3,
    changeLabel: 'nouveaux ce mois',
    icon: Users,
    color: '#8B5CF6',
  },
  {
    title: 'Produits actifs',
    value: '726',
    change: -2.1,
    changeLabel: 'stock faible: 12',
    icon: Package,
    color: '#F59E0B',
  },
];

const recentOrders: Order[] = [
  { id: 'ORD-001', customer: 'Marie Dupont', email: 'marie@email.com', total: 189.00, status: 'pending', date: '2024-01-03', items: 3 },
  { id: 'ORD-002', customer: 'Jean Martin', email: 'jean@email.com', total: 245.50, status: 'paid', date: '2024-01-03', items: 2 },
  { id: 'ORD-003', customer: 'Sophie Bernard', email: 'sophie@email.com', total: 78.00, status: 'shipped', date: '2024-01-02', items: 1 },
  { id: 'ORD-004', customer: 'Pierre Leroy', email: 'pierre@email.com', total: 312.00, status: 'delivered', date: '2024-01-02', items: 4 },
  { id: 'ORD-005', customer: 'Claire Moreau', email: 'claire@email.com', total: 156.00, status: 'cancelled', date: '2024-01-01', items: 2 },
];

const topProducts: TopProduct[] = [
  { id: '1', name: 'Bracelet Turquoise Argent', image: '/images/products_reconciled/bracelet-argent-et-turquoise.webp', sold: 45, revenue: 2025, stock: 12 },
  { id: '2', name: 'Collier Lapis-Lazuli', image: '/images/products_reconciled/collier-tibetain-en-turquoise-et-lapis-lazuli.jpeg', sold: 38, revenue: 1900, stock: 8 },
  { id: '3', name: 'Boucles Améthyste', image: '/images/products_reconciled/boucles-doreilles-argent-amethyste.webp', sold: 32, revenue: 1280, stock: 15 },
  { id: '4', name: 'Bague Pierre de Lune', image: '/images/products_reconciled/bague-argent-pierre-de-lune.webp', sold: 28, revenue: 1120, stock: 6 },
];

const statusConfig = {
  pending: { label: 'En attente', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
  paid: { label: 'Payée', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  shipped: { label: 'Expédiée', icon: Truck, color: 'text-blue-600 bg-blue-50' },
  delivered: { label: 'Livrée', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
  cancelled: { label: 'Annulée', icon: XCircle, color: 'text-red-600 bg-red-50' },
};

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Bienvenue ! Voici un aperçu de votre boutique.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
          {(['today', 'week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                period === p
                  ? 'bg-[#EAB615] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p === 'today' ? "Aujourd'hui" : p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Année'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(stat.change)}%
                </div>
                <span className="text-sm text-gray-400">{stat.changeLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
            <Link
              href="/fr/admin/orders"
              className="text-sm text-[#EAB615] font-medium hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.id}</p>
                        <p className="text-xs text-gray-500">{order.items} article{order.items > 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{order.total.toFixed(2)} €</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="p-1.5 text-gray-400 hover:text-[#EAB615] hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Top produits</h2>
            <Link
              href="/fr/admin/products"
              className="text-sm text-[#EAB615] font-medium hover:underline flex items-center gap-1"
            >
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-4 space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                  {index + 1}
                </span>
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sold} vendus • Stock: {product.stock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.revenue} €</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Ajouter un produit', href: '/fr/admin/products/new', color: 'bg-blue-500' },
          { label: 'Traiter les commandes', href: '/fr/admin/orders?status=pending', color: 'bg-yellow-500' },
          { label: 'Gérer le stock', href: '/fr/admin/inventory', color: 'bg-purple-500' },
          { label: 'Voir les avis', href: '/fr/admin/reviews', color: 'bg-green-500' },
        ].map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`${action.color} text-white rounded-xl p-4 hover:opacity-90 transition-opacity`}
          >
            <p className="font-medium">{action.label}</p>
            <ArrowRight className="w-5 h-5 mt-2" />
          </Link>
        ))}
      </div>
    </div>
  );
}

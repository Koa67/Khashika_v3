'use client';

import { useState } from 'react';
import { Search, Download, Mail, Eye, MoreVertical, User, ShoppingBag, Calendar } from 'lucide-react';

const mockCustomers = [
  { id: '1', name: 'Marie Dupont', email: 'marie@example.com', orders: 12, totalSpent: 1450, lastOrder: '2024-01-03', status: 'active', createdAt: '2023-06-15' },
  { id: '2', name: 'Jean Martin', email: 'jean@example.com', orders: 8, totalSpent: 890, lastOrder: '2024-01-02', status: 'active', createdAt: '2023-08-20' },
  { id: '3', name: 'Sophie Bernard', email: 'sophie@example.com', orders: 5, totalSpent: 450, lastOrder: '2024-01-01', status: 'active', createdAt: '2023-09-10' },
  { id: '4', name: 'Pierre Leroy', email: 'pierre@example.com', orders: 3, totalSpent: 280, lastOrder: '2023-12-15', status: 'inactive', createdAt: '2023-07-05' },
  { id: '5', name: 'Claire Moreau', email: 'claire@example.com', orders: 15, totalSpent: 2100, lastOrder: '2024-01-03', status: 'vip', createdAt: '2023-03-01' },
  { id: '6', name: 'Lucas Petit', email: 'lucas@example.com', orders: 1, totalSpent: 45, lastOrder: '2023-11-20', status: 'new', createdAt: '2023-11-20' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'text-green-600 bg-green-50' },
  inactive: { label: 'Inactif', color: 'text-gray-600 bg-gray-50' },
  vip: { label: 'VIP', color: 'text-purple-600 bg-purple-50' },
  new: { label: 'Nouveau', color: 'text-blue-600 bg-blue-50' },
};

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filteredCustomers = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">2 340 clients enregistrés</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313]">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total clients', value: '2 340', icon: User, color: '#3B82F6' },
          { label: 'Clients actifs', value: '1 890', icon: ShoppingBag, color: '#10B981' },
          { label: 'Nouveaux (30j)', value: '156', icon: Calendar, color: '#8B5CF6' },
          { label: 'Clients VIP', value: '45', icon: User, color: '#F59E0B' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Rechercher par nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EAB615]" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Commandes</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total dépensé</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Dernière commande</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCustomers.map((customer) => {
              const status = statusConfig[customer.status];
              return (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EAB615] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{customer.orders}</td>
                  <td className="px-6 py-4 font-medium">{customer.totalSpent} €</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(customer.lastOrder).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-[#EAB615] hover:bg-yellow-50 rounded-lg"><Mail className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

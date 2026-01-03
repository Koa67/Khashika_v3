'use client';

import { useState } from 'react';
import { Search, AlertTriangle, Package, TrendingDown, CheckCircle } from 'lucide-react';

const mockInventory = [
  { id: '1', name: 'Bracelet Turquoise Argent', sku: 'BRA-TUR-001', stock: 12, minStock: 5, status: 'ok' },
  { id: '2', name: 'Collier Lapis-Lazuli', sku: 'COL-LAP-001', stock: 8, minStock: 10, status: 'low' },
  { id: '3', name: 'Boucles Améthyste', sku: 'BOU-AME-001', stock: 0, minStock: 5, status: 'out' },
  { id: '4', name: 'Bague Pierre de Lune', sku: 'BAG-PDL-001', stock: 6, minStock: 5, status: 'ok' },
  { id: '5', name: 'Pashmina Soie Rose', sku: 'PAS-SOI-001', stock: 25, minStock: 10, status: 'ok' },
  { id: '6', name: 'Collier Corail Rouge', sku: 'COL-COR-001', stock: 3, minStock: 5, status: 'low' },
  { id: '7', name: 'Bracelet Onyx Noir', sku: 'BRA-ONY-001', stock: 0, minStock: 5, status: 'out' },
  { id: '8', name: 'Boucles Grenat', sku: 'BOU-GRE-001', stock: 4, minStock: 5, status: 'low' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ok: { label: 'En stock', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  low: { label: 'Stock faible', color: 'text-yellow-600 bg-yellow-50', icon: TrendingDown },
  out: { label: 'Rupture', color: 'text-red-600 bg-red-50', icon: AlertTriangle },
};

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const stats = {
    total: mockInventory.length,
    ok: mockInventory.filter(i => i.status === 'ok').length,
    low: mockInventory.filter(i => i.status === 'low').length,
    out: mockInventory.filter(i => i.status === 'out').length,
  };

  const filteredInventory = mockInventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventaire</h1>
          <p className="text-gray-500 mt-1">Gestion des stocks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md" onClick={() => setFilter('all')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Package className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-gray-500">Total produits</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md" onClick={() => setFilter('ok')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold text-green-600">{stats.ok}</p><p className="text-xs text-gray-500">En stock</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md" onClick={() => setFilter('low')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center"><TrendingDown className="w-5 h-5 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold text-yellow-600">{stats.low}</p><p className="text-xs text-gray-500">Stock faible</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4 cursor-pointer hover:shadow-md" onClick={() => setFilter('out')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
            <div><p className="text-2xl font-bold text-red-600">{stats.out}</p><p className="text-xs text-gray-500">Rupture</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#EAB615]" />
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Produit</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stock actuel</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stock min</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredInventory.map((item) => {
              const status = statusConfig[item.status];
              const StatusIcon = status.icon;
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.sku}</td>
                  <td className="px-6 py-4 font-semibold">{item.stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.minStock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />{status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1.5 text-xs font-medium text-[#EAB615] border border-[#EAB615] rounded-lg hover:bg-[#EAB615] hover:text-white transition-colors">
                      Réapprovisionner
                    </button>
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

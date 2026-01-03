'use client';

import { useState } from 'react';
import { Search, Plus, Filter, Grid, List, Edit, Trash2, Eye, MoreVertical, Package } from 'lucide-react';
import Link from 'next/link';

const mockProducts = [
  { id: '1', name: 'Bracelet Turquoise Argent', sku: 'BRA-TUR-001', price: 45, stock: 12, status: 'active', category: 'Bracelets', image: '/images/products_reconciled/bracelet-argent-et-turquoise.webp' },
  { id: '2', name: 'Collier Lapis-Lazuli', sku: 'COL-LAP-001', price: 89, stock: 8, status: 'active', category: 'Colliers', image: '/images/products_reconciled/collier-tibetain-en-turquoise-et-lapis-lazuli.jpeg' },
  { id: '3', name: 'Boucles Améthyste', sku: 'BOU-AME-001', price: 38, stock: 0, status: 'outofstock', category: 'Boucles', image: '/images/products_reconciled/boucles-doreilles-argent-amethyste.webp' },
  { id: '4', name: 'Bague Pierre de Lune', sku: 'BAG-PDL-001', price: 55, stock: 6, status: 'active', category: 'Bagues', image: '/images/products_reconciled/bague-argent-pierre-de-lune.webp' },
  { id: '5', name: 'Pashmina Soie Rose', sku: 'PAS-SOI-001', price: 35, stock: 25, status: 'active', category: 'Pashminas', image: '/images/products_reconciled/pashmina-100-soie.webp' },
  { id: '6', name: 'Collier Corail Rouge', sku: 'COL-COR-001', price: 95, stock: 3, status: 'lowstock', category: 'Colliers', image: '/images/products_reconciled/collier-tibetain-en-pierres-de-corail.jpeg' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Actif', color: 'text-green-600 bg-green-50' },
  outofstock: { label: 'Rupture', color: 'text-red-600 bg-red-50' },
  lowstock: { label: 'Stock faible', color: 'text-yellow-600 bg-yellow-50' },
  draft: { label: 'Brouillon', color: 'text-gray-600 bg-gray-50' },
};

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = mockProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-gray-500 mt-1">726 produits au total</p>
        </div>
        <Link href="/fr/admin/products/new" className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313]">
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher par nom ou SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EAB615]" />
          </div>
          <div className="flex items-center gap-2">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="all">Toutes catégories</option>
              <option value="Bracelets">Bracelets</option>
              <option value="Colliers">Colliers</option>
              <option value="Boucles">Boucles d'oreilles</option>
              <option value="Bagues">Bagues</option>
              <option value="Pashminas">Pashminas</option>
            </select>
            <div className="flex border border-gray-200 rounded-lg">
              <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-gray-100' : ''}`}><List className="w-4 h-4" /></button>
              <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-gray-100' : ''}`}><Grid className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Produit</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Prix</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredProducts.map((product) => {
              const status = statusConfig[product.status];
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 font-medium">{product.price} €</td>
                  <td className="px-6 py-4 text-sm">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-[#EAB615] hover:bg-yellow-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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

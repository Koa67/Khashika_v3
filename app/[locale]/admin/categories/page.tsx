'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Package } from 'lucide-react';

const mockCategories = [
  { id: '1', name: 'Bracelets', slug: 'bracelets', products: 156, status: 'active', order: 1 },
  { id: '2', name: 'Colliers', slug: 'colliers', products: 134, status: 'active', order: 2 },
  { id: '3', name: 'Boucles d\'oreilles', slug: 'boucles-oreilles', products: 178, status: 'active', order: 3 },
  { id: '4', name: 'Bagues', slug: 'bagues', products: 89, status: 'active', order: 4 },
  { id: '5', name: 'Pendentifs', slug: 'pendentifs', products: 67, status: 'active', order: 5 },
  { id: '6', name: 'Pashminas', slug: 'pashminas', products: 45, status: 'active', order: 6 },
  { id: '7', name: 'Foulards', slug: 'foulards', products: 32, status: 'active', order: 7 },
  { id: '8', name: 'Chaînes', slug: 'chaines', products: 24, status: 'active', order: 8 },
];

export default function CategoriesPage() {
  const [categories] = useState(mockCategories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-500 mt-1">{categories.length} catégories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313]">
          <Plus className="w-4 h-4" />
          Nouvelle catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#EAB615]/10 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-[#EAB615]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-500">/{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-[#EAB615] hover:bg-yellow-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>{category.products} produits</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Gem, Package } from 'lucide-react';

const mockStones = [
  { id: '1', name: 'Turquoise', color: '#40E0D0', products: 75, description: 'Pierre de protection et de communication' },
  { id: '2', name: 'Améthyste', color: '#9966CC', products: 62, description: 'Pierre de sagesse et de sérénité' },
  { id: '3', name: 'Lapis-Lazuli', color: '#26619C', products: 48, description: 'Pierre de vérité et d\'illumination' },
  { id: '4', name: 'Pierre de Lune', color: '#F0F0F0', products: 36, description: 'Pierre de féminité et d\'intuition' },
  { id: '5', name: 'Corail', color: '#FF6B6B', products: 42, description: 'Pierre de vitalité et de protection' },
  { id: '6', name: 'Onyx Noir', color: '#353839', products: 31, description: 'Pierre d\'ancrage et de stabilité' },
  { id: '7', name: 'Grenat', color: '#7B1113', products: 28, description: 'Pierre d\'énergie et de passion' },
  { id: '8', name: 'Jade', color: '#00A86B', products: 25, description: 'Pierre de pureté et d\'harmonie' },
  { id: '9', name: 'Quartz Rose', color: '#FFB6C1', products: 38, description: 'Pierre d\'amour inconditionnel' },
  { id: '10', name: 'Labradorite', color: '#6B8BA4', products: 22, description: 'Pierre de protection et de transformation' },
];

export default function StonesPage() {
  const [stones] = useState(mockStones);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pierres</h1>
          <p className="text-gray-500 mt-1">{stones.length} pierres référencées</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313]">
          <Plus className="w-4 h-4" />
          Ajouter une pierre
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stones.map((stone) => (
          <div key={stone.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stone.color}20` }}>
                <Gem className="w-6 h-6" style={{ color: stone.color }} />
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-[#EAB615] hover:bg-yellow-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900">{stone.name}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{stone.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: stone.color }}></div>
              <span className="text-xs text-gray-500">{stone.color}</span>
            </div>
            <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>{stone.products} produits</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

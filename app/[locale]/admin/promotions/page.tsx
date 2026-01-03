'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Calendar, Percent } from 'lucide-react';

const mockPromotions = [
  { id: '1', name: 'Soldes d\'hiver', code: 'HIVER24', discount: 20, type: 'percent', startDate: '2024-01-01', endDate: '2024-01-31', status: 'active', usageCount: 45 },
  { id: '2', name: 'Livraison offerte', code: 'FREESHIP', discount: 0, type: 'shipping', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active', usageCount: 128 },
  { id: '3', name: 'Nouvelle année', code: 'NEWYEAR', discount: 15, type: 'percent', startDate: '2024-01-01', endDate: '2024-01-15', status: 'expired', usageCount: 32 },
  { id: '4', name: 'VIP -25%', code: 'VIP25', discount: 25, type: 'percent', startDate: '2024-01-01', endDate: '2024-06-30', status: 'active', usageCount: 12 },
  { id: '5', name: 'Printemps', code: 'SPRING24', discount: 10, type: 'percent', startDate: '2024-03-01', endDate: '2024-03-31', status: 'scheduled', usageCount: 0 },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'text-green-600 bg-green-50' },
  expired: { label: 'Expirée', color: 'text-gray-600 bg-gray-50' },
  scheduled: { label: 'Programmée', color: 'text-blue-600 bg-blue-50' },
};

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-500 mt-1">Gérez vos codes promo et réductions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313]">
          <Plus className="w-4 h-4" />
          Nouvelle promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><Tag className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">3</p><p className="text-xs text-gray-500">Promotions actives</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Percent className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">217</p><p className="text-xs text-gray-500">Utilisations totales</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">1</p><p className="text-xs text-gray-500">Programmée</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Promotion</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Code</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Réduction</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Période</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Utilisations</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockPromotions.map((promo) => {
              const status = statusConfig[promo.status];
              return (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{promo.name}</td>
                  <td className="px-6 py-4"><code className="px-2 py-1 bg-gray-100 rounded text-sm">{promo.code}</code></td>
                  <td className="px-6 py-4">{promo.type === 'shipping' ? 'Livraison gratuite' : `${promo.discount}%`}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(promo.startDate).toLocaleDateString('fr-FR')} - {new Date(promo.endDate).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">{promo.usageCount}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
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

'use client';

import { useState } from 'react';
import { Send, Users, Mail, TrendingUp, Plus, Eye, Edit, Trash2 } from 'lucide-react';

const mockCampaigns = [
  { id: '1', name: 'Soldes d\'hiver 2024', subject: '❄️ -20% sur toute la collection !', sent: 1245, opened: 456, clicked: 123, date: '2024-01-02', status: 'sent' },
  { id: '2', name: 'Nouveautés Janvier', subject: '✨ Découvrez nos nouvelles créations', sent: 1180, opened: 389, clicked: 98, date: '2024-01-05', status: 'scheduled' },
  { id: '3', name: 'Saint-Valentin', subject: '💝 Offrez un bijou unique', sent: 0, opened: 0, clicked: 0, date: '2024-02-01', status: 'draft' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  sent: { label: 'Envoyée', color: 'text-green-600 bg-green-50' },
  scheduled: { label: 'Programmée', color: 'text-blue-600 bg-blue-50' },
  draft: { label: 'Brouillon', color: 'text-gray-600 bg-gray-50' },
};

export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-gray-500 mt-1">Gérez vos campagnes email</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313]">
          <Plus className="w-4 h-4" />
          Nouvelle campagne
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Users className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">1 456</p><p className="text-xs text-gray-500">Abonnés</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><Send className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">12</p><p className="text-xs text-gray-500">Campagnes envoyées</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><Mail className="w-5 h-5 text-purple-600" /></div>
            <div><p className="text-2xl font-bold">36.5%</p><p className="text-xs text-gray-500">Taux d'ouverture</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">9.8%</p><p className="text-xs text-gray-500">Taux de clic</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-gray-900">Campagnes récentes</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Campagne</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Envoyés</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Ouverts</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Clics</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockCampaigns.map((campaign) => {
              const status = statusConfig[campaign.status];
              const openRate = campaign.sent > 0 ? ((campaign.opened / campaign.sent) * 100).toFixed(1) : 0;
              const clickRate = campaign.sent > 0 ? ((campaign.clicked / campaign.sent) * 100).toFixed(1) : 0;
              return (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">{campaign.subject}</p>
                  </td>
                  <td className="px-6 py-4">{campaign.sent.toLocaleString()}</td>
                  <td className="px-6 py-4">{campaign.opened.toLocaleString()} <span className="text-xs text-gray-500">({openRate}%)</span></td>
                  <td className="px-6 py-4">{campaign.clicked.toLocaleString()} <span className="text-xs text-gray-500">({clickRate}%)</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(campaign.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
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

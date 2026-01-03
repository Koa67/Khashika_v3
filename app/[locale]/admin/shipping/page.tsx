'use client';

import { useState } from 'react';
import { Truck, Package, CheckCircle, Clock, MapPin, Search } from 'lucide-react';

const shippingStats = [
  { label: 'En préparation', value: 8, icon: Package, color: 'blue' },
  { label: 'En transit', value: 12, icon: Truck, color: 'yellow' },
  { label: 'Livrées (30j)', value: 134, icon: CheckCircle, color: 'green' },
  { label: 'Délai moyen', value: '2.3j', icon: Clock, color: 'purple' },
];

const shipments = [
  { id: 'SHP-001', order: 'ORD-2024-001', customer: 'Marie Dupont', address: '12 Rue de la Paix, 75002 Paris', carrier: 'Colissimo', tracking: 'CB123456789FR', status: 'transit', date: '2024-01-03' },
  { id: 'SHP-002', order: 'ORD-2024-002', customer: 'Jean Martin', address: '45 Avenue des Champs, 69001 Lyon', carrier: 'Mondial Relay', tracking: 'MR987654321', status: 'preparing', date: '2024-01-03' },
  { id: 'SHP-003', order: 'ORD-2024-003', customer: 'Sophie Bernard', address: '8 Rue du Commerce, 33000 Bordeaux', carrier: 'Colissimo', tracking: 'CB456789123FR', status: 'delivered', date: '2024-01-02' },
  { id: 'SHP-004', order: 'ORD-2024-004', customer: 'Pierre Leroy', address: '22 Boulevard Haussmann, 75009 Paris', carrier: 'Chronopost', tracking: 'XY789456123', status: 'transit', date: '2024-01-02' },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  preparing: { label: 'En préparation', color: 'text-blue-600 bg-blue-50', icon: Package },
  transit: { label: 'En transit', color: 'text-yellow-600 bg-yellow-50', icon: Truck },
  delivered: { label: 'Livrée', color: 'text-green-600 bg-green-50', icon: CheckCircle },
};

export default function ShippingPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch = s.customer.toLowerCase().includes(search.toLowerCase()) || s.tracking.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livraisons</h1>
          <p className="text-gray-500 mt-1">Suivi des expéditions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {shippingStats.map((stat) => {
          const Icon = stat.icon;
          const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', yellow: 'bg-yellow-50 text-yellow-600', green: 'bg-green-50 text-green-600', purple: 'bg-purple-50 text-purple-600' };
          return (
            <div key={stat.label} className="bg-white rounded-xl border p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[stat.color]}`}><Icon className="w-5 h-5" /></div>
                <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher par client ou n° de suivi..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#EAB615]" />
          </div>
          <div className="flex gap-2">
            {['all', 'preparing', 'transit', 'delivered'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm ${filter === f ? 'bg-[#EAB615] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f === 'all' ? 'Tous' : statusConfig[f]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Expédition</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Adresse</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Transporteur</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">N° Suivi</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredShipments.map((shipment) => {
              const status = statusConfig[shipment.status];
              const StatusIcon = status.icon;
              return (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{shipment.id}</p>
                    <p className="text-xs text-gray-500">{shipment.order}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{shipment.customer}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="text-sm text-gray-600">{shipment.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{shipment.carrier}</td>
                  <td className="px-6 py-4"><code className="px-2 py-1 bg-gray-100 rounded text-xs">{shipment.tracking}</code></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />{status.label}
                    </span>
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

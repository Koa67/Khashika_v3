'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customer: { name: 'Marie Dupont', email: 'marie@example.com', phone: '+33 6 12 34 56 78' },
    items: [
      { name: 'Bracelet Turquoise Argent', quantity: 1, price: 45 },
      { name: 'Boucles Améthyste', quantity: 2, price: 38 },
    ],
    total: 121,
    status: 'pending',
    paymentMethod: 'Carte bancaire',
    shippingAddress: '12 Rue de la Paix, 75002 Paris',
    createdAt: '2024-01-03T10:30:00',
    updatedAt: '2024-01-03T10:30:00',
  },
  {
    id: 'ORD-2024-002',
    customer: { name: 'Jean Martin', email: 'jean@example.com', phone: '+33 6 98 76 54 32' },
    items: [
      { name: 'Collier Lapis-Lazuli', quantity: 1, price: 89 },
    ],
    total: 89,
    status: 'paid',
    paymentMethod: 'PayPal',
    shippingAddress: '45 Avenue des Champs, 69001 Lyon',
    createdAt: '2024-01-03T09:15:00',
    updatedAt: '2024-01-03T09:45:00',
  },
  {
    id: 'ORD-2024-003',
    customer: { name: 'Sophie Bernard', email: 'sophie@example.com', phone: '+33 6 11 22 33 44' },
    items: [
      { name: 'Bague Pierre de Lune', quantity: 1, price: 55 },
      { name: 'Pashmina Soie', quantity: 1, price: 35 },
    ],
    total: 90,
    status: 'processing',
    paymentMethod: 'Carte bancaire',
    shippingAddress: '8 Rue du Commerce, 33000 Bordeaux',
    createdAt: '2024-01-02T16:20:00',
    updatedAt: '2024-01-03T08:00:00',
  },
  {
    id: 'ORD-2024-004',
    customer: { name: 'Pierre Leroy', email: 'pierre@example.com', phone: '+33 6 55 66 77 88' },
    items: [
      { name: 'Collier Tibétain Turquoise', quantity: 1, price: 125 },
    ],
    total: 125,
    status: 'shipped',
    paymentMethod: 'Carte bancaire',
    shippingAddress: '22 Boulevard Haussmann, 75009 Paris',
    createdAt: '2024-01-01T14:00:00',
    updatedAt: '2024-01-02T10:30:00',
  },
  {
    id: 'ORD-2024-005',
    customer: { name: 'Claire Moreau', email: 'claire@example.com', phone: '+33 6 99 88 77 66' },
    items: [
      { name: 'Bracelet Onyx Noir', quantity: 1, price: 42 },
    ],
    total: 42,
    status: 'delivered',
    paymentMethod: 'Carte bancaire',
    shippingAddress: '15 Rue de la République, 13001 Marseille',
    createdAt: '2023-12-28T11:45:00',
    updatedAt: '2024-01-02T14:20:00',
  },
  {
    id: 'ORD-2024-006',
    customer: { name: 'Lucas Petit', email: 'lucas@example.com', phone: '+33 6 44 33 22 11' },
    items: [
      { name: 'Boucles Corail', quantity: 1, price: 48 },
    ],
    total: 48,
    status: 'cancelled',
    paymentMethod: 'PayPal',
    shippingAddress: '5 Place Bellecour, 69002 Lyon',
    createdAt: '2023-12-27T09:30:00',
    updatedAt: '2023-12-28T10:00:00',
  },
];

const statusConfig = {
  pending: { label: 'En attente', icon: Clock, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  paid: { label: 'Payée', icon: CheckCircle, color: 'text-green-600 bg-green-50 border-green-200' },
  processing: { label: 'En préparation', icon: Package, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  shipped: { label: 'Expédiée', icon: Truck, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  delivered: { label: 'Livrée', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  cancelled: { label: 'Annulée', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((o) => o.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500 mt-1">{mockOrders.length} commandes au total</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313] transition-colors">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par ID, client, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EAB615] focus:ring-1 focus:ring-[#EAB615]"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EAB615]"
            >
              <option value="all">Tous les status</option>
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
              <option value="processing">En préparation</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        </div>

        {/* Status Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(statusConfig).map(([key, config]) => {
            const count = mockOrders.filter((o) => o.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  statusFilter === key
                    ? config.color
                    : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {config.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleAllOrders}
                    className="w-4 h-4 rounded border-gray-300 text-[#EAB615] focus:ring-[#EAB615]"
                  />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Commande</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Articles</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#EAB615] focus:ring-[#EAB615]"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {order.items.map((i) => i.name).join(', ')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{order.total.toFixed(2)} €</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-400 hover:text-[#EAB615] hover:bg-gray-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Affichage de {filteredOrders.length} sur {mockOrders.length} commandes
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium">Page {currentPage}</span>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

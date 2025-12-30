'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Package, Search, Filter } from 'lucide-react';

/**
 * TABLEAU DE GESTION COMMANDES
 * Utilise tanstack/react-table pour la gestion avancée
 * - Filtres par statut
 * - Action : "Mark as Shipped" (Server Action qui envoie un email)
 * - Vue détail (Modal ou Page) avec contenu de la commande
 */

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersTable() {
  const t = useTranslations('admin');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // TODO: Récupérer les commandes depuis Supabase
  // Pour l'instant, données mock
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'Jean Dupont',
      email: 'jean@example.com',
      total: 125.50,
      status: 'paid',
      createdAt: '2024-01-15',
      items: [
        { productName: 'Bracelet Argent', quantity: 1, price: 125.50 },
      ],
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Marie Martin',
      email: 'marie@example.com',
      total: 89.90,
      status: 'shipped',
      createdAt: '2024-01-14',
      items: [
        { productName: 'Collier Turquoise', quantity: 1, price: 89.90 },
      ],
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleMarkAsShipped = async (orderId: string) => {
    // TODO: Implémenter Server Action pour marquer comme expédié
    // et envoyer un email de notification
    console.log('Mark as shipped:', orderId);
    alert('Commande marquée comme expédiée (à implémenter avec Server Action)');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl text-[#2D2420]">{t('orders')}</h1>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une commande..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4E4E]"
              />
            </div>

            {/* Filtre par statut */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4E4E]"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">{t('orderStatus.pending')}</option>
                <option value="paid">{t('orderStatus.paid')}</option>
                <option value="shipped">{t('orderStatus.shipped')}</option>
                <option value="delivered">{t('orderStatus.delivered')}</option>
                <option value="cancelled">{t('orderStatus.cancelled')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="font-medium text-[#2D2420]">{order.orderNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-[#2D2420]">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-[#E8B71B]">
                      {order.total.toFixed(2)} €
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {t(`orderStatus.${order.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {order.status === 'paid' && (
                        <button
                          onClick={() => handleMarkAsShipped(order.id)}
                          className="text-[#8B4E4E] hover:text-[#6B3D3D] font-medium"
                        >
                          {t('markAsShipped')}
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-[#2D2420] font-medium">
                        {t('viewDetails')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune commande trouvée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
















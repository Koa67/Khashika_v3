'use client';

import { useState } from 'react';
import { Bell, ShoppingCart, Package, MessageSquare, AlertTriangle, CheckCircle, Trash2, Check } from 'lucide-react';

const mockNotifications = [
  { id: '1', type: 'order', title: 'Nouvelle commande', message: 'Commande #ORD-2024-001 de Marie Dupont (121 €)', time: 'Il y a 5 min', read: false },
  { id: '2', type: 'stock', title: 'Stock faible', message: 'Collier Lapis-Lazuli - Seulement 3 en stock', time: 'Il y a 30 min', read: false },
  { id: '3', type: 'review', title: 'Nouvel avis', message: 'Sophie B. a laissé un avis 5 étoiles sur Boucles Améthyste', time: 'Il y a 2h', read: false },
  { id: '4', type: 'order', title: 'Commande expédiée', message: 'Commande #ORD-2024-003 a été expédiée', time: 'Il y a 3h', read: true },
  { id: '5', type: 'alert', title: 'Paiement échoué', message: 'Le paiement de la commande #ORD-2024-005 a échoué', time: 'Il y a 5h', read: true },
  { id: '6', type: 'stock', title: 'Rupture de stock', message: 'Boucles Améthyste est en rupture de stock', time: 'Hier', read: true },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  order: { icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
  stock: { icon: Package, color: 'text-yellow-600 bg-yellow-50' },
  review: { icon: MessageSquare, color: 'text-green-600 bg-green-50' },
  alert: { icon: AlertTriangle, color: 'text-red-600 bg-red-50' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter !== 'all') return n.type === filter;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">{unreadCount} non lues</p>
        </div>
        <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
          <CheckCircle className="w-4 h-4" />
          Tout marquer comme lu
        </button>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'unread', label: 'Non lues' },
            { id: 'order', label: 'Commandes' },
            { id: 'stock', label: 'Stock' },
            { id: 'review', label: 'Avis' },
            { id: 'alert', label: 'Alertes' },
          ].map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f.id ? 'bg-[#EAB615] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          filtered.map((notif) => {
            const config = typeConfig[notif.type];
            const Icon = config.icon;
            return (
              <div key={notif.id} className={`bg-white rounded-xl border p-4 flex items-start gap-4 ${!notif.read ? 'border-l-4 border-l-[#EAB615]' : ''}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{notif.title}</p>
                    {!notif.read && <span className="w-2 h-2 bg-[#EAB615] rounded-full"></span>}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!notif.read && (
                    <button onClick={() => markAsRead(notif.id)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(notif.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

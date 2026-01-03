'use client';

import { useState } from 'react';
import { Bell, Search, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/db/supabase-client';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  admin: {
    email: string;
    name: string;
    role: string;
  };
}

export default function AdminHeader({ admin }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/fr/login');
  };

  const notifications = [
    { id: 1, text: 'Nouvelle commande #1234', time: 'Il y a 5 min', unread: true },
    { id: 2, text: 'Stock faible: Bracelet Turquoise', time: 'Il y a 1h', unread: true },
    { id: 3, text: 'Nouvel avis client (5 étoiles)', time: 'Il y a 3h', unread: false },
  ];

  return (
    <header className="fixed top-0 right-0 left-64 z-30 h-16 bg-white border-b border-gray-200">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher commandes, produits, clients..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#EAB615] focus:ring-1 focus:ring-[#EAB615]"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <span className="text-xs text-[#EAB615] font-medium cursor-pointer hover:underline">
                    Tout marquer comme lu
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${
                        notif.unread ? 'bg-[#EAB615]/5' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notif.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/fr/admin/notifications"
                  className="block px-4 py-3 text-center text-sm text-[#EAB615] font-medium hover:bg-gray-50"
                >
                  Voir toutes les notifications
                </Link>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 pl-4 pr-2 py-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                <p className="text-xs text-gray-500">{admin.role}</p>
              </div>
              <div className="w-9 h-9 bg-[#EAB615] rounded-full flex items-center justify-center">
                <span className="font-semibold text-white text-sm">
                  {admin.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{admin.name}</p>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/fr/admin/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    Mon profil
                  </Link>
                  <Link
                    href="/fr/admin/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </Link>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

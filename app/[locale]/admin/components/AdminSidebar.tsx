'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  BarChart3,
  Tag,
  Truck,
  MessageSquare,
  FileText,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Store,
  Gem,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Principal',
    items: [
      { name: 'Dashboard', href: '/fr/admin', icon: LayoutDashboard },
      { name: 'Commandes', href: '/fr/admin/orders', icon: ShoppingCart, badge: 'new' },
      { name: 'Produits', href: '/fr/admin/products', icon: Package },
      { name: 'Clients', href: '/fr/admin/customers', icon: Users },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { name: 'Catégories', href: '/fr/admin/categories', icon: Tag },
      { name: 'Pierres', href: '/fr/admin/stones', icon: Gem },
      { name: 'Inventaire', href: '/fr/admin/inventory', icon: Store },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { name: 'Promotions', href: '/fr/admin/promotions', icon: Tag },
      { name: 'Avis clients', href: '/fr/admin/reviews', icon: MessageSquare },
      { name: 'Newsletter', href: '/fr/admin/newsletter', icon: FileText },
    ],
  },
  {
    title: 'Rapports',
    items: [
      { name: 'Statistiques', href: '/fr/admin/analytics', icon: BarChart3 },
      { name: 'Ventes', href: '/fr/admin/sales', icon: CreditCard },
      { name: 'Livraisons', href: '/fr/admin/shipping', icon: Truck },
    ],
  },
  {
    title: 'Système',
    items: [
      { name: 'Paramètres', href: '/fr/admin/settings', icon: Settings },
      { name: 'Notifications', href: '/fr/admin/notifications', icon: Bell },
      { name: 'Aide', href: '/fr/admin/help', icon: HelpCircle },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/fr/admin') {
      return pathname === '/fr/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#1E1E2D] text-white overflow-y-auto">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/fr/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#EAB615] rounded-lg flex items-center justify-center">
            <span className="font-serif font-bold text-[#1E1E2D]">K</span>
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-white">Khashika</span>
            <span className="block text-[10px] text-white/50 uppercase tracking-wider">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-6">
        {menuItems.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        active
                          ? 'bg-[#EAB615] text-[#1E1E2D] font-medium'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                          active ? 'bg-[#1E1E2D]/20 text-[#1E1E2D]' : 'bg-red-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <Link
          href="/fr"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Retour au site</span>
        </Link>
      </div>
    </aside>
  );
}

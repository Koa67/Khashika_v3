'use client';

import { useState } from 'react';
import { Store, CreditCard, Truck, Mail, Globe, Bell, Shield, Save } from 'lucide-react';

const settingsSections = [
  { id: 'store', label: 'Boutique', icon: Store },
  { id: 'payment', label: 'Paiement', icon: CreditCard },
  { id: 'shipping', label: 'Livraison', icon: Truck },
  { id: 'email', label: 'Emails', icon: Mail },
  { id: 'seo', label: 'SEO', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Sécurité', icon: Shield },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('store');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-500 mt-1">Configuration de votre boutique</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313]">
          <Save className="w-4 h-4" />
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-64 bg-white rounded-xl border p-2 h-fit">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeSection === section.id ? 'bg-[#EAB615]/10 text-[#EAB615]' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-white rounded-xl border p-6">
          {activeSection === 'store' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Informations de la boutique</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
                  <input type="text" defaultValue="Khashika" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
                  <input type="email" defaultValue="contact@khashika.com" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input type="tel" defaultValue="+33 1 23 45 67 89" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
                  <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]">
                    <option>EUR (€)</option>
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <textarea rows={3} defaultValue="123 Rue des Bijoux&#10;75001 Paris, France" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
              </div>
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Configuration des paiements</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-[#635BFF] rounded flex items-center justify-center text-white font-bold text-xs">Stripe</div>
                    <div><p className="font-medium">Stripe</p><p className="text-xs text-gray-500">Cartes bancaires, Apple Pay, Google Pay</p></div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EAB615]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-[#003087] rounded flex items-center justify-center text-white font-bold text-xs">PP</div>
                    <div><p className="font-medium">PayPal</p><p className="text-xs text-gray-500">Paiement via compte PayPal</p></div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EAB615]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'shipping' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Options de livraison</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Livraison standard</p>
                    <input type="text" defaultValue="4.90 €" className="w-24 px-3 py-1 border rounded text-right" />
                  </div>
                  <p className="text-sm text-gray-500">Délai: 3-5 jours ouvrés</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Livraison express</p>
                    <input type="text" defaultValue="9.90 €" className="w-24 px-3 py-1 border rounded text-right" />
                  </div>
                  <p className="text-sm text-gray-500">Délai: 24-48h</p>
                </div>
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-green-700">Livraison gratuite à partir de</p>
                    <input type="text" defaultValue="50 €" className="w-24 px-3 py-1 border rounded text-right" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {['email', 'seo', 'notifications', 'security'].includes(activeSection) && (
            <div className="text-center py-12 text-gray-500">
              <p>Configuration {settingsSections.find(s => s.id === activeSection)?.label}</p>
              <p className="text-sm mt-2">Section en cours de développement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

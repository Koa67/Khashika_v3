'use client';

import { useState } from 'react';
import { User, Mail, Phone, Lock, Camera, Save, Shield, Clock } from 'lucide-react';

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-500 mt-1">Gérez vos informations personnelles</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#EAB615] text-white rounded-lg hover:bg-[#d4a313]">
          <Save className="w-4 h-4" />
          {saved ? 'Enregistré !' : 'Enregistrer'}
        </button>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Photo de profil</h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-[#EAB615] rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">N</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div>
            <p className="text-sm text-gray-600">JPG, GIF ou PNG. Max 2MB</p>
            <button className="mt-2 text-sm text-[#EAB615] hover:underline">Changer la photo</button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations personnelles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-2" />Prénom
            </label>
            <input type="text" defaultValue="Nicolas" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-2" />Nom
            </label>
            <input type="text" defaultValue="NKDR" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-2" />Email
            </label>
            <input type="email" defaultValue="nickoko911@gmail.com" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-2" />Téléphone
            </label>
            <input type="tel" defaultValue="+33 6 12 34 56 78" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          <Lock className="w-5 h-5 inline mr-2" />Sécurité
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#EAB615]" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du compte</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-600">
            <Shield className="w-4 h-4" />
            <span>Rôle: <span className="font-medium text-gray-900">Administrateur</span></span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Membre depuis: <span className="font-medium text-gray-900">Janvier 2024</span></span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Dernière connexion: <span className="font-medium text-gray-900">Aujourd'hui à 09:45</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

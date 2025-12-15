'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Email invalide');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'register' && password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    // TODO: Intégrer avec Supabase
    console.log('Submit:', { email, password, activeTab });
  };

  return (
    <div className="min-h-screen bg-[#F4EAD8] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-center font-serif text-sm font-bold tracking-wider transition-colors ${
              activeTab === 'login'
                ? 'text-[#2596be] border-b-2 border-[#2596be]'
                : 'text-gray-600 hover:text-[#2596be]'
            }`}
          >
            CONNEXION
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-center font-serif text-sm font-bold tracking-wider transition-colors ${
              activeTab === 'register'
                ? 'text-[#2596be] border-b-2 border-[#2596be]'
                : 'text-gray-600 hover:text-[#2596be]'
            }`}
          >
            INSCRIPTION
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-sans text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#2596be] ${
                emailError
                  ? 'border-red-500'
                  : 'border-gray-300 focus:border-[#2596be]'
              }`}
              placeholder="votre@email.com"
              required
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-sans text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
              placeholder="••••••••"
              required
            />
          </div>

          {activeTab === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-sans text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {activeTab === 'login' && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[#2596be] underline hover:text-[#1e7a9e] transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#2596be] text-white py-3 px-6 rounded-lg font-serif text-lg font-bold hover:bg-[#1e7a9e] transition-colors"
          >
            {activeTab === 'login' ? 'SE CONNECTER' : "S'INSCRIRE"}
          </button>
        </form>
      </div>
    </div>
  );
}








'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

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

  const translateError = (errorMessage: string): string => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Email ou mot de passe incorrect';
    }
    if (errorMessage.includes('User already registered')) {
      return 'Cet email est déjà utilisé';
    }
    if (errorMessage.includes('Password should be at least 6 characters')) {
      return 'Minimum 6 caractères';
    }
    return errorMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (activeTab === 'register' && password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      if (activeTab === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(translateError(signInError.message));
        } else {
          router.push('/fr');
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(translateError(signUpError.message));
        } else {
          setSuccessMessage('Inscription réussie ! Vous pouvez maintenant vous connecter.');
          setActiveTab('login');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center pt-24 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-none overflow-hidden border border-[#D4AF37]/20">
        {/* Titre KHASHIKA */}
        <div className="text-center py-6 border-b border-[#D4AF37]/20">
          <h1 className="font-serif text-3xl font-bold text-[#2596be]">KHASHIKA</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#D4AF37]/20">
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

        {/* Messages d'erreur et succès */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-none">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-none">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

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
              className={`w-full px-4 py-3 rounded-none border transition-colors focus:outline-none focus:ring-2 focus:ring-[#2596be] ${
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
              className="w-full px-4 py-3 rounded-none border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
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
                className="w-full px-4 py-3 rounded-none border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-[#2596be]"
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
            disabled={loading}
            className="w-full bg-[#2596be] text-white py-3 px-6 rounded-none font-serif text-lg font-bold hover:bg-[#1e7a9a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : activeTab === 'login' ? 'SE CONNECTER' : "S'INSCRIRE"}
          </button>
        </form>
      </div>
    </div>
  );
}








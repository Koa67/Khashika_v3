'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/db/supabase';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Lire le query param ?tab=register
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

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
    <div className="min-h-screen bg-white flex items-center justify-center pt-24 px-4">
      <div className="w-full max-w-md bg-[#FAF9F7] border border-[#EAB615]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.15)] p-8">
        {/* Tabs */}
        <div className="flex border-b border-[#EAB615]/20 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-medium text-[#2D2926]/60 border-b-2 border-transparent transition-colors rounded-none ${
              activeTab === 'login'
                ? 'text-gold-fusion border-[#EAB615]'
                : ''
            }`}
          >
            CONNEXION
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm font-medium text-[#2D2926]/60 border-b-2 border-transparent transition-colors rounded-none ${
              activeTab === 'register'
                ? 'text-gold-fusion border-[#EAB615]'
                : ''
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-sans text-[#2D2926] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-3 rounded-none border transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B4E4E] ${
                emailError
                  ? 'border-red-500'
                  : 'border-[#EAB615]/40 focus:border-[#EAB615]'
              }`}
              placeholder="votre@email.com"
              required
            />
            {emailError && (
              <p className="mt-1 text-sm text-red-500">{emailError}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-sans text-[#2D2926] mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#EAB615]/40 rounded-none text-[#2D2926] transition-colors focus:outline-none focus:border-[#EAB615]"
              placeholder="••••••••"
              required
            />
          </div>

          {activeTab === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-sans text-[#2D2926] mb-2">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#EAB615]/40 rounded-none text-[#2D2926] transition-colors focus:outline-none focus:border-[#EAB615]"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {activeTab === 'login' && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[#8B4E4E] underline hover:text-[#1e7a9e] transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8B4E4E] text-white font-medium rounded-none hover:bg-[#6B3D3D] transition-colors"
          >
            {loading ? 'Chargement...' : activeTab === 'login' ? 'SE CONNECTER' : "S'INSCRIRE"}
          </button>
        </form>
      </div>
    </div>
  );
}








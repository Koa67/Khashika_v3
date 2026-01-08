'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/db/supabase-client';

const supabase = createClientSupabaseClient();

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

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/fr`,
        },
      });
      if (error) {
        setError('Erreur de connexion Google');
      }
    } catch (err) {
      setError('Erreur de connexion Google');
    } finally {
      setLoading(false);
    }
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
          setSuccessMessage('Inscription réussie ! Vérifiez votre email.');
          setActiveTab('login');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err) {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#EAB615]/30 shadow-lg p-8">
        <div className="text-center mb-8">
          <Link href="/fr" className="inline-block">
            <h1 className="font-serif text-3xl text-[#2D2926]">Khashika</h1>
          </Link>
          <p className="text-sm text-[#2D2926]/60 mt-2">Bijoux artisanaux d&apos;Inde et du Tibet</p>
        </div>

        <div className="flex border-b border-[#EAB615]/30 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-[#8B4E4E] border-b-2 border-[#8B4E4E]'
                : 'text-[#2D2926]/60 hover:text-[#2D2926]'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-[#8B4E4E] border-b-2 border-[#8B4E4E]'
                : 'text-[#2D2926]/60 hover:text-[#2D2926]'
            }`}
          >
            Inscription
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-white border border-[#EAB615]/40 text-[#2D2926] font-medium hover:border-[#EAB615] hover:bg-[#FAF9F7] transition-colors flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuer avec Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EAB615]/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-[#2D2926]/60">ou par email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-[#2D2926] mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-3 border transition-colors focus:outline-none ${
                emailError ? 'border-red-500' : 'border-[#EAB615]/40 focus:border-[#EAB615]'
              }`}
              placeholder="votre@email.com"
              required
            />
            {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-[#2D2926] mb-2">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#EAB615]/40 focus:border-[#EAB615] focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {activeTab === 'register' && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm text-[#2D2926] mb-2">Confirmer</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#EAB615]/40 focus:border-[#EAB615] focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {activeTab === 'login' && (
            <div className="text-right">
              <Link href="/fr/contact" className="text-sm text-[#8B4E4E] underline hover:text-[#6B3D3D]">
                Mot de passe oublié ?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#8B4E4E] text-white font-medium hover:bg-[#6B3D3D] transition-colors"
          >
            {loading ? 'Chargement...' : activeTab === 'login' ? 'SE CONNECTER' : "S'INSCRIRE"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/fr/shop" className="text-sm text-[#2D2926]/60 hover:text-[#8B4E4E]">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}

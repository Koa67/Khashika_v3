'use client';
import { Fragment, useState, useEffect } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link } from '@/navigation';
import { createClientSupabaseClient } from '@/lib/db/supabase-client';

const supabase = createClientSupabaseClient();

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginDrawer({ isOpen, onClose }: LoginDrawerProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('login');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setErrors({});
      setSuccessMessage('');
      setPasswordStrength(null);
      setRegisteredEmail('');
    }
  }, [isOpen]);

  // Validate password strength
  const validatePassword = (pwd: string): 'weak' | 'medium' | 'strong' => {
    const hasMinLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    const score = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
  };

  // Update password strength on password change
  useEffect(() => {
    if (activeTab === 'register' && password) {
      setPasswordStrength(validatePassword(password));
    } else {
      setPasswordStrength(null);
    }
  }, [password, activeTab]);

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Translate Supabase errors to French
  const translateError = (errorMessage: string): string => {
    if (errorMessage.includes('User already registered') || errorMessage.includes('already registered')) {
      return 'Cette adresse email est déjà associée à un compte';
    }
    if (errorMessage.includes('Password should be at least') || errorMessage.includes('Password')) {
      return 'Le mot de passe ne respecte pas les critères de sécurité';
    }
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Email ou mot de passe incorrect';
    }
    if (errorMessage.includes('Email not confirmed')) {
      return 'Veuillez vérifier votre email avant de vous connecter';
    }
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Erreur de connexion. Veuillez réessayer.';
    }
    return errorMessage;
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/fr/auth/callback`,
        },
      });
      if (error) {
        setErrors({ form: translateError(error.message) });
      }
    } catch {
      setErrors({ form: 'Erreur de connexion Google. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      if (activeTab === 'login') {
        // Login
        if (!email || !password) {
          setErrors({ form: 'Veuillez remplir tous les champs' });
          setIsLoading(false);
          return;
        }

        if (!validateEmail(email)) {
          setErrors({ email: 'Veuillez entrer une adresse email valide' });
          setIsLoading(false);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrors({ form: translateError(error.message) });
        } else {
          onClose();
          // Reset form
          setEmail('');
          setPassword('');
        }
      } else {
        // Registration
        if (!name || !email || !password || !confirmPassword) {
          setErrors({ form: 'Veuillez remplir tous les champs' });
          setIsLoading(false);
          return;
        }

        if (!validateEmail(email)) {
          setErrors({ email: 'Veuillez entrer une adresse email valide' });
          setIsLoading(false);
          return;
        }

        // Validate password strength
        const strength = validatePassword(password);
        if (strength === 'weak') {
          setErrors({ password: 'Le mot de passe ne respecte pas les critères de sécurité' });
          setIsLoading(false);
          return;
        }

        // Check password match
        if (password !== confirmPassword) {
          setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
          setIsLoading(false);
          return;
        }

        // Sign up with Supabase
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/fr/auth/confirm`,
            data: {
              full_name: name,
            }
          }
        });

        if (signUpError) {
          setErrors({ form: translateError(signUpError.message) });
        } else {
          setRegisteredEmail(email);
          setSuccessMessage('email');
          // Reset form
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setName('');
        }
      }
    } catch (err) {
      setErrors({ form: 'Erreur de connexion. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-[#FDFCFB] shadow-xl">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-[#EAB615]/20 bg-gradient-to-r from-[#F4EAD8]/50 to-transparent">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="font-serif text-xl text-[#2D2926]">
                          {activeTab === 'login' ? 'Connexion' : 'Créer un compte'}
                        </Dialog.Title>
                        <button
                          onClick={onClose}
                          className="p-2 hover:bg-[#EAB615]/10 rounded-full transition-colors"
                       >
                          <X className="w-5 h-5 text-[#2D2926]" />
                        </button>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-[#EAB615]/20">
                      <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${
                          activeTab === 'login'
                            ? 'text-[#2596be] border-b-2 border-[#2596be]'
                            : 'text-[#2D2926]/60 hover:text-[#2D2926]'
                        }`}
                      >
                        Se connecter
                      </button>
                      <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${
                          activeTab === 'register'
                            ? 'text-[#2596be] border-b-2 border-[#2596be]'
                            : 'text-[#2D2926]/60 hover:text-[#2D2926]'
                        }`}
                      >
                        Créer un compte
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                      {successMessage === 'email' ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="font-serif text-xl text-[#2D2926] mb-2">Vérifiez votre email</h3>
                          <p className="text-[#2D2926]/70 mb-6">
                            Un email de confirmation a été envoyé à <strong>{registeredEmail}</strong>.<br />
                            Cliquez sur le lien pour activer votre compte.
                          </p>
                          <button
                            onClick={() => {
                              setSuccessMessage('');
                              setActiveTab('login');
                            }}
                            className="text-sm text-[#2596be] hover:text-[#1e7a9a] transition-colors"
                          >
                            Retour à la connexion
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          {/* Error message */}
                          {errors.form && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-none text-sm text-red-700">
                              {errors.form}
                            </div>
                          )}

                          {activeTab === 'register' && (
                            <div>
                              <label className="block text-sm font-medium text-[#2D2926] mb-2">
                                Nom complet
                              </label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2926]/40" />
                                <input
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  placeholder="Votre nom"
                                  className={`w-full pl-11 pr-4 py-3 border rounded-none bg-white focus:outline-none focus:ring-1 transition-colors ${
                                    errors.name
                                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                      : 'border-[#EAB615]/30 focus:border-[#2596be] focus:ring-[#2596be]'
                                  }`}
                                  required={activeTab === 'register'}
                                />
                              </div>
                              {errors.name && (
                                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                              )}
                            </div>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-[#2D2926] mb-2">
                              Adresse e-mail
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2926]/40" />
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                className={`w-full pl-11 pr-4 py-3 border rounded-none bg-white focus:outline-none focus:ring-1 transition-colors ${
                                  errors.email
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-[#EAB615]/30 focus:border-[#2596be] focus:ring-[#2596be]'
                                }`}
                                required
                              />
                            </div>
                            {errors.email && (
                              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#2D2926] mb-2">
                              Mot de passe
                            </label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2926]/40" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full pl-11 pr-12 py-3 border rounded-none bg-white focus:outline-none focus:ring-1 transition-colors ${
                                  errors.password
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                    : 'border-[#EAB615]/30 focus:border-[#2596be] focus:ring-[#2596be]'
                                }`}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#EAB615]/10 rounded-full transition-colors"
                              >
                                {showPassword ? (
                                  <EyeOff className="w-5 h-5 text-[#2D2926]/40" />
                                ) : (
                                  <Eye className="w-5 h-5 text-[#2D2926]/40" />
                                )}
                              </button>
                            </div>
                            {errors.password && (
                              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                            )}
                            {/* Password strength indicator */}
                            {activeTab === 'register' && password && (
                              <div className="mt-2">
                                <div className="flex gap-1 mb-1">
                                  <div className={`h-1 flex-1 rounded ${
                                    passwordStrength === 'weak' ? 'bg-red-500' : 
                                    passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-green-500' : 
                                    'bg-gray-200'
                                  }`} />
                                  <div className={`h-1 flex-1 rounded ${
                                    passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                                  }`} />
                                  <div className={`h-1 flex-1 rounded ${
                                    passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                                  }`} />
                                </div>
                                <p className="text-xs text-[#2D2926]/60">
                                  {passwordStrength === 'weak' && 'Mot de passe faible'}
                                  {passwordStrength === 'medium' && 'Mot de passe moyen'}
                                  {passwordStrength === 'strong' && 'Mot de passe fort'}
                                </p>
                                {activeTab === 'register' && (
                                  <p className="text-xs text-[#2D2926]/50 mt-1">
                                    Minimum 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {activeTab === 'register' && (
                            <div>
                              <label className="block text-sm font-medium text-[#2D2926] mb-2">
                                Confirmer le mot de passe
                              </label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D2926]/40" />
                                <input
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className={`w-full pl-11 pr-12 py-3 border rounded-none bg-white focus:outline-none focus:ring-1 transition-colors ${
                                    errors.confirmPassword
                                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                      : 'border-[#EAB615]/30 focus:border-[#2596be] focus:ring-[#2596be]'
                                  }`}
                                  required={activeTab === 'register'}
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#EAB615]/10 rounded-full transition-colors"
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="w-5 h-5 text-[#2D2926]/40" />
                                  ) : (
                                    <Eye className="w-5 h-5 text-[#2D2926]/40" />
                                  )}
                                </button>
                              </div>
                              {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                              )}
                            </div>
                          )}

                          {activeTab === 'login' && (
                            <div className="text-right">
                              <button
                                type="button"
                                className="text-sm text-[#2596be] hover:text-[#1e7a9a] transition-colors"
                              >
                                Mot de passe oublié ?
                              </button>
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#2596be] hover:bg-[#1e7a9a] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Chargement...
                              </span>
                            ) : activeTab === 'login' ? (
                              'Se connecter'
                            ) : (
                              'Créer mon compte'
                            )}
                          </button>
                        </form>
                      )}

                      {/* Divider */}
                      <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#EAB615]/20" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-[#FDFCFB] text-[#2D2926]/50">ou</span>
                        </div>
                      </div>

                      {/* Social Login */}
                      <div className="space-y-3">
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          disabled={isLoading}
                          className="w-full py-3 border border-[#EAB615]/30 hover:border-[#EAB615] hover:bg-[#EAB615]/5 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          Continuer avec Google
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-[#EAB615]/20 bg-[#F4EAD8]/30">
                      <p className="text-xs text-[#2D2926]/60 text-center">
                        En continuant, vous acceptez nos{' '}
                        <Link href="/fr/cgv" className="text-[#2596be] hover:underline">
                          CGV
                        </Link>{' '}
                        et notre{' '}
                        <Link href="/fr/confidentialite" className="text-[#2596be] hover:underline">
                          politique de confidentialité
                        </Link>
                      </p>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

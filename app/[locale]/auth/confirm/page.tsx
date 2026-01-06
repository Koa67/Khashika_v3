'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/db/supabase-client';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const supabase = createClientSupabaseClient();

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Supabase automatically handles email confirmation via URL hash
        // Check if we have a session (user is already confirmed)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (session && !sessionError) {
          setStatus('success');
          return;
        }

        // Check URL hash for confirmation tokens
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (accessToken && type === 'signup') {
          // Supabase handles this automatically, just check session again
          setTimeout(async () => {
            const { data: { session: newSession } } = await supabase.auth.getSession();
            if (newSession) {
              setStatus('success');
            } else {
              setStatus('error');
              setErrorMessage('Token de confirmation invalide ou expiré');
            }
          }, 1000);
        } else {
          // No token in hash, check if user is already logged in
          if (session) {
            setStatus('success');
          } else {
            setStatus('error');
            setErrorMessage('Token de confirmation invalide ou expiré');
          }
        }
      } catch (err) {
        // Check if user is already confirmed
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage('Erreur lors de la confirmation. Veuillez réessayer.');
        }
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#EAB615]/30 shadow-lg p-8 text-center">
        <div className="mb-6">
          <Link href="/fr" className="inline-block">
            <h1 className="font-serif text-3xl text-[#2D2926]">Khashika</h1>
          </Link>
          <p className="text-sm text-[#2D2926]/60 mt-2">Bijoux artisanaux d&apos;Inde et du Tibet</p>
        </div>

        {status === 'loading' && (
          <div className="py-8">
            <Loader2 className="w-16 h-16 text-[#2596be] animate-spin mx-auto mb-4" />
            <h2 className="font-serif text-xl text-[#2D2926] mb-2">Vérification en cours...</h2>
            <p className="text-[#2D2926]/70">Veuillez patienter pendant que nous confirmons votre email.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="font-serif text-xl text-[#2D2926] mb-2">Email confirmé avec succès !</h2>
            <p className="text-[#2D2926]/70 mb-6">
              Votre compte a été activé. Vous pouvez maintenant vous connecter.
            </p>
            <Link
              href="/fr"
              className="inline-block px-6 py-3 bg-[#2596be] hover:bg-[#1e7a9a] text-white font-medium transition-colors"
            >
              Accéder à mon compte
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="py-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="font-serif text-xl text-[#2D2926] mb-2">Erreur de confirmation</h2>
            <p className="text-[#2D2926]/70 mb-6">
              {errorMessage || 'Le lien de confirmation est invalide ou a expiré.'}
            </p>
            <div className="space-y-3">
              <Link
                href="/fr/login"
                className="inline-block px-6 py-3 bg-[#2596be] hover:bg-[#1e7a9a] text-white font-medium transition-colors"
              >
                Retour à la connexion
              </Link>
              <p className="text-sm text-[#2D2926]/60">
                Si le problème persiste, contactez notre{' '}
                <Link href="/fr/contact" className="text-[#2596be] hover:underline">
                  support client
                </Link>
                .
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


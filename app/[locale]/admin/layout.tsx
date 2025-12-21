import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Récupérer les cookies pour l'authentification
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;

  // Si pas de token, rediriger vers login
  if (!accessToken) {
    redirect('/login');
  }

  // Créer le client Supabase avec les tokens
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // En dev, rediriger si Supabase n'est pas configuré
    console.warn('Supabase not configured, redirecting from admin');
    redirect('/');
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  // Vérifier l'authentification
  const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    redirect('/login');
  }

  // Vérifier le rôle dans la table profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}












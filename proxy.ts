import createMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './navigation';

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Créer une réponse initiale via next-intl
  let response = intlMiddleware(request);
  
  // Si next-intl a créé une redirection, la retourner directement
  if (response.status === 307 || response.status === 308) {
    return response;
  }

  // Créer le client Supabase pour rafraîchir la session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Rafraîchir la session (important pour garder l'utilisateur connecté)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protection des routes admin
  const pathname = request.nextUrl.pathname;
  if (pathname.includes('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/fr/login';
      return NextResponse.redirect(url);
    }

    // Vérifier le rôle admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/fr';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/'
  ]
};

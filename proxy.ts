import createMiddleware from 'next-intl/middleware';
import type {NextRequest} from 'next/server';
import {routing} from './navigation';

const intlProxy = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  return intlProxy(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes (/api)
  // - Next.js internals (/_next)
  // - Static files (files with extensions like .ico, .png, .svg, etc.)
  matcher: [
    // Match all paths except static files and API
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Also match root
    '/'
  ]
};

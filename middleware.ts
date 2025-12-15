import createMiddleware from 'next-intl/middleware';
import {routing} from './navigation';

export default createMiddleware(routing);

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

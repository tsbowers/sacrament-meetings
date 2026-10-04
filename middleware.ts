// Next.js 16 has renamed this file convention to proxy.ts (middleware.ts still
// works but is deprecated). To silence the warning, rename this file to
// proxy.ts -- the contents stay exactly the same.
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Run on all routes except API routes, static files, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', // use our own login page instead of the Auth.js default
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      // Owner-only management routes. The (admin) route group does not show
      // up in the URL, so these are the real paths:
      //   /meetings/new           (create a meeting)
      //   /meetings/[id]/edit     (edit a meeting)
      const isProtected =
        pathname === '/meetings/new' || /^\/meetings\/[^/]+\/edit$/.test(pathname);

      if (isProtected) {
        if (isLoggedIn) return true;
        return false; // redirects to /login
      }

      // Redirect already-logged-in users away from the login page
      if (isLoggedIn && pathname === '/login') {
        return Response.redirect(new URL('/meetings', nextUrl));
      }

      return true;
    },
  },
  providers: [], // providers are added in auth.ts
} satisfies NextAuthConfig;

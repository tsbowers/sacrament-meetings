import type { Metadata } from 'next';
import { LoginForm } from '@/components/login-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Owner sign in for managing sacrament meetings.',
};

export default function LoginPage() {
  // The root layout already provides the <main> landmark, so use a <div> here.
  return (
    <div className="mx-auto w-full max-w-sm px-6 py-8">
      <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
        Sign In
      </h1>
      <LoginForm />
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";

const inputClass =
  "mt-1 w-full rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-black dark:border-white/20 dark:bg-black dark:text-zinc-50";

export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      {/* After a successful login, land on the meetings list. */}
      <input type="hidden" name="redirectTo" value="/meetings" />

      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          minLength={6}
          required
          className={inputClass}
        />
      </div>
      <button
        aria-disabled={isPending}
        type="submit"
        className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:opacity-90 aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
      {errorMessage && (
        <p
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
}

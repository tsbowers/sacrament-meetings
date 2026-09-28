"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Shared fallback rendered by the meetings error.tsx boundaries.
 * Accepts the error/reset props from Next.js and offers a retry plus a
 * link back to /meetings.
 */
export default function MeetingsErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the real error in the console for debugging.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        We couldn&rsquo;t load or save this meeting right now. Please try
        again.
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
          Error reference: <code>{error.digest}</code>
        </p>
      )}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="rounded-full border border-black/10 px-6 py-2 text-sm font-medium hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
        >
          Back to All Meetings
        </Link>
      </div>
    </div>
  );
}
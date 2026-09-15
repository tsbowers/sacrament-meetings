import type { ReactNode } from "react";
import Link from "next/link";

export default function MeetingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <nav aria-label="Meetings" className="mb-6 flex gap-4 text-sm">
        <Link
          href="/meetings"
          className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          All Meetings
        </Link>
        <Link
          href="/meetings/current"
          className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Jump to This Sunday
        </Link>
      </nav>
      {children}
    </div>
  );
}

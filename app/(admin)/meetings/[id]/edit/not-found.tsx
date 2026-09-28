import Link from "next/link";

export default function EditMeetingNotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        Meeting not found
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        That meeting doesn&rsquo;t exist — it may have been deleted.
      </p>
      <Link
        href="/meetings"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
      >
        Back to all meetings
      </Link>
    </div>
  );
}
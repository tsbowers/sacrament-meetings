import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-16 text-center">
      <Image
        src="/meetinghouse.svg"
        alt="Line drawing of the ward meetinghouse"
        width={640}
        height={360}
        priority
        className="w-full max-w-md rounded-lg"
      />

      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Sacrament Meeting Planner
        </h1>
        <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
          Look up this Sunday&rsquo;s program, browse past and upcoming
          meetings, or print a copy of the agenda for the chapel foyer.
        </p>
      </div>

      <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
        <Link
          href="/meetings/current"
          className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          This Sunday&rsquo;s Meeting
        </Link>
        <Link
          href="/meetings"
          className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          View All Meetings
        </Link>
      </div>
    </div>
  );
}

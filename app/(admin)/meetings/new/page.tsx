import Link from "next/link";
import { createMeeting } from "@/lib/actions";
import MeetingForm from "@/components/MeetingForm";

export default function NewMeetingPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <nav aria-label="Meetings" className="mb-6 text-sm">
        <Link
          href="/meetings"
          className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          &larr; Back to all meetings
        </Link>
      </nav>

      <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
        Create a Meeting
      </h1>

      <MeetingForm action={createMeeting} submitLabel="Create Meeting" />
    </div>
  );
}
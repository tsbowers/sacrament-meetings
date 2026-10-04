import Link from "next/link";
import { deleteMeeting } from "@/lib/actions";
import type { SacramentMeeting } from "@/lib/types";
import { MEETING_TYPE_LABELS } from "@/lib/types";

export default function MeetingCard({
  meeting,
  isOwner = false,
}: {
  meeting: SacramentMeeting;
  isOwner?: boolean;
}) {
  const formattedDate = new Date(meeting.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const speakers = meeting.speakers.filter((s) => s.type === "speaker");

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10">
      <Link
        href={`/meetings/${meeting.id}`}
        className="block p-4 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.04]"
      >
        <p className="font-medium text-black dark:text-zinc-50">
          {formattedDate}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {MEETING_TYPE_LABELS[meeting.meetingType]} &middot; Presiding:{" "}
          {meeting.presiding}
        </p>
        {speakers.length > 0 && (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Speaker{speakers.length > 1 ? "s" : ""}:{" "}
            {speakers.map((s) => s.name).join(", ")}
          </p>
        )}
      </Link>

      {isOwner && (
      <div className="flex items-center gap-4 border-t border-black/10 px-4 py-2 text-sm dark:border-white/10">
        <Link
          href={`/meetings/${meeting.id}/edit`}
          aria-label={`Edit the meeting on ${formattedDate}`}
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Edit
        </Link>
        <form action={deleteMeeting}>
          <input type="hidden" name="id" value={meeting.id} />
          <button
            type="submit"
            aria-label={`Delete the meeting on ${formattedDate}`}
            className="text-red-600 hover:underline dark:text-red-400"
          >
            Delete
          </button>
        </form>
      </div>
      )}
    </div>
  );
}
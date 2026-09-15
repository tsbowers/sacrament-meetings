import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";
import { MEETING_TYPE_LABELS } from "@/lib/types";

export default function MeetingCard({ meeting }: { meeting: SacramentMeeting }) {
  const formattedDate = new Date(meeting.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const speakers = meeting.speakers.filter((s) => s.type === "speaker");

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="block rounded-lg border border-black/10 p-4 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
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
  );
}

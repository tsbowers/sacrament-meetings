import Link from "next/link";
import type { MeetingSummary } from "@/lib/types";

export default function MeetingCard({ meeting }: { meeting: MeetingSummary }) {
  const formattedDate = new Date(meeting.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      className="block rounded-lg border border-black/10 p-4 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
    >
      <p className="font-medium text-black dark:text-zinc-50">
        {formattedDate}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Presiding: {meeting.presiding}
      </p>
      {meeting.speakers.length > 0 && (
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Speaker{meeting.speakers.length > 1 ? "s" : ""}:{" "}
          {meeting.speakers
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s) => s.name)
            .join(", ")}
        </p>
      )}
    </Link>
  );
}

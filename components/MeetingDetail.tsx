"use client";

import type { Meeting } from "@/lib/types";

function hymnsByType(meeting: Meeting, type: Meeting["hymns"][number]["type"]) {
  return meeting.hymns.filter((h) => h.type === type);
}

export default function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const formattedDate = new Date(meeting.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const orderedSpeakers = meeting.speakers
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <article className="mx-auto max-w-2xl space-y-6 print:max-w-none">
      <header className="space-y-1 text-center">
        {/* TODO: swap in the real ward name once Header's config lands */}
        <h1 className="text-xl font-semibold">Sacrament Meeting</h1>
        <p className="text-zinc-600 dark:text-zinc-400 print:text-black">
          {formattedDate}
        </p>
      </header>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section>
          <h2 className="font-medium">Announcements</h2>
          <ul className="list-inside list-disc text-sm text-zinc-700 dark:text-zinc-300 print:text-black">
            {meeting.announcements.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <p>
          <span className="font-medium">Presiding:</span> {meeting.presiding}
        </p>
        <p>
          <span className="font-medium">Conducting:</span>{" "}
          {meeting.conducting}
        </p>
        {meeting.chorister && (
          <p>
            <span className="font-medium">Chorister:</span>{" "}
            {meeting.chorister}
          </p>
        )}
        {meeting.organist && (
          <p>
            <span className="font-medium">Organist:</span> {meeting.organist}
          </p>
        )}
      </section>

      <section className="space-y-2 text-sm">
        {hymnsByType(meeting, "opening").map((hymn) => (
          <p key={hymn.number}>
            <span className="font-medium">Opening Hymn:</span> #{hymn.number}{" "}
            {hymn.title}
          </p>
        ))}
        {meeting.invocation && (
          <p>
            <span className="font-medium">Invocation:</span>{" "}
            {meeting.invocation}
          </p>
        )}
        {hymnsByType(meeting, "sacrament").map((hymn) => (
          <p key={hymn.number}>
            <span className="font-medium">Sacrament Hymn:</span> #
            {hymn.number} {hymn.title}
          </p>
        ))}
      </section>

      {orderedSpeakers.length > 0 && (
        <section className="space-y-1 text-sm">
          <h2 className="font-medium">Speakers</h2>
          {orderedSpeakers.map((speaker) => (
            <p key={speaker.order}>
              {speaker.order}. {speaker.name}
              {speaker.topic ? ` — ${speaker.topic}` : ""}
            </p>
          ))}
        </section>
      )}

      <section className="space-y-2 text-sm">
        {hymnsByType(meeting, "rest").map((hymn) => (
          <p key={hymn.number}>
            <span className="font-medium">Intermediate Hymn:</span> #
            {hymn.number} {hymn.title}
          </p>
        ))}
        {hymnsByType(meeting, "closing").map((hymn) => (
          <p key={hymn.number}>
            <span className="font-medium">Closing Hymn:</span> #{hymn.number}{" "}
            {hymn.title}
          </p>
        ))}
        {meeting.benediction && (
          <p>
            <span className="font-medium">Benediction:</span>{" "}
            {meeting.benediction}
          </p>
        )}
      </section>

      {/* Hidden on the printed page itself */}
      <div className="pt-4 text-center print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:border-white/10 dark:hover:bg-white/[.08]"
        >
          Print
        </button>
      </div>
    </article>
  );
}

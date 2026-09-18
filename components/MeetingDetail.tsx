"use client";

import type { SacramentMeeting } from "@/lib/types";
import { MEETING_TYPE_LABELS } from "@/lib/types";

export default function MeetingDetail({ meeting }: { meeting: SacramentMeeting }) {
  const formattedDate = new Date(meeting.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const speakers = meeting.speakers.filter((s) => s.type === "speaker");
  const musicalNumbers = meeting.speakers.filter(
    (s) => s.type === "musical-number"
  );

  return (
    <article className="mx-auto max-w-2xl space-y-6 print:max-w-none">
      <header className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">
          {MEETING_TYPE_LABELS[meeting.meetingType]}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 print:text-black">
          {formattedDate}
        </p>
      </header>

      {meeting.announcements && meeting.announcements.length > 0 && (
        <section aria-labelledby="announcements-heading">
          <h2 id="announcements-heading" className="font-medium">
            Announcements
          </h2>
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
      </section>

      {(meeting.wardBusiness.length > 0 || meeting.stakeBusiness) && (
        <section aria-labelledby="business-heading" className="text-sm">
          <h2 id="business-heading" className="font-medium">
            Ward &amp; Stake Business
          </h2>

          {meeting.stakeBusiness && (
            <p className="text-zinc-700 dark:text-zinc-300 print:text-black">
              Stake business will be conducted.
            </p>
          )}

          {meeting.wardBusiness.length > 0 && (
            <ul className="list-inside list-disc text-zinc-700 dark:text-zinc-300 print:text-black">
              {meeting.wardBusiness.map((item, i) => (
                <li key={i}>{item.description}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="space-y-2 text-sm">
        {meeting.openingHymn && (
          <p>
            <span className="font-medium">Opening Hymn:</span> #
            {meeting.openingHymn.number} {meeting.openingHymn.title}
          </p>
        )}

        {meeting.openingPrayer && (
          <p>
            <span className="font-medium">Invocation:</span>{" "}
            {meeting.openingPrayer}
          </p>
        )}

        {meeting.sacramentHymn && (
          <p>
            <span className="font-medium">Sacrament Hymn:</span> #
            {meeting.sacramentHymn.number} {meeting.sacramentHymn.title}
          </p>
        )}
      </section>

      {(speakers.length > 0 || musicalNumbers.length > 0) && (
        <section
          aria-labelledby="program-heading"
          className="space-y-1 text-sm"
        >
          <h2 id="program-heading" className="font-medium">
            Program
          </h2>

          {meeting.speakers.map((item, i) =>
            item.type === "speaker" ? (
              <p key={i}>
                Speaker: {item.name}
                {item.topic ? ` — ${item.topic}` : ""}
              </p>
            ) : (
              <p key={i}>
                Musical Number: {item.name}
                {item.topic ? ` — ${item.topic}` : ""}
              </p>
            )
          )}
        </section>
      )}

      <section className="space-y-2 text-sm">
        {meeting.closingHymn && (
          <p>
            <span className="font-medium">Closing Hymn:</span> #
            {meeting.closingHymn.number} {meeting.closingHymn.title}
          </p>
        )}

        {meeting.closingPrayer && (
          <p>
            <span className="font-medium">Benediction:</span>{" "}
            {meeting.closingPrayer}
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
          Print this program
        </button>
      </div>
    </article>
  );
}
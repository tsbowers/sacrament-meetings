import type { Meeting } from "./types";

// TEMPORARY: hard-coded data for this week. Swap this module out for a
// real database (or CMS) call later — every function below already
// returns Promises so the call sites won't need to change when that
// happens.

const meetings: Meeting[] = [
  {
    id: "2026-09-13",
    date: "2026-09-13",
    presiding: "Bishop TODO",
    conducting: "Brother TODO",
    chorister: "Sister TODO",
    organist: "Sister TODO",
    invocation: "TODO",
    benediction: "TODO",
    hymns: [
      { number: 1, title: "TODO Opening Hymn", type: "opening" },
      { number: 2, title: "TODO Sacrament Hymn", type: "sacrament" },
      { number: 3, title: "TODO Closing Hymn", type: "closing" },
    ],
    speakers: [{ name: "TODO Speaker", topic: "TODO", order: 1 }],
    announcements: [],
    isPlaceholder: true,
  },
  {
    id: "2026-09-20",
    date: "2026-09-20",
    presiding: "Bishop TODO",
    conducting: "Brother TODO",
    hymns: [
      { number: 4, title: "TODO Opening Hymn", type: "opening" },
      { number: 5, title: "TODO Sacrament Hymn", type: "sacrament" },
      { number: 6, title: "TODO Closing Hymn", type: "closing" },
    ],
    speakers: [
      { name: "TODO Speaker 1", order: 1 },
      { name: "TODO Speaker 2", order: 2 },
    ],
    isPlaceholder: true,
  },
];

export async function getMeetings(): Promise<Meeting[]> {
  return [...meetings].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getMeetingById(id: string): Promise<Meeting | null> {
  return meetings.find((m) => m.id === id) ?? null;
}

/**
 * Returns the meeting for the upcoming (or most recent past) Sunday.
 * TODO: decide the exact rule once real scheduling data exists — this
 * just picks the closest date to "today" by absolute difference.
 */
export async function getCurrentMeeting(): Promise<Meeting | null> {
  if (meetings.length === 0) return null;

  const today = Date.now();
  return meetings.reduce((closest, candidate) => {
    const closestDiff = Math.abs(new Date(closest.date).getTime() - today);
    const candidateDiff = Math.abs(new Date(candidate.date).getTime() - today);
    return candidateDiff < closestDiff ? candidate : closest;
  }, meetings[0]);
}

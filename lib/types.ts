// TODO: this is the shared shape for meeting data. Adjust freely as the
// real agenda fields get nailed down — everything here is a best guess
// based on a typical sacrament meeting program.

export type HymnType = "opening" | "sacrament" | "rest" | "closing";

export interface Hymn {
  number: number;
  title: string;
  type: HymnType;
}

export interface Speaker {
  name: string;
  topic?: string;
  /** Order on the program, 1-indexed. */
  order: number;
}

export interface Meeting {
  id: string;
  /** ISO date string, e.g. "2026-09-14" — should always be a Sunday. */
  date: string;
  presiding: string;
  conducting: string;
  chorister?: string;
  organist?: string;
  invocation?: string;
  benediction?: string;
  hymns: Hymn[];
  speakers: Speaker[];
  /** Free-text announcements shown at the top of the program. */
  announcements?: string[];
  /** True once someone has actually filled this meeting in for real. */
  isPlaceholder?: boolean;
}

// Narrow view used by MeetingCard / the list page — avoids passing the
// full agenda around when only a summary is needed.
export type MeetingSummary = Pick<
  Meeting,
  "id" | "date" | "presiding" | "speakers"
>;

export type MeetingType = "testimony" | "regular" | "stake" | "general";

export interface Hymn {
  number: number;
  title: string;
}

export interface SpeakerItem {
  name: string;
  topic: string;
  type: "speaker" | "musical-number";
}

export interface WardBusinessItem {
  description: string;
}

export interface SacramentMeeting {
  id: number;
  /** ISO date string: 'YYYY-MM-DD' — should always fall on a Sunday. */
  date: string;
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  sacramentHymn: Hymn;
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}

// Human-readable labels for each MeetingType, used by MeetingCard /
// MeetingDetail so the raw union value never leaks into the UI as-is.
export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  testimony: "Fast & Testimony Meeting",
  regular: "Sacrament Meeting",
  stake: "Stake Conference",
  general: "General Conference",
};

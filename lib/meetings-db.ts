import type { SacramentMeeting } from "./types";

// TEMPORARY in-memory data for this week's assignment. Mutation
// functions (add/update/delete) are optional this week and are not
// implemented yet — this module will eventually be swapped for a real
// database call, and getMeetings/getMeetingById are written so the
// call sites in the app and API routes won't need to change when that
// happens.

const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: "2026-08-30",
    meetingType: "testimony",
    presiding: "Bishop Alan Reyes",
    conducting: "Brother Marcus Ellery",
    announcements: [
      "Fast offerings may be dropped off at the bishop's office through Friday.",
    ],
    openingHymn: { number: 4, title: "Truth Eternal" },
    openingPrayer: "Sister Kimball",
    wardBusiness: [
      { description: "Sustaining of Brother Diego Salas as Elders Quorum secretary" },
      { description: "Release of Sister Paula Nakamura as Primary chorister, with thanks" },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: "In Remembrance of Thy Suffering" },
    speakers: [],
    closingHymn: { number: 89, title: "Master, the Tempest Is Raging" },
    closingPrayer: "Brother Okafor",
  },
  {
    id: 2,
    date: "2026-09-06",
    meetingType: "regular",
    presiding: "Bishop Alan Reyes",
    conducting: "Brother Marcus Ellery",
    announcements: ["Ward temple night is Thursday at 7:00 p.m."],
    openingHymn: { number: 2, title: "The Spirit of God" },
    openingPrayer: "Sister Williams",
    wardBusiness: [
      { description: "Sustaining of Sister Renee Ashworth as new Primary president" },
    ],
    stakeBusiness: false,
    sacramentHymn: { number: 193, title: "There Is a Green Hill Far Away" },
    speakers: [
      { name: "Sister Brown", topic: "Faith in Jesus Christ", type: "speaker" },
      { name: "Youth Choir", topic: "\"Come, Thou Fount of Every Blessing\"", type: "musical-number" },
      { name: "Brother Davis", topic: "Enduring to the end", type: "speaker" },
    ],
    closingHymn: { number: 31, title: "O God, Our Help in Ages Past" },
    closingPrayer: "Brother Davis",
  },
  {
    id: 3,
    date: "2026-09-13",
    meetingType: "regular",
    presiding: "Bishop Alan Reyes",
    conducting: "Brother Marcus Ellery",
    announcements: [
      "Combined youth activity Wednesday at 6:30 p.m. in the cultural hall.",
    ],
    openingHymn: { number: 19, title: "We Thank Thee, O God, for a Prophet" },
    openingPrayer: "Brother Chen",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 172, title: "O Lord, I Would Delight in Thee" },
    speakers: [
      { name: "Sister Alvarez", topic: "The Atonement of Jesus Christ", type: "speaker" },
      { name: "Bishop Alan Reyes", topic: "Ministering", type: "speaker" },
    ],
    closingHymn: { number: 219, title: "Let Us All Press On" },
    closingPrayer: "Sister Alvarez",
  },
  {
    id: 4,
    date: "2026-09-20",
    meetingType: "stake",
    presiding: "President Howard Lindqvist",
    conducting: "President Howard Lindqvist",
    announcements: [],
    openingHymn: { number: 1, title: "The Morning Breaks" },
    openingPrayer: "Sister Faleolo",
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 181, title: "Reverently and Meekly Now" },
    speakers: [
      { name: "Stake Choir", topic: "\"How Firm a Foundation\"", type: "musical-number" },
      { name: "Elder Thomas Whitfield", topic: "Area Seventy address", type: "speaker" },
    ],
    closingHymn: { number: 66, title: "Rejoice, the Lord Is King!" },
    closingPrayer: "Brother Faleolo",
  },
  {
    id: 5,
    date: "2026-09-27",
    meetingType: "general",
    presiding: "",
    conducting: "",
    announcements: [
      "No regularly scheduled sacrament meeting — watch or attend General Conference sessions.",
    ],
    openingHymn: {},
    openingPrayer: "",
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: {},
    speakers: [],
    closingHymn: {},
    closingPrayer: "",
  },
];

export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) return meetings.filter((m) => m.date === date);
  return meetings;
}

export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((m) => m.id === id) ?? null;
}

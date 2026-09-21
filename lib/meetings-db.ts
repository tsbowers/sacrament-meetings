import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

const sql = neon(`${process.env.DATABASE_URL}`);

// Maps a snake_case DB row to the app's camelCase SacramentMeeting shape.
function mapRow(row: any): SacramentMeeting {
  return {
    id: row.id,
    date: row.date,
    meetingType: row.meeting_type,
    presiding: row.presiding,
    conducting: row.conducting,
    announcements: row.announcements,
    openingHymn: row.opening_hymn,
    openingPrayer: row.opening_prayer,
    wardBusiness: row.ward_business,
    stakeBusiness: row.stake_business,
    sacramentHymn: row.sacrament_hymn,
    speakers: row.speakers,
    closingHymn: row.closing_hymn,
    closingPrayer: row.closing_prayer,
  };
}

export async function getMeetings(
  date?: string | null
): Promise<SacramentMeeting[]> {
  const rows = date
    ? await sql`
        SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
               presiding, conducting, announcements, opening_hymn,
               opening_prayer, ward_business, stake_business,
               sacrament_hymn, speakers, closing_hymn, closing_prayer
        FROM meetings
        WHERE date = ${date}
        ORDER BY date
      `
    : await sql`
        SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
               presiding, conducting, announcements, opening_hymn,
               opening_prayer, ward_business, stake_business,
               sacrament_hymn, speakers, closing_hymn, closing_prayer
        FROM meetings
        ORDER BY date
      `;

  return rows.map(mapRow);
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
           presiding, conducting, announcements, opening_hymn,
           opening_prayer, ward_business, stake_business,
           sacrament_hymn, speakers, closing_hymn, closing_prayer
    FROM meetings
    WHERE id = ${id}
  `;

  return rows[0] ? mapRow(rows[0]) : null;
}
import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

const sql = neon(`${process.env.DATABASE_URL}`);

export const PAGE_SIZE = 5;

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

export async function getMeetings(options?: {
  date?: string | null;
  query?: string | null;
  page?: number;
}): Promise<{ meetings: SacramentMeeting[]; totalCount: number }> {
  const date = options?.date ?? null;
  const searchTerm = options?.query?.trim() || null;
  const page = options?.page && options.page > 0 ? options.page : 1;
  const offset = (page - 1) * PAGE_SIZE;

  // Exact-date lookup (used by /meetings/current) — no search or pagination needed.
  if (date) {
    const rows = await sql`
      SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
             presiding, conducting, announcements, opening_hymn,
             opening_prayer, ward_business, stake_business,
             sacrament_hymn, speakers, closing_hymn, closing_prayer
      FROM meetings
      WHERE date = ${date}
      ORDER BY date
    `;
    return { meetings: rows.map(mapRow), totalCount: rows.length };
  }

  const likeTerm = searchTerm ? `%${searchTerm}%` : null;

  const rows = likeTerm
    ? await sql`
        SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
               presiding, conducting, announcements, opening_hymn,
               opening_prayer, ward_business, stake_business,
               sacrament_hymn, speakers, closing_hymn, closing_prayer
        FROM meetings
        WHERE presiding ILIKE ${likeTerm}
           OR conducting ILIKE ${likeTerm}
           OR speakers::text ILIKE ${likeTerm}
        ORDER BY date
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `
    : await sql`
        SELECT id, to_char(date, 'YYYY-MM-DD') AS date, meeting_type,
               presiding, conducting, announcements, opening_hymn,
               opening_prayer, ward_business, stake_business,
               sacrament_hymn, speakers, closing_hymn, closing_prayer
        FROM meetings
        ORDER BY date
        LIMIT ${PAGE_SIZE} OFFSET ${offset}
      `;

  const countRows = likeTerm
    ? await sql`
        SELECT COUNT(*)::int AS count
        FROM meetings
        WHERE presiding ILIKE ${likeTerm}
           OR conducting ILIKE ${likeTerm}
           OR speakers::text ILIKE ${likeTerm}
      `
    : await sql`SELECT COUNT(*)::int AS count FROM meetings`;

  return { meetings: rows.map(mapRow), totalCount: countRows[0].count };
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
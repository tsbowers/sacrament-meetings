import { neon } from "@neondatabase/serverless";
import type { SacramentMeeting } from "./types";

const sql = neon(`${process.env.DATABASE_URL}`);

export const PAGE_SIZE = 5;

/**
 * Input shape for creating/updating a meeting — everything except the
 * database-generated id.
 */
export type MeetingInput = Omit<SacramentMeeting, "id">;

// Structured columns (announcements, hymns, ward_business, speakers) are
// passed as JSON text via JSON.stringify(). Postgres accepts JSON text for
// jsonb columns, and JSON array syntax is also valid array-literal syntax
// for text[] columns of strings, so the same statements work either way.

function mapRow(row: Record<string, unknown>): SacramentMeeting {
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
  } as SacramentMeeting;
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

export async function createMeeting(input: MeetingInput): Promise<number> {
  const rows = await sql`
    INSERT INTO meetings (date, meeting_type, presiding, conducting,
      announcements, opening_hymn, opening_prayer, ward_business,
      stake_business, sacrament_hymn, speakers, closing_hymn, closing_prayer)
    VALUES (${input.date}, ${input.meetingType}, ${input.presiding},
      ${input.conducting}, ${JSON.stringify(input.announcements)},
      ${JSON.stringify(input.openingHymn)}, ${input.openingPrayer},
      ${JSON.stringify(input.wardBusiness)}, ${input.stakeBusiness},
      ${JSON.stringify(input.sacramentHymn)}, ${JSON.stringify(input.speakers)},
      ${JSON.stringify(input.closingHymn)}, ${input.closingPrayer})
    RETURNING id
  `;
  return Number(rows[0].id);
}

export async function updateMeeting(
  id: number,
  input: MeetingInput
): Promise<void> {
  const rows = await sql`
    UPDATE meetings SET
      date = ${input.date},
      meeting_type = ${input.meetingType},
      presiding = ${input.presiding},
      conducting = ${input.conducting},
      announcements = ${JSON.stringify(input.announcements)},
      opening_hymn = ${JSON.stringify(input.openingHymn)},
      opening_prayer = ${input.openingPrayer},
      ward_business = ${JSON.stringify(input.wardBusiness)},
      stake_business = ${input.stakeBusiness},
      sacrament_hymn = ${JSON.stringify(input.sacramentHymn)},
      speakers = ${JSON.stringify(input.speakers)},
      closing_hymn = ${JSON.stringify(input.closingHymn)},
      closing_prayer = ${input.closingPrayer}
    WHERE id = ${id}
    RETURNING id
  `;

  if (rows.length === 0) {
    throw new Error(`No meeting found with id ${id}.`);
  }
}

export async function deleteMeeting(id: number): Promise<void> {
  const rows = await sql`
    DELETE FROM meetings
    WHERE id = ${id}
    RETURNING id
  `;

  if (rows.length === 0) {
    throw new Error(`No meeting found with id ${id}.`);
  }
}
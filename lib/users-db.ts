import { neon } from "@neondatabase/serverless";

const sql = neon(`${process.env.DATABASE_URL}`);

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

/** Looks up a user by email for the login form. Returns undefined if none. */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  const rows = await sql`
    SELECT id, name, email, password_hash AS "passwordHash"
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;
  return rows[0] as User | undefined;
}

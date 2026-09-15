import { headers } from "next/headers";

/**
 * Server Components can't fetch a relative URL — `fetch('/api/meetings')`
 * has no origin to resolve against on the server. This reads the
 * incoming request's Host header so the same code works on
 * localhost, a Vercel preview deployment, and production without an
 * env var to keep in sync.
 */
export async function getBaseUrl(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

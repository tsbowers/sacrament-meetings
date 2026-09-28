import { headers } from "next/headers";

/**
 * Server Components can't fetch a relative URL — `fetch('/api/meetings')`
 * has no origin to resolve against on the server. This reads the incoming
 * request's Host header so the same code works on localhost, a LAN
 * address, a Vercel preview deployment, and production without an env
 * var to keep in sync.
 */
export async function getBaseUrl(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const forwardedProto = headerList.get("x-forwarded-proto");

  // Loopback and private-network hosts are plain HTTP (dev server,
  // LAN access). Vercel sets x-forwarded-proto, so trust it first.
  const isPrivateHost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);

  const protocol = forwardedProto ?? (isPrivateHost ? "http" : "https");
  return `${protocol}://${host}`;
}
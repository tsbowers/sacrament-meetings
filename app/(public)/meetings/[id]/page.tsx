import { notFound } from "next/navigation";
import MeetingDetail from "@/components/MeetingDetail";
import { getBaseUrl } from "@/lib/get-base-url";
import type { SacramentMeeting } from "@/lib/types";

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/meetings/${id}`, {
    cache: "no-store",
  });


  // The API route returns 400 for a malformed id and 404 for a
  // well-formed one that doesn't match a meeting — either way there's
  // nothing to render here, so fall through to the not-found page.
  if (!res.ok) {
    notFound();
  }

  const meeting: SacramentMeeting = await res.json();

  return <MeetingDetail meeting={meeting} />;
}

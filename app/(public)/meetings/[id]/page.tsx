import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import MeetingDetail from "@/components/MeetingDetail";
import { getBaseUrl } from "@/lib/get-base-url";
import { getMeetingById } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";
import { MEETING_TYPE_LABELS } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const parsedId = Number(id);

  const notFoundMetadata = {
    title: "Meeting Not Found",
    description: "The requested sacrament meeting could not be found.",
  };

  if (id.trim() === "" || !Number.isInteger(parsedId) || parsedId < 1) {
    return notFoundMetadata;
  }

  const meeting = await getMeetingById(parsedId);
  if (!meeting) return notFoundMetadata;

  const formattedDate = new Date(meeting.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const label = MEETING_TYPE_LABELS[meeting.meetingType];

  return {
    title: `${label} - ${formattedDate}`,
    description: `Program for the ${label.toLowerCase()} on ${formattedDate}. Presiding: ${meeting.presiding}.`,
  };
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = await getBaseUrl();
  const session = await auth();

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

  return (
    <div className="space-y-6">
      <MeetingDetail meeting={meeting} />

      {session?.user && (
        <div className="text-center print:hidden">
          <Link
            href={`/meetings/${meeting.id}/edit`}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            Edit this meeting
          </Link>
        </div>
      )}
    </div>
  );
}
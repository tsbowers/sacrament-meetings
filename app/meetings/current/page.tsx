import { redirect } from "next/navigation";
import { getMeetings } from "@/lib/meetings-db";

// Without this, Next.js sees no dynamic APIs in this page and
// pre-renders it once at build time — "today" would then be frozen as
// whatever date the build happened to run on, and the redirect target
// would never change. This route's whole purpose depends on the real
// current date, so it must be computed per request.
export const dynamic = "force-dynamic";

function mostRecentSundayIso(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) through 6 (Sat)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  return sunday.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export default function CurrentMeetingPage() {
  const sundayIso = mostRecentSundayIso();
  const [meeting] = getMeetings(sundayIso);

  // No meeting scheduled for this Sunday in the data yet — fall back
  // to the full list rather than 404ing on a page the nav links to.
  if (!meeting) {
    redirect("/meetings");
  }

  redirect(`/meetings/${meeting.id}`);
}

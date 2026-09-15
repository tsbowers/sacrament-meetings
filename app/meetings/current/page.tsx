import { notFound, redirect } from "next/navigation";
import { getCurrentMeeting } from "@/lib/meetings-db";

export default async function CurrentMeetingPage() {
  const meeting = await getCurrentMeeting();

  if (!meeting) {
    // TODO: decide on better empty-state handling than a 404 once
    // meetings-db.ts has a real "no meeting scheduled" case.
    notFound();
  }

  redirect(`/meetings/${meeting.id}`);
}

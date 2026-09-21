import { redirect } from "next/navigation";
import { getMeetings } from "@/lib/meetings-db";

export const dynamic = "force-dynamic";

function mostRecentSundayIso(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sun) through 6 (Sat)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  return sunday.toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export default async function CurrentMeetingPage() {
  const sundayIso = mostRecentSundayIso();
  const { meetings } = await getMeetings({ date: sundayIso });
  const [meeting] = meetings;

  if (!meeting) {
    redirect("/meetings");
  }

  redirect(`/meetings/${meeting.id}`);
}
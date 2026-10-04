import { redirect } from "next/navigation";
import { getMeetings } from "@/lib/meetings-db";

export const dynamic = "force-dynamic";

// Today if it's Sunday, otherwise the next upcoming Sunday.
function upcomingSundayIso(): string {
  const today = new Date();
  const daysUntilSunday = (7 - today.getDay()) % 7; // 0 on Sunday
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + daysUntilSunday);

  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, "0");
  const day = String(sunday.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // 'YYYY-MM-DD'
}

export default async function CurrentMeetingPage() {
  const sundayIso = upcomingSundayIso();
  const { meetings } = await getMeetings({ date: sundayIso });
  const [meeting] = meetings;

  if (!meeting) {
    redirect("/meetings");
  }

  redirect(`/meetings/${meeting.id}`);
}
import { getMeetings } from "@/lib/meetings-db";
import MeetingCard from "@/components/MeetingCard";

export default async function MeetingsPage() {
  const meetings = await getMeetings();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        All Meetings
      </h1>

      {meetings.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No meetings yet.
        </p>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
}

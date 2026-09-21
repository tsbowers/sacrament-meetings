import MeetingCard from "@/components/MeetingCard";
import MeetingSearch from "@/components/MeetingSearch";
import Pagination from "@/components/Pagination";
import { getBaseUrl } from "@/lib/get-base-url";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingsResponse {
  meetings: SacramentMeeting[];
  totalPages: number;
}

export default async function MeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  const baseUrl = await getBaseUrl();

  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (page) params.set("page", page);

  const res = await fetch(`${baseUrl}/api/meetings?${params.toString()}`, {
    cache: "no-store",
  });
  const { meetings, totalPages }: MeetingsResponse = await res.json();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
        All Meetings
      </h1>

      <MeetingSearch />

      {meetings.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No meetings match your search.
        </p>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}

      <Pagination totalPages={totalPages} />
    </div>
  );
}
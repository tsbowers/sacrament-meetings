import Link from "next/link";
import { notFound } from "next/navigation";
import { updateMeeting } from "@/lib/actions";
import { getMeetingById } from "@/lib/meetings-db";
import MeetingForm from "@/components/MeetingForm";

// Always render fresh from the database so an edit never shows stale data.
export const dynamic = "force-dynamic";

export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = Number(id);

  // A non-numeric id can't match any meeting.
  if (!Number.isInteger(parsedId) || parsedId < 1) {
    notFound();
  }

  const meeting = await getMeetingById(parsedId);

  // A well-formed id that doesn't match a meeting.
  if (!meeting) {
    notFound();
  }

  // Bind the meeting id from the dynamic route segment so the form only
  // submits the field values.
  const updateWithId = updateMeeting.bind(null, parsedId);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <nav aria-label="Meetings" className="mb-6 text-sm">
        <Link
          href={`/meetings/${meeting.id}`}
          className="text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          &larr; Back to this meeting
        </Link>
      </nav>

      <h1 className="mb-6 text-xl font-semibold text-black dark:text-zinc-50">
        Edit Meeting
      </h1>

      <MeetingForm
        action={updateWithId}
        meeting={meeting}
        submitLabel="Save Changes"
      />
    </div>
  );
}
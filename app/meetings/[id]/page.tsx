import { notFound } from "next/navigation";
import { getMeetingById } from "@/lib/meetings-db";
import MeetingDetail from "@/components/MeetingDetail";

export default async function MeetingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { id } = await params;
  const { print } = await searchParams;

  const meeting = await getMeetingById(id);
  if (!meeting) {
    notFound();
  }

  // TODO: ?print=1 currently just tweaks the wrapper class — decide if
  // print mode needs its own route/layout instead once real styling
  // for the printed program is worked out.
  return (
    <div className={print ? "print:p-0" : ""}>
      <MeetingDetail meeting={meeting} />
    </div>
  );
}

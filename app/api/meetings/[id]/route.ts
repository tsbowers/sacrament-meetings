import { NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meeting = await getMeetingById(id);

  if (!meeting) {
    return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
  }

  return NextResponse.json(meeting);
}

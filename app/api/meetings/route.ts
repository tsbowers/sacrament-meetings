import { NextResponse } from "next/server";
import { getMeetings } from "@/lib/meetings-db";

export async function GET() {
  const meetings = await getMeetings();
  return NextResponse.json(meetings);
}

// STRETCH: not required — stubbed so the route shape exists if this
// gets picked up later. Swap the 501 for real validation + a write to
// the data layer once meetings-db.ts is backed by something persistent.
export async function POST() {
  return NextResponse.json(
    { error: "Creating meetings is not implemented yet." },
    { status: 501 }
  );
}

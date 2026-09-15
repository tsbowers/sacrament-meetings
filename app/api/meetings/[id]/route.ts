import { NextResponse } from "next/server";
import { getMeetingById } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";

interface ErrorBody {
  error: string;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<SacramentMeeting | ErrorBody>> {
  const { id } = await params;
  const parsedId = Number(id);

  if (id.trim() === "" || !Number.isInteger(parsedId)) {
    return NextResponse.json(
      { error: `"${id}" is not a valid meeting id.` },
      { status: 400 }
    );
  }

  const meeting = getMeetingById(parsedId);

  if (!meeting) {
    return NextResponse.json(
      { error: `No meeting found with id ${parsedId}.` },
      { status: 404 }
    );
  }

  return NextResponse.json(meeting);
}

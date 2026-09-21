import { NextRequest, NextResponse } from "next/server";
import { getMeetings, PAGE_SIZE } from "@/lib/meetings-db";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingsResponse {
  meetings: SacramentMeeting[];
  totalPages: number;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<MeetingsResponse>> {
  const date = request.nextUrl.searchParams.get("date");
  const query = request.nextUrl.searchParams.get("query");
  const pageParam = request.nextUrl.searchParams.get("page");
  const parsedPage = pageParam ? Number(pageParam) : 1;
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { meetings, totalCount } = await getMeetings({ date, query, page });

  return NextResponse.json({
    meetings,
    totalPages: Math.max(1, Math.ceil(totalCount / PAGE_SIZE)),
  });
}
"use client";

import MeetingsErrorFallback from "@/components/MeetingsErrorFallback";

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <MeetingsErrorFallback error={error} reset={reset} />;
}
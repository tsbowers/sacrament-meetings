// TODO: swap these plain pulses for skeletons shaped like MeetingCard /
// MeetingDetail once those layouts stop shifting around.
export default function Loading() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-lg bg-black/5 dark:bg-white/5"
        />
      ))}
    </div>
  );
}

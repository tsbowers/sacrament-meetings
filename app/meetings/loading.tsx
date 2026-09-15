// Won't actually be visible with in-memory data — reads resolve too
// fast for React to show the fallback. It'll start mattering once
// meetings-db.ts is backed by a real, slower data source.
export default function Loading() {
  return (
    <div className="space-y-4" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading meetings…</span>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-lg bg-black/5 dark:bg-white/5"
        />
      ))}
    </div>
  );
}

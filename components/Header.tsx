// TODO: pull the ward name from config/env once more than one ward uses
// this. Hard-coded for now.
const WARD_NAME = "Willow Creek Ward";

export default function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="mx-auto flex max-w-3xl flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:justify-between">
      <p className="text-lg font-semibold text-black dark:text-zinc-50">
        {WARD_NAME}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{today}</p>
    </header>
  );
}

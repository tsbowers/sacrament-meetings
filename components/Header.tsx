import NavLinks from "./NavLinks";

// TODO: pull the ward name from config/env once there's more than one
// ward using this. Hard-coded for now.
const WARD_NAME = "TODO Ward";

export default function Header() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-black">
      <div className="mx-auto flex max-w-3xl flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-black dark:text-zinc-50">
            {WARD_NAME}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{today}</p>
        </div>
        <NavLinks />
      </div>
    </header>
  );
}

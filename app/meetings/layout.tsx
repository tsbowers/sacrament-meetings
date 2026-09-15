import type { ReactNode } from "react";

// TODO: this is just a padded container for now. Add a breadcrumb or
// section-level nav here if the meetings area grows more sub-pages.
export default function MeetingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="mx-auto w-full max-w-3xl px-6 py-8">{children}</div>;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/meetings", label: "All Meetings" },
  { href: "/meetings/current", label: "This Sunday" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-black"
    >
      <div className="mx-auto flex max-w-3xl gap-4 px-6 py-3 text-sm font-medium">
        {links.map((link) => {
          // /meetings/current and /meetings/[id] both live under
          // /meetings, so only the exact list route should count as a
          // match for "All Meetings" — otherwise every meetings page
          // would light up two nav links at once.
          const isActive =
            link.href === "/meetings"
              ? pathname === "/meetings"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "text-black underline underline-offset-4 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

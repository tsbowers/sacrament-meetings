"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/meetings/current", label: "This Sunday" },
  { href: "/meetings", label: "All Meetings" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 text-sm font-medium">
      {links.map((link) => {
        // TODO: this treats /meetings/current and /meetings/[id] as
        // distinct from the /meetings list — revisit if that's not the
        // active-state behavior we actually want.
        const isActive =
          link.href === "/"
            ? pathname === "/"
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
    </nav>
  );
}

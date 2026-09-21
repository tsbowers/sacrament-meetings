"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${pathname}?${params.toString()}`;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label="Meetings pagination" className="flex items-center justify-center gap-4 py-6">
      {hasPrev ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-400">
          Previous
        </span>
      )}

      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      {hasNext ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-400">
          Next
        </span>
      )}
    </nav>
  );
}
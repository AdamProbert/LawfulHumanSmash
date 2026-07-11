"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAPTERS } from "@/lib/chapters";

/** Fixed horizontal strip of chapters along the foot of the book. */
export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Chapters">
      <div className="bottom-nav-inner">
        {CHAPTERS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`bottom-nav-link ${pathname === c.href ? "active" : ""}`}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

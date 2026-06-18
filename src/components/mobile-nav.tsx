"use client";

import Link from "next/link";
import { useState } from "react";

type NavLink = { label: string; href: string };

export function MobileNav({
  links,
  login,
  cta,
}: {
  links: readonly NavLink[];
  login: string;
  cta: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="-mr-1 flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full z-50 border-b border-white/10 bg-[var(--ordina-navy-deep)] shadow-xl">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="rounded-full border border-white/15 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-white/10"
              >
                {login}
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="rounded-full bg-white px-4 py-2.5 text-center text-sm font-medium text-black transition hover:bg-white/90"
              >
                {cta}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

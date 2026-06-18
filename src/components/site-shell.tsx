import Image from "next/image";
import Link from "next/link";
import { SITE_FOOTER, SITE_HEADER } from "@/data/homepage";
import { CtaSection } from "@/components/sections/cta-section";
import { MobileNav } from "@/components/mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--ordina-navy-deep)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 py-4 sm:px-6 md:py-[22px]">
        <div className="flex items-center gap-6 lg:gap-10">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/assets/ordina-logo.svg"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7"
              aria-hidden
            />
            <span className="text-xl font-medium tracking-[-0.01em] text-white">
              Ordina
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {SITE_HEADER.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/75 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/contact"
            className="text-sm text-white/75 transition hover:text-white"
          >
            {SITE_HEADER.login}
          </Link>
          <Link
            href="/contact"
            className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
          >
            {SITE_HEADER.cta}
          </Link>
        </div>
        <MobileNav links={SITE_HEADER.links} login={SITE_HEADER.login} cta={SITE_HEADER.cta} />
      </div>
    </header>
  );
}

export function SocialIcon({ label }: { label: string }) {
  const paths: Record<string, string> = {
    X: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    LinkedIn:
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z",
    Instagram:
      "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    Facebook:
      "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  };
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={paths[label] ?? "M12 12h.01"} />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--ordina-navy-deep)] px-6 pb-10 pt-16">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white p-8 md:p-10">
        <div className="grid items-start gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_auto_auto_1.2fr]">
          <div>
            <Image
              src="/assets/ordina-mark.svg"
              alt=""
              width={152}
              height={152}
              className="h-28 w-auto md:h-32"
              aria-hidden
            />
          </div>
          <div>
            <p className="mb-3 text-sm text-[var(--ordina-muted)]">
              {SITE_FOOTER.companyTitle}
            </p>
            <ul className="space-y-2 text-sm">
              {SITE_FOOTER.companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--ordina-text)] hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm text-[var(--ordina-muted)]">
              {SITE_FOOTER.legalTitle}
            </p>
            <ul className="space-y-2 text-sm">
              {SITE_FOOTER.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--ordina-text)] hover:opacity-70"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm text-[var(--ordina-muted)]">
              {SITE_FOOTER.newsletterTitle}
            </p>
            <form action="/contact" className="relative">
              <input
                type="email"
                name="email"
                placeholder={SITE_FOOTER.newsletterPlaceholder}
                className="w-full rounded-lg border border-[var(--ordina-border)] py-2.5 pl-3 pr-12 text-sm outline-none focus:border-[var(--ordina-accent)]"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md bg-[var(--ordina-navy-mid)] text-white"
                aria-label="Subscribe"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
            <div className="mt-3 flex items-start gap-2.5 text-[11px] leading-relaxed text-[var(--ordina-muted)]">
              <input
                id="footer-newsletter-consent"
                type="checkbox"
                className="mt-0.5 h-3.5 w-3.5 rounded-[3px] border border-[var(--ordina-border)]"
              />
              <label htmlFor="footer-newsletter-consent">
                {SITE_FOOTER.newsletterConsentPrefix}{" "}
                <Link href="/legal/terms-of-service" className="underline">
                  {SITE_FOOTER.legalLinks[0].label}
                </Link>{" "}
                and{" "}
                <Link href="/legal/privacy-policy" className="underline">
                  {SITE_FOOTER.legalLinks[1].label}
                </Link>
                {SITE_FOOTER.newsletterConsentSuffix}
              </label>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-6 border-t border-[var(--ordina-border)] pt-8 md:flex-row md:items-center md:justify-between">
          <h3 className="max-w-[420px] text-[34px] font-medium leading-[1.1] tracking-[-0.02em] text-[var(--ordina-text)] md:text-[42px]">
            {SITE_FOOTER.tagline}
          </h3>
          <Link
            href="/contact"
            className="inline-flex shrink-0 rounded-[10px] bg-[var(--ordina-navy-mid)] px-5 py-2.5 text-sm font-medium text-white"
          >
            {SITE_FOOTER.cta}
          </Link>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-[var(--ordina-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[var(--ordina-muted)]">
            {SITE_FOOTER.copyright}
          </p>
          <div className="flex items-center gap-4">
            {SITE_FOOTER.socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--ordina-navy-deep)] hover:opacity-70"
                aria-label={link.label}
              >
                <SocialIcon label={link.label} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <CtaSection />
      <Footer />
    </>
  );
}

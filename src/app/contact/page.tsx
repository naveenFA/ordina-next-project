import type { Metadata } from "next";
import { HOME_ASSETS, HOME_HERO_LOGOS, SITE_FOOTER } from "@/data/homepage";
import { FaqSection } from "@/components/sections/faq-section";
import { SocialIcon } from "@/components/site-shell";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a demo and see how Ordina works for your team in a 30-minute walkthrough.",
};

const TEAM_SIZES = ["Just me", "2–10 people", "11–50 people", "51–200 people", "200+ people"];
const ROLES = [
  "Operations & Workflow",
  "Product & Engineering",
  "Strategy & Leadership",
  "Marketing & Growth",
  "Finance & Admin",
  "Other",
];

const inputClass =
  "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/30";

export default function ContactPage() {
  return (
    <div className="text-[var(--ordina-text)]">
      {/* Hero with integrated form */}
      <section className="relative overflow-hidden bg-[var(--ordina-navy-deep)] py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 lg:grid-cols-[1fr_1.05fr]">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-xs text-white/80">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              24h response time
            </span>
            <h1 className="mt-6 text-[2.75rem] font-medium leading-[1.05] tracking-[-0.03em] md:text-[3.5rem]">
              Book a demo
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
              See how Ordina works for your team in a 30-minute walkthrough. No
              pitch, no pressure — just a clear look at whether it&apos;s the right fit.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-white/55">
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                No credit card
              </span>
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                15 day free trial
              </span>
            </div>
            <div className="mt-12 grid max-w-md grid-cols-3 gap-x-6 gap-y-8">
              {HOME_HERO_LOGOS.slice(0, 6).map((key) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={key}
                  src={HOME_ASSETS[key]}
                  alt=""
                  className="h-6 w-auto self-center opacity-70"
                />
              ))}
            </div>
          </div>

          {/* Form card */}
          <ContactForm inputClass={inputClass} teamSizes={TEAM_SIZES} roles={ROLES} />
        </div>
      </section>

      {/* Prefer a different way to connect */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-3xl font-medium tracking-[-0.02em] md:text-4xl">
            Prefer a different way to connect?
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[var(--ordina-surface)] p-6">
              <p className="font-medium text-[var(--ordina-text)]">Email us directly</p>
              <p className="mt-1.5 text-sm text-[var(--ordina-muted)]">
                For questions, partnerships, or anything else
              </p>
              <a href="mailto:support@ordina.com" className="mt-3 inline-block text-sm font-medium text-[var(--ordina-accent)] hover:opacity-70">
                support@ordina.com
              </a>
            </div>
            <div className="rounded-2xl bg-[var(--ordina-surface)] p-6">
              <p className="font-medium text-[var(--ordina-text)]">Live chat</p>
              <p className="mt-1.5 text-sm text-[var(--ordina-muted)]">
                Talk to the team in real time during business hours
              </p>
              <a href="https://whatsapp.com/ordina" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-[var(--ordina-accent)] hover:opacity-70">
                whatsapp.com/ordina
              </a>
            </div>
            <div className="rounded-2xl bg-[var(--ordina-surface)] p-6">
              <p className="font-medium text-[var(--ordina-text)]">Follow along</p>
              <p className="mt-1.5 text-sm text-[var(--ordina-muted)]">
                Product updates, tips, and behind the scenes
              </p>
              <div className="mt-3 flex items-center gap-4 text-[var(--ordina-navy-deep)]">
                {SITE_FOOTER.socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="hover:opacity-70"
                  >
                    <SocialIcon label={link.label} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FaqSection />
    </div>
  );
}

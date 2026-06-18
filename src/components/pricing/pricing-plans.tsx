"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PRICING_COMPARE,
  PRICING_HERO,
  PRICING_PLANS,
} from "@/lib/content";
import { HeroLogoTicker } from "@/components/sections/hero-logo-ticker";

function CheckIcon() {
  return (
    <svg className="h-[18px] w-[18px] text-[#1f9d6b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="h-[16px] w-[16px] text-[var(--ordina-muted)]/45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-sm text-[var(--ordina-text)]">{value}</span>;
  }
  return value ? <CheckIcon /> : <CrossIcon />;
}

export function PricingPlans() {
  const [yearly, setYearly] = useState(false);

  const flat: ({ type: "cat"; label: string } | {
    type: "row";
    label: string;
    values: readonly (string | boolean)[];
    sub?: boolean;
  })[] = [];
  for (const group of PRICING_COMPARE) {
    flat.push({ type: "cat", label: group.category });
    for (const row of group.rows) flat.push({ type: "row", ...row });
  }

  return (
    <>
      {/* Hero + plan cards on navy */}
      <section className="bg-[var(--ordina-navy-deep)] pb-24 pt-16 text-white md:pb-32 md:pt-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-xs text-white/80">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 8.5 11 3l8 5.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <circle cx="11" cy="10" r="1.4" />
              </svg>
              {PRICING_HERO.eyebrow}
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-[2.5rem] font-medium leading-[1.04] tracking-[-0.03em] md:text-[4rem]">
              {PRICING_HERO.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              {PRICING_HERO.description}
            </p>
          </div>

          <HeroLogoTicker />

          {/* Billing toggle */}
          <div className="mt-12 flex items-center justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] p-1">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  !yearly ? "bg-white text-[var(--ordina-navy-deep)]" : "text-white/70 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                  yearly ? "bg-white text-[var(--ordina-navy-deep)]" : "text-white/70 hover:text-white"
                }`}
              >
                Yearly
                <span className="rounded-full bg-[var(--ordina-lime)] px-2 py-0.5 text-[11px] font-medium text-black">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan cards */}
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {PRICING_PLANS.map((plan) => {
              const featured = "featured" in plan && plan.featured;
              const price = yearly ? plan.yearlyPrice : plan.price;
              return (
                <div
                  key={plan.name}
                  className={`flex flex-col rounded-3xl p-8 ${
                    featured
                      ? "bg-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-white/25 lg:-my-3 lg:py-11"
                      : "bg-white/[0.035] ring-1 ring-white/[0.08]"
                  }`}
                >
                  <h2 className="text-lg font-medium">{plan.name}</h2>
                  <div className="mt-5 flex items-end gap-1.5">
                    <span className="text-5xl font-medium tracking-[-0.02em]">${price}</span>
                    <span className="mb-1.5 text-sm text-white/55">/mo</span>
                  </div>
                  <p className="mt-4 text-sm text-white/60">{plan.description}</p>
                  <Link
                    href="/contact"
                    className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      featured
                        ? "bg-[var(--ordina-lime)] text-black hover:opacity-90"
                        : "border border-white/15 bg-white/[0.04] text-white hover:bg-white/10"
                    }`}
                  >
                    Choose {plan.name}
                    <span aria-hidden>›</span>
                  </Link>
                  <p className="mt-7 text-sm font-medium text-white/90">What&apos;s included</p>
                  <ul className="mt-4 space-y-3 text-sm">
                    {plan.features.map((feature, fi) => {
                      const included = fi < plan.includedCount;
                      return (
                        <li
                          key={feature}
                          className={`flex items-center gap-2.5 ${included ? "text-white/65" : "text-white/30"}`}
                        >
                          <svg
                            className={`h-4 w-4 shrink-0 ${included ? "text-[#5fcf9b]" : "text-white/25"}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <path d="m5 12.5 4.5 4.5L19 7" />
                          </svg>
                          {feature}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6">
          {/* Sticky plan header */}
          <div className="sticky top-16 z-20 grid grid-cols-[1.7fr_1fr_1fr_1fr] items-end bg-white pb-6 pt-4 md:top-20">
            <div />
            {PRICING_PLANS.map((plan) => {
              const featured = "featured" in plan && plan.featured;
              const price = yearly ? plan.yearlyPrice : plan.price;
              return (
                <div
                  key={plan.name}
                  className={`px-4 text-center ${featured ? "rounded-t-2xl bg-[var(--ordina-surface)] pt-4" : ""}`}
                >
                  <p className="text-base font-medium text-[var(--ordina-text)]">{plan.name}</p>
                  <p className="mt-1 text-xs text-[var(--ordina-muted)]">
                    ${price} per user/month {yearly ? "billed annually" : "billed monthly"}
                  </p>
                  <Link
                    href="/contact"
                    className={`mt-3 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-xs font-medium transition ${
                      featured
                        ? "bg-[var(--ordina-navy-mid)] text-white hover:opacity-90"
                        : "border border-[var(--ordina-border)] text-[var(--ordina-text)] hover:bg-[var(--ordina-surface)]"
                    }`}
                  >
                    Choose {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          <div>
            {flat.map((item) => {
              if (item.type === "cat") {
                return (
                  <div key={`cat-${item.label}`} className="grid grid-cols-[1.7fr_1fr_1fr_1fr]">
                    <div className="px-1 pb-3 pt-8 text-sm font-semibold text-[var(--ordina-text)]">
                      {item.label}
                    </div>
                    <div />
                    <div className="bg-[var(--ordina-surface)]" />
                    <div />
                  </div>
                );
              }
              return (
                <div
                  key={`row-${item.label}`}
                  className="grid grid-cols-[1.7fr_1fr_1fr_1fr] items-center border-t border-[var(--ordina-border)]"
                >
                  <div className={`flex items-center gap-1.5 py-3.5 text-sm text-[var(--ordina-text)] ${item.sub ? "pl-5 text-[var(--ordina-muted)]" : ""}`}>
                    {item.label}
                  </div>
                  <div className="flex justify-center py-3.5">
                    <Cell value={item.values[0]} />
                  </div>
                  <div className="flex justify-center bg-[var(--ordina-surface)] py-3.5">
                    <Cell value={item.values[1]} />
                  </div>
                  <div className="flex justify-center py-3.5">
                    <Cell value={item.values[2]} />
                  </div>
                </div>
              );
            })}
            {/* round off the bottom of the highlighted Pro column */}
            <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr]">
              <div />
              <div />
              <div className="h-3 rounded-b-2xl bg-[var(--ordina-surface)]" />
              <div />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

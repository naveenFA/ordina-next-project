"use client";

import Link from "next/link";
import { HOME_CTA } from "@/data/homepage";
import { useInView } from "@/lib/use-in-view";

export function CtaSection() {
  const { ref: ctaRef, visible: ctaVisible } = useInView(0.35);

  return (
    <section className="relative overflow-hidden bg-[var(--ordina-navy-deep)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* top-left curved blob */}
        <div className="absolute left-[6%] -top-16 h-[300px] w-[320px] rounded-[0_0_170px_0] bg-white/[0.03]" />
        {/* bottom-left rectangle */}
        <div className="absolute left-[6%] top-[250px] h-[200px] w-[340px] rounded-[28px] bg-white/[0.028]" />
        {/* center-right rectangle */}
        <div className="absolute left-[64%] top-24 h-[210px] w-[290px] rounded-[28px] bg-white/[0.03]" />
        {/* bottom-right curved blob */}
        <div className="absolute -right-12 top-[230px] h-[380px] w-[380px] rounded-[190px_0_0_0] bg-white/[0.03]" />
      </div>
      <div
        ref={ctaRef}
        className="relative mx-auto max-w-4xl px-6 pb-24 pt-20 text-center text-white md:pb-[150px] md:pt-[140px]"
      >
        <h2
          className="mx-auto max-w-[500px] text-3xl font-medium leading-[1.08] tracking-[-0.02em] text-white/88 transition-all duration-700 ease-out md:text-[54px]"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "none" : "translateY(26px)",
          }}
        >
          {HOME_CTA.title}
        </h2>
        <p
          className="mx-auto mt-4 max-w-[620px] text-lg text-white/60 transition-all duration-700 ease-out"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "none" : "translateY(26px)",
            transitionDelay: ctaVisible ? "120ms" : "0ms",
          }}
        >
          {HOME_CTA.description}
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--ordina-lime)] px-5 py-2.5 text-sm font-medium text-black shadow-[0_0_0_1px_rgba(0,0,0,0.06)] transition-all duration-700 ease-out"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "none" : "translateY(26px)",
            transitionDelay: ctaVisible ? "230ms" : "0ms",
          }}
        >
          {HOME_CTA.button}
          <span aria-hidden>›</span>
        </Link>
        <div
          className="mt-5 flex flex-wrap items-center justify-center gap-6 text-sm text-white/55 transition-all duration-700 ease-out"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "none" : "translateY(26px)",
            transitionDelay: ctaVisible ? "320ms" : "0ms",
          }}
        >
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 opacity-80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            {HOME_CTA.noteLine1}
          </span>
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 opacity-80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            {HOME_CTA.noteLine2}
          </span>
        </div>
      </div>
    </section>
  );
}

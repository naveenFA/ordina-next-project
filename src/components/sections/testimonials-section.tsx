"use client";

import Image from "next/image";
import { useState } from "react";
import { HOME_ASSETS, HOME_TESTIMONIALS } from "@/data/homepage";

/** Fictional customer brands shown on the testimonial portraits (index-aligned with HOME_TESTIMONIALS.items) */
const TESTIMONIAL_COMPANIES = ["Journey", "AIVA", "Alexun"] as const;

function CompanyLogo({ index }: { index: number }) {
  const name = TESTIMONIAL_COMPANIES[index] ?? "";
  return (
    <span className="inline-flex items-center gap-2 text-[18px] font-medium tracking-[-0.01em]">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden className="shrink-0">
        {index === 0 ? (
          // Journey — dot cluster
          <g fill="currentColor">
            <circle cx="6" cy="7" r="1.7" />
            <circle cx="12" cy="7" r="1.7" />
            <circle cx="18" cy="7" r="1.7" />
            <circle cx="6" cy="13" r="1.7" />
            <circle cx="12" cy="13" r="1.7" />
            <circle cx="18" cy="13" r="1.7" />
            <circle cx="9" cy="19" r="1.7" />
            <circle cx="15" cy="19" r="1.7" />
          </g>
        ) : index === 1 ? (
          // AIVA — rounded tricorn emblem with trident
          <g fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
            <path d="M12 2.8 20.8 18.4a1.8 1.8 0 0 1-1.6 2.7H4.8a1.8 1.8 0 0 1-1.6-2.7Z" />
            <path d="M12 8v8M12 11.4 8.6 8.4M12 11.4 15.4 8.4" />
          </g>
        ) : (
          // Alexun — six-petal asterisk
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M12 3.5v17M4.65 7.75 19.35 16.25M19.35 7.75 4.65 16.25" />
          </g>
        )}
      </svg>
      {name}
    </span>
  );
}

export function TestimonialsSection() {
  const [testimonialIndex, setTestimonialIndex] = useState(1);

  return (
    <section className="border-y border-[var(--ordina-border)] bg-[var(--ordina-surface)] py-16 md:py-[122px]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ordina-border)] bg-white px-3 py-1 text-xs text-[var(--ordina-muted)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2.5" y="7" width="19" height="13.5" rx="2" />
              <path d="M8 7V5.2A2.2 2.2 0 0 1 10.2 3h3.6A2.2 2.2 0 0 1 16 5.2V7" />
            </svg>
            {HOME_TESTIMONIALS.eyebrow}
          </span>
          <h2 className="mx-auto mt-4 max-w-[460px] text-balance bg-gradient-to-b from-[#141414] from-45% to-[#9aa0ab] bg-clip-text text-3xl font-medium tracking-[-0.02em] text-transparent md:text-4xl">
            {HOME_TESTIMONIALS.title}
          </h2>
        </div>
        <div className="mt-10 flex flex-col gap-4 md:flex-row">
          {HOME_TESTIMONIALS.items.map((item, index) => {
            const isActive = testimonialIndex === index;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setTestimonialIndex(index)}
                style={{ flexGrow: isActive ? 2.2 : 1, flexBasis: 0 }}
                className={`relative overflow-hidden rounded-2xl text-left transition-[flex-grow] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[450px] ${
                  isActive ? "bg-[#1a1a1a]" : "bg-[#e9e9ea]"
                }`}
              >
                <div className="flex h-full flex-col md:flex-row">
                  <div
                    className={`relative min-h-[300px] md:min-h-0 ${
                      isActive ? "md:w-[42%]" : "flex-1"
                    }`}
                  >
                    <Image
                      src={HOME_ASSETS[item.portraitKey as keyof typeof HOME_ASSETS]}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top"
                    />
                    {!isActive ? (
                      <div className="pointer-events-none absolute inset-0 bg-white/25" />
                    ) : null}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute bottom-5 left-5 text-white">
                      <CompanyLogo index={index} />
                    </div>
                  </div>
                  {isActive ? (
                    <div className="flex flex-1 flex-col justify-between p-6 text-white md:p-8">
                      <p
                        className="text-lg leading-relaxed md:text-xl"
                        style={{
                          maskImage:
                            "linear-gradient(to bottom, #000 72%, transparent 100%)",
                          WebkitMaskImage:
                            "linear-gradient(to bottom, #000 72%, transparent 100%)",
                        }}
                      >
                        {item.quote}
                      </p>
                      <div className="mt-6">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-white/60">{item.role}</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

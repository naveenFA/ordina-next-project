import Link from "next/link";
import { HOME_FAQ } from "@/data/homepage";

export function FaqSection() {
  return (
    <section className="bg-white py-16 md:py-[170px]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ordina-border)] bg-white px-3 py-1 text-xs text-[var(--ordina-muted)]">
              {HOME_FAQ.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-medium tracking-[-0.02em] md:text-4xl">
              {HOME_FAQ.title}
            </h2>
            <div className="mt-10 divide-y divide-[var(--ordina-border)]">
              {HOME_FAQ.items.map((item) => (
                <details key={item.q} className="group py-5">
                  <summary className="cursor-pointer list-none font-medium marker:content-none">
                    <span className="flex items-center justify-between gap-4">
                      {item.q}
                      <span className="shrink-0 text-xl font-light text-[var(--ordina-muted)] transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ordina-muted)]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
          <div className="lg:pt-12">
            <p className="text-sm leading-relaxed text-[var(--ordina-muted)]">
              {HOME_FAQ.description}
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex rounded-[10px] bg-[var(--ordina-navy-mid)] px-5 py-2.5 text-sm font-medium text-white"
            >
              {HOME_FAQ.cta}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";

type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export function LegalDocumentContent({
  lastUpdated,
  introParagraphs,
  sections,
}: {
  lastUpdated: string;
  introParagraphs: string[];
  sections: LegalSection[];
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const fallback = sections[0]?.id ?? "";
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const triggerLine = window.innerHeight * 0.18;
      const firstSectionReleaseLine = -80;
      const headings = sections
        .map((section) => ({
          id: section.id,
          top: document.getElementById(section.id)?.getBoundingClientRect().top,
        }))
        .filter(
          (entry): entry is { id: string; top: number } =>
            typeof entry.top === "number",
        );

      if (headings.length === 0) {
        setActiveId(fallback);
        return;
      }

      if (headings[1] && headings[1].top > firstSectionReleaseLine) {
        setActiveId(headings[0].id);
        return;
      }

      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.top <= triggerLine) {
          current = heading.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveSection);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  const handleTocClick = (id: string) => {
    setActiveId(id);
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 96;
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="bg-white pb-24 pt-20 md:pb-32 md:pt-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 md:px-10 lg:grid-cols-[456px_684px] lg:justify-between">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-[#f2f2f2] bg-[#fafafa] p-4">
            <p className="text-[11px] uppercase tracking-[0.07em] text-[#8c8c8c]">
              Last updated
            </p>
            <p className="mt-1 text-sm font-medium text-[#1a1a1a]">{lastUpdated}</p>
          </div>

          <div className="mt-3 rounded-[20px] bg-[#fafafa] p-5">
            <div className="flex h-6 items-center text-xs font-normal leading-none text-black">
              Table of contents
            </div>
            <nav className="mt-5 rounded-xl bg-white p-5">
              <ul className="space-y-[4.5px]">
                {sections.map((section) => {
                  const isActive = section.id === activeId;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => handleTocClick(section.id)}
                        className="w-full border-0 p-0 text-left"
                      >
                        <div
                          className={`rounded-lg py-4 text-[15px] leading-[1.3] transition-all duration-200 ${
                            isActive
                              ? "bg-[#fafafa] pl-6 pr-3"
                              : "bg-transparent px-3"
                          }`}
                        >
                          <span
                            className={
                              isActive
                                ? "font-semibold text-[#1a1a1a]"
                                : "font-normal text-[#8c8c8c]"
                            }
                          >
                            {section.heading}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        <div>
          {introParagraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 48)}
              className="mb-4 text-[16px] leading-[1.4] text-[#8c8c8c]"
            >
              {paragraph}
            </p>
          ))}

          {sections.map((section) => (
            <section key={section.id} id={section.id} className="mt-10 scroll-mt-24">
              <h2 className="text-[24px] font-medium leading-[1.2] tracking-[-0.015em] text-[var(--ordina-navy-deep)]">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-2.5">
                {section.paragraphs.map((paragraph, idx) => (
                  <p
                    key={`${section.id}-${idx}`}
                    className="text-[16px] leading-[1.4] text-[#8c8c8c]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

export type BlogArticleSection = {
  heading: string;
  paragraphs: string[];
  bullets: string[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogPostContent({
  introParagraphs,
  sections,
  isCompactPost,
}: {
  introParagraphs: string[];
  sections: BlogArticleSection[];
  isCompactPost: boolean;
}) {
  const sectionItems = useMemo(() => {
    const counts = new Map<string, number>();
    return sections.map((section) => {
      const base = slugify(section.heading);
      const seen = counts.get(base) ?? 0;
      counts.set(base, seen + 1);
      const id = seen === 0 ? base : `${base}-${seen + 1}`;
      return { ...section, id };
    });
  }, [sections]);

  const [activeId, setActiveId] = useState(sectionItems[0]?.id ?? "");

  const handleTocClick = (id: string) => {
    setActiveId(id);
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 96;
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const fallback = sectionItems[0]?.id ?? "";
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const triggerLine = window.innerHeight * 0.18;
      const firstSectionReleaseLine = -80;
      const headings = sectionItems
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

      // Framer keeps the first TOC item active until the second heading reaches
      // around the very top of the viewport, then follows a regular trigger line.
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
  }, [sectionItems]);

  return (
    <section
      className={`bg-white py-12 md:py-16 ${
        isCompactPost ? "pb-[680px] md:pb-[760px]" : "pb-56 md:pb-64"
      }`}
    >
      <div className="mx-auto grid max-w-[1280px] gap-8 px-6 md:px-10 lg:grid-cols-[minmax(0,480px)_minmax(0,660px)] lg:justify-between">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[24px] bg-[#fafafa] p-5">
            <div className="flex h-6 items-center text-xs font-normal leading-none text-black">
              Table of contents
            </div>
            <nav className="mt-5 rounded-xl bg-white p-5">
              <ul className="space-y-[4.5px]">
                {sectionItems.map((section) => {
                  const isActive = section.id === activeId;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => handleTocClick(section.id)}
                        className="w-full border-0 p-0 text-left"
                      >
                        <div
                          className={`mx-[1px] rounded-lg py-4 text-[15px] leading-[1.3] transition-all duration-200 ${
                            isActive
                              ? "bg-[#fafafa] pl-6 pr-3"
                              : "bg-transparent px-3"
                          }`}
                        >
                          <span
                            className={`${
                              isActive
                                ? "font-semibold text-[#1a1a1a]"
                                : "font-normal text-[#8c8c8c]"
                            }`}
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
              className="mb-5 max-w-3xl text-[15px] leading-[1.4] text-[#8c8c8c] md:text-base"
            >
              {paragraph}
            </p>
          ))}

          {sectionItems.map((section) => (
            <section key={section.id} id={section.id} className="mt-10 scroll-mt-24">
              <h2 className="text-2xl font-medium leading-[1.2] tracking-[-0.02em] text-[var(--ordina-navy-deep)]">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 64)}
                    className="max-w-3xl text-[15px] leading-[1.4] text-[#8c8c8c] md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets.length > 0 ? (
                  <ul className="ml-5 list-disc space-y-2 text-[15px] leading-[1.4] text-[#8c8c8c] md:text-base">
                    {section.bullets.map((bullet, i) => (
                      <li key={`${section.id}-bullet-${i}`}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

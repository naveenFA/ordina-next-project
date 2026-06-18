import { LegalDocumentContent } from "@/components/legal/legal-document-content";
import { getPage } from "@/lib/content";

type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseLegalContent(cleanedText: string, fallbackDate: string) {
  const rawLines = cleanedText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const footerStart = rawLines.findIndex(
    (line) => line === "Less" || line === "Less tool-switching. More actual progress.",
  );
  const lines = footerStart === -1 ? rawLines : rawLines.slice(0, footerStart);

  const lastUpdatedIdx = lines.findIndex((line) => line === "Last updated");
  const lastUpdated =
    lastUpdatedIdx !== -1 && lines[lastUpdatedIdx + 1]
      ? lines[lastUpdatedIdx + 1]
      : fallbackDate;

  const tocIndex = lines.findIndex((line) => line === "Table of contents");
  let contentLines = tocIndex === -1 ? lines : lines.slice(tocIndex + 1);

  const noise = new Set([
    "Legal",
    "Privacy",
    "Policy",
    "Terms",
    "of",
    "Service",
    ".",
  ]);
  contentLines = contentLines.filter((line) => !noise.has(line));

  const introParagraphs: string[] = [];
  const sections: LegalSection[] = [];
  let current: LegalSection | null = null;

  const topHeading = /^\d+\.\s+/;
  const bareSubPoint = /^\d+\.\d+\.$/;
  const inlineSubPoint = /^\d+\.\d+\.\s+/;

  const pushIntoCurrent = (line: string) => {
    if (!current) return;
    if (current.paragraphs.length === 0) {
      current.paragraphs.push(line);
      return;
    }
    const lastIdx = current.paragraphs.length - 1;
    const previous = current.paragraphs[lastIdx];
    if (
      !/[.!?]$/.test(previous) ||
      line.startsWith("–") ||
      /^[a-z(]/.test(line) ||
      /^["']/.test(line)
    ) {
      current.paragraphs[lastIdx] = `${previous} ${line}`;
      return;
    }
    current.paragraphs.push(line);
  };

  for (let i = 0; i < contentLines.length; i += 1) {
    const line = contentLines[i];
    const next = contentLines[i + 1];

    if (topHeading.test(line)) {
      const id = slugify(line);
      current = {
        id,
        heading: line,
        paragraphs: [],
      };
      sections.push(current);
      continue;
    }

    if (bareSubPoint.test(line)) {
      const parts = [line];
      if (next && !topHeading.test(next) && !bareSubPoint.test(next) && !inlineSubPoint.test(next)) {
        parts.push(next);
        i += 1;
      }
      const trailing = contentLines[i + 1];
      if (trailing && trailing.startsWith("–")) {
        parts.push(trailing);
        i += 1;
      }
      if (!current) {
        introParagraphs.push(parts.join(" "));
      } else {
        current.paragraphs.push(parts.join(" "));
      }
      continue;
    }

    if (!current) {
      introParagraphs.push(line);
      continue;
    }

    pushIntoCurrent(line);
  }

  return { lastUpdated, introParagraphs, sections };
}

export function LegalDocumentPage({
  path,
  fallbackTitle,
}: {
  path: string;
  fallbackTitle: string;
}) {
  const page = getPage(path);
  const title = page?.headings.h1?.[0] ?? fallbackTitle;
  const { lastUpdated, introParagraphs, sections } = parseLegalContent(
    page?.cleaned_text ?? "",
    "Mar 20, 2026",
  );

  return (
    <article className="text-[var(--ordina-text)]">
      <header className="bg-[var(--ordina-navy-deep)] pb-24 pt-24 text-white md:pb-28 md:pt-32">
        <div className="mx-auto max-w-[800px] px-6 md:px-0">
          <span className="inline-flex rounded-md bg-white/8 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-white/80">
            Legal
          </span>
          <h1 className="mt-4 max-w-[600px] text-[2.1rem] font-normal leading-[1.05] tracking-[-0.02em] md:text-[64px]">
            {title}
          </h1>
        </div>
      </header>
      <LegalDocumentContent
        lastUpdated={lastUpdated}
        introParagraphs={introParagraphs}
        sections={sections}
      />
    </article>
  );
}

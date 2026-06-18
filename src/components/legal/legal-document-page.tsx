import { LegalDocumentContent } from "@/components/legal/legal-document-content";
import { getPage } from "@/lib/content";

type LegalSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

type CmsPageAttributes = {
  Tittle?: string;
  Description?: string;
  slug?: string;
  updatedAt?: string;
};

type CmsPageResponse = {
  data?: Array<{
    id: number;
    attributes?: CmsPageAttributes;
  }>;
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

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };

  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (entity, token: string) => {
    if (token[0] === "#") {
      const isHex = token[1]?.toLowerCase() === "x";
      const raw = isHex ? token.slice(2) : token.slice(1);
      const codePoint = Number.parseInt(raw, isHex ? 16 : 10);
      if (Number.isNaN(codePoint)) return entity;
      return String.fromCodePoint(codePoint);
    }
    return namedEntities[token] ?? entity;
  });
}

function htmlParagraphsToText(description: string) {
  const paragraphMatches = [...description.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(
    (match) => match[1] ?? "",
  );
  const rawParagraphs = paragraphMatches.length > 0 ? paragraphMatches : [description];

  return rawParagraphs
    .map((paragraph) =>
      paragraph
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
        .replace(/<\/?strong\b[^>]*>/gi, "")
        .replace(/<\/?em\b[^>]*>/gi, "")
        .replace(/<[^>]+>/g, ""),
    )
    .map((paragraph) => decodeHtmlEntities(paragraph))
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" "),
    )
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function parseCmsDescription(description: string, fallbackDate: string) {
  const paragraphs = htmlParagraphsToText(description);
  const introParagraphs: string[] = [];
  const sections: LegalSection[] = [];
  let current: LegalSection | null = null;
  let lastUpdated = fallbackDate;

  for (const paragraph of paragraphs) {
    const updatedMatch = paragraph.match(/^Last updated:\s*(.+)$/i);
    if (updatedMatch?.[1]) {
      lastUpdated = updatedMatch[1].trim();
      continue;
    }

    if (/^\d+\.\s+/.test(paragraph)) {
      const section: LegalSection = {
        id: slugify(paragraph),
        heading: paragraph,
        paragraphs: [],
      };
      sections.push(section);
      current = section;
      continue;
    }

    if (!current) {
      introParagraphs.push(paragraph);
      continue;
    }
    current.paragraphs.push(paragraph);
  }

  return {
    lastUpdated,
    introParagraphs,
    sections,
  };
}

async function fetchCmsPageBySlug(slug: string): Promise<CmsPageAttributes | null> {
  const endpoint = `https://cms.flowautomate.io/api/pages?filters[slug][$eq]=${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as CmsPageResponse;
    return payload.data?.[0]?.attributes ?? null;
  } catch {
    return null;
  }
}

function formatIsoDate(isoDate: string | undefined) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export async function LegalDocumentPage({
  path,
  fallbackTitle,
}: {
  path: string;
  fallbackTitle: string;
}) {
  const slug = path.replace(/^\/legal\//, "");
  const cmsPage = await fetchCmsPageBySlug(slug);
  const fallbackPage = getPage(path);
  const fallbackParsed = parseLegalContent(fallbackPage?.cleaned_text ?? "", "Mar 20, 2026");
  const cmsUpdatedDate = formatIsoDate(cmsPage?.updatedAt) ?? fallbackParsed.lastUpdated;

  const title = cmsPage?.Tittle?.trim() || fallbackPage?.headings.h1?.[0] || fallbackTitle;
  const parsed = cmsPage?.Description
    ? parseCmsDescription(cmsPage.Description, cmsUpdatedDate)
    : fallbackParsed;

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
        lastUpdated={parsed.lastUpdated}
        introParagraphs={parsed.introParagraphs}
        sections={parsed.sections}
      />
    </article>
  );
}

import type { Metadata } from "next";
import { Prose } from "@/components/ui";
import { getPage, getPrimaryHeading, textToParagraphs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the Ordina platform.",
};

export default function TermsOfServicePage() {
  const page = getPage("/legal/terms-of-service");
  const title = page ? getPrimaryHeading(page) : "Terms of Service";
  const paragraphs = page ? textToParagraphs(page.cleaned_text) : [];

  return (
    <article>
      <header className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            {title}
          </h1>
        </div>
      </header>
      <Prose>
        <div className="mx-auto max-w-3xl px-6 py-12">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)} className="mb-5 leading-relaxed text-zinc-700">
              {paragraph}
            </p>
          ))}
        </div>
      </Prose>
    </article>
  );
}

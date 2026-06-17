import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on building clearer workflows for modern teams — coordination strategies and practical systems for alignment.",
};

export default function BlogPage() {
  const posts = getBlogPosts();
  const featured = posts.find(
    (post) => post.slug === "why-most-teams-are-busy-but-not-aligned",
  );

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights on building clearer workflows for modern teams"
        description="Explore workflows, coordination strategies, and practical systems that help teams stay focused and aligned."
      />

      {featured ? (
        <section className="border-b border-zinc-200 bg-indigo-50/40">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
              Featured Post
            </p>
            <h2 className="mt-2 max-w-3xl text-2xl font-semibold text-zinc-900 md:text-3xl">
              <Link href={`/blog/${featured.slug}`} className="hover:text-indigo-600">
                {featured.title}
              </Link>
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-600">{featured.excerpt}</p>
            <Link
              href={`/blog/${featured.slug}`}
              className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Read more →
            </Link>
          </div>
        </section>
      ) : null}

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col rounded-2xl border border-zinc-200 p-6 transition hover:border-indigo-200 hover:shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  {post.category ? <span>{post.category}</span> : null}
                  {post.date ? <span>· {post.date}</span> : null}
                  {post.readTime ? <span>· {post.readTime}</span> : null}
                </div>
                <h2 className="mt-3 text-lg font-semibold text-zinc-900">
                  <Link href={`/blog/${post.slug}`} className="hover:text-indigo-600">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

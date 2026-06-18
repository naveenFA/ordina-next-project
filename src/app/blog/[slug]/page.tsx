import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HOME_ASSETS } from "@/data/homepage";
import { BlogPostContent } from "@/components/blog/blog-post-content";
import { getBlogDetail, getBlogSlugs, getBlogs } from "@/lib/cms";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return (await getBlogSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogDetail(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.lede };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogDetail(slug);
  if (!post) notFound();

  const { feed } = await getBlogs();
  const relatedPosts = feed.filter((item) => item.slug !== slug).slice(0, 3);

  const coverImage = post.cover || HOME_ASSETS.blogFeatured;
  const textLength = (
    post.introHtml + post.sections.map((s) => s.html).join("")
  ).replace(/<[^>]+>/g, "").length;
  const isCompactPost = textLength < 2200;

  return (
    <article className="text-[var(--ordina-text)]">
      <header className="bg-[var(--ordina-navy-deep)] pb-12 pt-12 text-white md:pb-14 md:pt-16">
        <div className="mx-auto max-w-6xl px-6">
          <Link href="/blog" className="text-xs text-white/70 hover:text-white">
            Back to Blog
          </Link>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/65">
            <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1">
              {post.category ?? "Blog"}
            </span>
            <span className="inline-flex items-center gap-3">
              {post.date ? <span>{post.date}</span> : null}
            </span>
          </div>
          <h1 className="mt-5 max-w-3xl text-[2.25rem] font-normal leading-[1.05] tracking-[-0.025em] md:text-[4rem]">
            {post.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/72 md:text-lg">
            {post.lede}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/65">
            {post.date ? <span>{post.date}</span> : null}
          </div>
          <div className="relative mt-8 overflow-hidden rounded-xl">
            <div className="relative aspect-[2400/1300] w-full">
              <Image
                src={coverImage}
                alt=""
                fill
                sizes="(max-width: 1200px) 100vw, 1152px"
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </header>

      <BlogPostContent
        introHtml={post.introHtml}
        sections={post.sections}
        isCompactPost={isCompactPost}
      />

      <section className="bg-white pb-72 pt-14">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-[32px] font-normal leading-[1.15] tracking-[-0.02em] text-[var(--ordina-text)] md:text-[48px]">
            Keep reading — there&apos;s more worth your time
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedPosts.map((item) => (
              <article
                key={item.slug}
                className="rounded-xl border border-[var(--ordina-border)] p-5"
              >
                <div className="text-xs text-[var(--ordina-muted)]">
                  {[item.category, item.date, item.readTime].filter(Boolean).join(" · ")}
                </div>
                <h3 className="mt-3 text-lg font-medium leading-snug text-[var(--ordina-text)]">
                  <Link href={`/blog/${item.slug}`} className="hover:underline">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ordina-muted)]">
                  {item.excerpt}
                </p>
                <Link
                  href={`/blog/${item.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm underline underline-offset-4"
                >
                  Read more
                  <span aria-hidden>›</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}

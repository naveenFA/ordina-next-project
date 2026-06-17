import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/ui";
import {
  getAllBlogSlugs,
  getBlogPost,
  textToParagraphs,
} from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const paragraphs = textToParagraphs(post.page.cleaned_text).filter(
    (p) => !p.startsWith(post.title),
  );

  return (
    <article>
      <header className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <Link
            href="/blog"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            ← Back to blog
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            {post.category ? <span>{post.category}</span> : null}
            {post.date ? <span>· {post.date}</span> : null}
            {post.readTime ? <span>· {post.readTime}</span> : null}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-lg text-zinc-600">{post.excerpt}</p>
          ) : null}
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

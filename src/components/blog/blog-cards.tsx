import Image from "next/image";
import Link from "next/link";

type BlogTheme = "dark" | "light";

export type BlogCardPost = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  readTime?: string;
  image: string;
};

/** Large featured-article card (image + arc motif + content). Shared by the homepage blog section and the /blog hero. */
export function BlogFeaturedCard({
  slug,
  title,
  excerpt,
  image,
}: {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
}) {
  return (
    <article className="relative mt-10 overflow-hidden rounded-3xl bg-[#0a3348]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-28 h-[460px] w-[460px] rounded-full border border-white/[0.05]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-[300px] w-[300px] rounded-full border border-white/[0.04]"
      />
      <div className="relative grid gap-6 p-4 md:grid-cols-2 md:p-5">
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl md:min-h-[460px]">
          <Image src={image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center p-4 md:p-8 lg:p-12">
          <p className="text-xs uppercase tracking-[0.12em] text-[var(--ordina-accent-light)]">
            Featured Post
          </p>
          <h3 className="mt-4 text-3xl font-medium leading-[1.1] tracking-[-0.01em] md:text-4xl">
            <Link href={`/blog/${slug}`} className="hover:opacity-90">
              {title}
            </Link>
          </h3>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">{excerpt}</p>
          <Link
            href={`/blog/${slug}`}
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            Read more
            <span aria-hidden>›</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Compact post card (image + category badge + meta + title + excerpt). Shared by the homepage blog grid and the /blog feed. */
export function BlogPostCard({
  post,
  grayscale = false,
  theme = "dark",
}: {
  post: BlogCardPost;
  /** When true the cover is desaturated until hover (homepage style). */
  grayscale?: boolean;
  /** Theme variant for shared usage across dark and light sections. */
  theme?: BlogTheme;
}) {
  const isDark = theme === "dark";

  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition ${grayscale ? "grayscale group-hover:grayscale-0" : ""}`}
        />
        {post.category ? (
          <span className="absolute left-3 top-3 rounded-md bg-[var(--ordina-navy-mid)] px-2.5 py-1 text-xs text-white">
            {post.category}
          </span>
        ) : null}
      </div>
      <div
        className={`mt-4 flex items-center gap-4 text-xs ${
          isDark ? "text-white/55" : "text-[var(--ordina-muted)]"
        }`}
      >
        {post.date ? (
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
              <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
            </svg>
            {post.date}
          </span>
        ) : null}
        {post.readTime ? (
          <span className="inline-flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7.5v5l3 2" />
            </svg>
            {post.readTime}
          </span>
        ) : null}
      </div>
      <h3
        className={`mt-2 text-lg font-medium leading-snug ${
          isDark ? "text-white" : "text-[var(--ordina-text)]"
        }`}
      >
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h3>
      <p
        className={`mt-2 line-clamp-2 text-sm ${
          isDark ? "text-white/65" : "text-[var(--ordina-muted)]"
        }`}
      >
        {post.excerpt}
      </p>
      <Link
        href={`/blog/${post.slug}`}
        className={`mt-3 inline-flex items-center gap-1 text-sm underline underline-offset-4 ${
          isDark ? "text-white" : "text-[var(--ordina-text)]"
        }`}
      >
        Read more
        <span aria-hidden>›</span>
      </Link>
    </article>
  );
}

import type { Metadata } from "next";
import { HOME_ASSETS, HOME_BLOG } from "@/data/homepage";
import { BlogFeaturedCard, type BlogCardPost } from "@/components/blog/blog-cards";
import { BlogFeed } from "@/components/blog/blog-feed";
import { FaqSection } from "@/components/sections/faq-section";
import { getBlogs } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on building clearer workflows for modern teams — coordination strategies and practical systems for alignment.",
};

// Bundled fallback used only if the CMS is unreachable.
const FALLBACK_FEED: BlogCardPost[] = HOME_BLOG.posts.map((post) => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  date: post.date,
  readTime: post.readTime,
  image: HOME_ASSETS[post.imageKey as keyof typeof HOME_ASSETS],
}));

export default async function BlogPage() {
  const { featured, feed, categories } = await getBlogs();

  // Fall back to bundled content if the CMS is unreachable.
  const feedPosts = feed.length ? feed : FALLBACK_FEED;
  const feedCategories = categories.length
    ? categories
    : [...new Set(FALLBACK_FEED.map((post) => post.category).filter(Boolean))] as string[];
  const featuredPost: BlogCardPost =
    featured ?? {
      slug: HOME_BLOG.featured.slug,
      title: HOME_BLOG.featured.title,
      excerpt: HOME_BLOG.featured.excerpt,
      image: HOME_ASSETS[HOME_BLOG.featured.imageKey as keyof typeof HOME_ASSETS],
    };

  return (
    <div className="text-[var(--ordina-text)]">
      <section className="bg-[var(--ordina-navy-deep)] pb-12 pt-16 text-white md:pb-14 md:pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-[var(--ordina-accent-light)]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
              <path d="M14 3v4h4M8.5 12h7M8.5 16h5" />
            </svg>
            {HOME_BLOG.eyebrow}
          </span>
          <h1 className="mt-4 max-w-3xl text-[2.5rem] font-medium leading-[1.05] tracking-[-0.03em] md:text-[3.5rem]">
            {HOME_BLOG.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
            {HOME_BLOG.description}
          </p>

          <BlogFeaturedCard
            slug={featuredPost.slug}
            title={featuredPost.title}
            excerpt={featuredPost.excerpt}
            image={featuredPost.image}
          />
        </div>
      </section>

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-6">
          <BlogFeed
            posts={feedPosts}
            categories={feedCategories}
            theme="light"
            grayscaleCards
          />
        </div>
      </section>

      <FaqSection />
    </div>
  );
}

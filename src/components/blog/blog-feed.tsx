"use client";

import { useMemo, useState } from "react";
import { BlogPostCard, type BlogCardPost } from "@/components/blog/blog-cards";

const PAGE_SIZE = 6;

export function BlogFeed({
  posts,
  categories,
  theme = "dark",
  grayscaleCards = false,
}: {
  posts: BlogCardPost[];
  categories: string[];
  theme?: "dark" | "light";
  grayscaleCards?: boolean;
}) {
  const [active, setActive] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const isDark = theme === "dark";

  const filtered = useMemo(
    () => (active === "All" ? posts : posts.filter((p) => p.category === active)),
    [active, posts],
  );
  const shown = filtered.slice(0, visible);

  return (
    <div>
      {/* Category chips */}
      <div className="flex flex-wrap gap-2.5">
        {["All", ...categories].map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActive(cat);
                setVisible(PAGE_SIZE);
              }}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                isActive
                  ? isDark
                    ? "bg-white text-[var(--ordina-navy-deep)]"
                    : "bg-[var(--ordina-navy-mid)] text-white"
                  : isDark
                    ? "border border-white/15 text-white/65 hover:text-white"
                    : "border border-[var(--ordina-border)] text-[var(--ordina-muted)] hover:text-[var(--ordina-text)]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((post) => (
          <BlogPostCard
            key={post.slug}
            post={post}
            theme={theme}
            grayscale={grayscaleCards}
          />
        ))}
      </div>

      {visible < filtered.length ? (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition hover:opacity-90 ${
              isDark
                ? "bg-[var(--ordina-navy-mid)] text-white"
                : "bg-[var(--ordina-navy-mid)] text-white"
            }`}
          >
            Load more posts
          </button>
        </div>
      ) : null}
    </div>
  );
}

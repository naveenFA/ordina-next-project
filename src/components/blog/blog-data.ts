import { HOME_ASSETS, HOME_BLOG } from "@/data/homepage";

export type BlogFeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  readTime?: string;
  image: string;
};

export const BLOG_CATEGORIES = [
  "Cross-team Collaboration",
  "Planning Systems",
  "Operations",
  "Strategy & Leadership",
  "Tutorials",
];

export const BLOG_FEED: BlogFeedPost[] = [
  {
    slug: "why-great-strategies-fail-and-how-leaders-can-keep-them-alive",
    title: "Why great strategies fail and how leaders can keep them alive",
    category: "Strategy & Leadership",
    date: "Feb 2, 2026",
    readTime: "8 min read",
    image: HOME_ASSETS.blog1,
    excerpt:
      "Most strategies don't fail because they're wrong — they fail because teams lose connection to them. Here's how leaders can create clarity, reinforce direction, and turn strategy into an operating system, not a slide deck.",
  },
  {
    slug: "how-operational-drag-quietly-kills-execution-and-what-high-performing-teams-do-differently",
    title: "How operational drag quietly kills execution and what high-performing teams do differently",
    category: "Operations",
    date: "Jan 26, 2026",
    readTime: "12 minutes",
    image: HOME_ASSETS.blog2,
    excerpt:
      "Operational drag doesn't show up all at once — it builds slowly through blockers, unclear ownership, repeat work, and scattered communication. Here's how to spot it early, remove friction, and create an execution engine that actually scales.",
  },
  {
    slug: "why-strategies-fail-and-how-to-fix-them-before-they-do",
    title: "Why strategies fail and how to fix them before they do",
    category: "Strategy & Leadership",
    date: "Jan 3, 2026",
    readTime: "7 min",
    image: HOME_ASSETS.blog3,
    excerpt:
      "Most strategies don't fail because they were bad ideas — they fail because teams lose alignment, momentum, and clarity along the way. We break down why execution breaks down and how to build a strategy engine that delivers.",
  },
  {
    slug: "the-real-reason-teams-lose-momentum-and-how-to-rebuild-it",
    title: "The real reason teams lose momentum and how to rebuild it",
    category: "Cross-team Collaboration",
    date: "Jan 1, 2026",
    readTime: "6 min",
    image: "/assets/home/blog-4.jpg",
    excerpt:
      "Momentum rarely disappears overnight — it erodes slowly through unclear goals, shifting priorities, and misaligned teams. Here's how fast-growing organizations can rebuild it and keep it.",
  },
  {
    slug: "how-to-build-a-repeatable-planning-rhythm-your-team-actually-follows",
    title: "How to build a repeatable planning rhythm your team actually follows",
    category: "Tutorials",
    date: "Dec 14, 2025",
    readTime: "6 min",
    image: HOME_ASSETS.blog1,
    excerpt:
      "A strong planning rhythm keeps teams aligned, focused, and moving with intent. Here's how to build a simple, repeatable cadence that reduces chaos and boosts execution.",
  },
  {
    slug: "the-real-impact-of-slow-decision-making-in-growing-teams",
    title: "The real impact of slow decision-making in growing teams",
    category: "Operations",
    date: "Dec 8, 2025",
    readTime: "6 min",
    image: HOME_ASSETS.blog2,
    excerpt:
      "Slow decisions quietly compound into missed deadlines, stalled momentum, and frustrated teams. Here's what the delay really costs growing teams — and how to decide faster without cutting corners.",
  },
  {
    slug: "the-hidden-cost-of-misalignment-(and-how-to-measure-it)",
    title: "The hidden cost of misalignment (and how to measure it)",
    category: "Planning Systems",
    date: "Nov 24, 2025",
    readTime: "5 min",
    image: HOME_ASSETS.blog3,
    excerpt:
      "Misalignment rarely announces itself — it shows up as duplicated work, missed handoffs, and slow decisions. Here's how to surface it early and keep teams pointed the same way.",
  },
  {
    slug: HOME_BLOG.featured.slug,
    title: HOME_BLOG.featured.title,
    excerpt: HOME_BLOG.featured.excerpt,
    category: HOME_BLOG.featured.category,
    date: HOME_BLOG.featured.date,
    readTime: HOME_BLOG.featured.readTime,
    image: HOME_ASSETS[HOME_BLOG.featured.imageKey as keyof typeof HOME_ASSETS],
  },
];

const BLOG_INDEX = new Map(BLOG_FEED.map((post) => [post.slug, post]));

export function getBlogFeedPost(slug: string): BlogFeedPost | undefined {
  return BLOG_INDEX.get(slug);
}

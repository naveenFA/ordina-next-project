import siteContent from "@/data/site-content.json";

export type PageRecord = (typeof siteContent.pages)[number];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  readTime?: string;
};

const ORIGIN = "https://ordina.framer.website";

export const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const FOOTER_LINKS = [
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/terms-of-service", label: "Terms of Service" },
] as const;

const pagesByPath = new Map<string, PageRecord>(
  siteContent.pages.map((page) => {
    const path = page.url.replace(ORIGIN, "") || "/";
    return [path, page];
  }),
);

export function getPage(path: string): PageRecord | undefined {
  return pagesByPath.get(path);
}

export function getPrimaryHeading(page: PageRecord): string {
  const candidates = page.headings.h1.filter(
    (h) =>
      h.length > 12 &&
      !/^[\d$%.xhrs]+$/i.test(h.replace(/\s/g, "")) &&
      !h.includes("%"),
  );
  return candidates[0] ?? page.title;
}

export function textToParagraphs(text: string): string[] {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const paragraphs: string[] = [];
  let current = "";

  for (const line of lines) {
    if (line.length <= 2 && !/^\d+$/.test(line)) continue;
    if (
      [
        "Features",
        "Pricing",
        "Blog",
        "Contact",
        "Login",
        "Book a demo",
        "Start building",
        "Explore features",
        "Read more",
        "Contact us",
        "Send an inquiry",
        "Choose Starter",
        "Choose Pro",
        "Choose Business",
      ].includes(line)
    ) {
      continue;
    }

    if (current.length + line.length > 280) {
      if (current) paragraphs.push(current.trim());
      current = line;
    } else {
      current = current ? `${current} ${line}` : line;
    }
  }

  if (current) paragraphs.push(current.trim());

  return [...new Set(paragraphs)].filter((p) => p.length > 40);
}

function extractBlogMeta(page: PageRecord): Omit<BlogPost, "slug" | "title"> {
  const text = page.cleaned_text;
  const title = getPrimaryHeading(page);
  const afterTitle = text.split(title).slice(1).join(title);
  const excerpt =
    textToParagraphs(afterTitle || text).find((p) => !p.startsWith(title)) ??
    textToParagraphs(text)[1] ??
    "";

  const categoryMatch = text.match(
    /(Strategy & Leadership|Operations|Cross-team Collaboration|Planning Systems)/,
  );
  const dateMatch = text.match(
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/,
  );
  const readMatch = text.match(/\d+\s*(min(?:ute)?s?|min read)/i);

  return {
    excerpt: excerpt.slice(0, 220),
    category: categoryMatch?.[1],
    date: dateMatch?.[0],
    readTime: readMatch?.[0],
  };
}

export function getBlogPosts(): BlogPost[] {
  return siteContent.pages
    .filter((page) => page.url.includes("/blog/"))
    .map((page) => {
      const slug = page.url.replace(`${ORIGIN}/blog/`, "");
      return {
        slug,
        title: getPrimaryHeading(page),
        ...extractBlogMeta(page),
      };
    });
}

export function getBlogPost(slug: string): (BlogPost & { page: PageRecord }) | undefined {
  const path = `/blog/${slug}`;
  const page = getPage(path);
  if (!page) return undefined;

  return {
    slug,
    title: getPrimaryHeading(page),
    page,
    ...extractBlogMeta(page),
  };
}

export function getAllBlogSlugs(): string[] {
  return getBlogPosts().map((post) => post.slug);
}

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: 29,
    yearlyPrice: 23,
    description: "For small teams getting organised",
    features: [
      "5 Team members",
      "3 Workspaces",
      "5 Active workflows",
      "5GB Storage",
      "Task & project management",
      "Workflow automations",
      "Custom views & dashboards",
      "Guest access",
      "Advanced permissions",
      "Admin & audit logs",
    ],
  },
  {
    name: "Pro",
    price: 59,
    yearlyPrice: 47,
    description: "For teams managing multiple projects",
    featured: true,
    features: [
      "20 Team members",
      "10 Workspaces",
      "25 Active workflows",
      "25GB Storage",
      "Task & project management",
      "Workflow automations",
      "Custom views & dashboards",
      "Guest access",
      "Advanced permissions",
      "Admin & audit logs",
    ],
  },
  {
    name: "Business",
    price: 99,
    yearlyPrice: 79,
    description: "For organisations that need full control",
    features: [
      "Unlimited team members",
      "Unlimited workspaces",
      "Unlimited active workflows",
      "100GB Storage",
      "Task & project management",
      "Workflow automations",
      "Custom views & dashboards",
      "Guest access",
      "Advanced permissions",
      "Admin & audit logs",
    ],
  },
] as const;

export const HOME_STATS = [
  { value: "61%", label: "Manual Effort Reduction" },
  { value: "3.6x", label: "ROI for 1st year" },
  { value: "47%", label: "Lower Operational Overhead" },
  { value: "$1.8M", label: "Annual Cost Savings" },
] as const;

export const HOME_FAQ = [
  {
    q: "What type of teams is Ordina built for?",
    a: "Ordina is built for B2B teams that need more than a task list — operations, product, strategy, and cross-functional teams who work across multiple projects and people.",
  },
  {
    q: "Can I use Ordina alongside my existing tools?",
    a: "Yes — Ordina integrates with tools your team already uses, including Slack, Google Drive, and more. Most teams start by running one workflow inside Ordina and expand from there once they see how it fits.",
  },
  {
    q: "Do I need technical skills to set up Ordina?",
    a: "Not at all. Setting up workspaces, automations, and views requires no code — just an understanding of how your team works. If you can map out a process on a whiteboard, you can build it in Ordina.",
  },
  {
    q: "How customizable are workspaces and views?",
    a: "Highly. Every workspace can be structured around your team's specific processes — you choose how tasks are grouped, what's visible, and how progress is tracked.",
  },
  {
    q: "Is our team's data secure?",
    a: "Yes. Ordina uses enterprise-grade encryption with role-based access controls so you decide who can see and edit what. We're SOC 2 compliant and built with the security requirements of B2B scale-ups in mind.",
  },
] as const;

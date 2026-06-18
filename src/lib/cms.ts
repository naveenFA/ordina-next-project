import type { BlogCardPost } from "@/components/blog/blog-cards";

const CMS_URL = "https://cms.flowautomate.io";
const BLOGS_ENDPOINT =
  `${CMS_URL}/api/blogs?pagination[page]=1&pagination[pageSize]=12&populate=Images.Featured_image,Categories`;

type StrapiImageFormat = { url?: string };
type StrapiImage = {
  data?: {
    attributes?: {
      url?: string;
      formats?: Record<string, StrapiImageFormat | undefined>;
    } | null;
  } | null;
};

type StrapiBlog = {
  id: number;
  attributes: {
    Title: string;
    slug: string;
    Short_Description?: string | null;
    publishedAt?: string;
    createdAt?: string;
    Images?: { Featured_image?: StrapiImage } | null;
    Categories?: { data?: { attributes: { Title: string } }[] } | null;
  };
};

function imageUrl(img?: StrapiImage): string {
  const attrs = img?.data?.attributes;
  const path =
    attrs?.formats?.medium?.url ?? attrs?.formats?.small?.url ?? attrs?.url;
  if (!path) return "";
  return path.startsWith("http") ? path : `${CMS_URL}${path}`;
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapBlog(blog: StrapiBlog): BlogCardPost {
  const a = blog.attributes;
  return {
    slug: a.slug,
    title: a.Title,
    excerpt: a.Short_Description ?? "",
    category: a.Categories?.data?.[0]?.attributes?.Title,
    date: formatDate(a.publishedAt ?? a.createdAt),
    image: imageUrl(a.Images?.Featured_image),
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function bannerUrl(images?: { Banner_image?: StrapiImage } | null): string {
  const attrs = images?.Banner_image?.data?.attributes;
  const path = attrs?.url ?? attrs?.formats?.medium?.url;
  if (!path) return "";
  return path.startsWith("http") ? path : `${CMS_URL}${path}`;
}

export type BlogArticleSection = { id: string; heading: string; html: string };

export type BlogDetail = {
  slug: string;
  title: string;
  category?: string;
  date?: string;
  lede: string;
  cover: string;
  introHtml: string;
  sections: BlogArticleSection[];
};

/** Splits the CMS HTML (Blog_sections) into intro + heading-delimited sections. */
function splitSections(blogSections: { Content?: string | null }[]): {
  introHtml: string;
  sections: BlogArticleSection[];
} {
  const html = blogSections.map((s) => s?.Content ?? "").join("\n");
  const parts = html.split(/(?=<h[1-4][^>]*>)/i).filter((p) => p.trim());
  let introHtml = "";
  const sections: BlogArticleSection[] = [];
  const seen = new Map<string, number>();

  for (const part of parts) {
    const match = part.match(/^<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/i);
    const heading = match
      ? match[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim()
      : "";
    if (!match || !heading) {
      // Drop an empty leading heading tag (e.g. <h3>&nbsp;</h3>) but keep its body.
      introHtml += match ? part.slice(match[0].length) : part;
      continue;
    }
    const base = slugify(heading) || "section";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    sections.push({
      id: n === 0 ? base : `${base}-${n + 1}`,
      heading,
      html: part.slice(match[0].length),
    });
  }
  return { introHtml, sections };
}

export type BlogData = {
  featured: BlogCardPost | null;
  feed: BlogCardPost[];
  categories: string[];
};

/** Fetches blog posts from the Strapi CMS and maps them to the card shape. */
export async function getBlogs(): Promise<BlogData> {
  try {
    const res = await fetch(BLOGS_ENDPOINT, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);

    const json: { data?: StrapiBlog[] } = await res.json();
    const posts = (json.data ?? [])
      .map(mapBlog)
      .filter((post) => post.slug && post.image);

    const [featured, ...feed] = posts;
    const categories = [
      ...new Set(posts.map((post) => post.category).filter(Boolean)),
    ] as string[];

    return { featured: featured ?? null, feed, categories };
  } catch {
    return { featured: null, feed: [], categories: [] };
  }
}

/** All blog slugs (for static generation). */
export async function getBlogSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/blogs?fields[0]=slug&pagination[pageSize]=100`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);
    const json: { data?: { attributes: { slug: string } }[] } = await res.json();
    return (json.data ?? []).map((b) => b.attributes.slug).filter(Boolean);
  } catch {
    return [];
  }
}

/** Single blog post by slug, with the article body parsed into sections. */
export async function getBlogDetail(slug: string): Promise<BlogDetail | null> {
  try {
    const res = await fetch(
      `${CMS_URL}/api/blogs?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=Images.Banner_image,Images.Featured_image,Categories,Blog_sections,Table_of_content`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`CMS responded ${res.status}`);
    const json: { data?: (StrapiBlog & { attributes: { Blog_sections?: { Content?: string | null }[]; Images?: { Banner_image?: StrapiImage; Featured_image?: StrapiImage } | null } })[] } =
      await res.json();
    const blog = json.data?.[0];
    if (!blog) return null;

    const a = blog.attributes;
    const { introHtml, sections } = splitSections(a.Blog_sections ?? []);
    return {
      slug: a.slug,
      title: a.Title,
      category: a.Categories?.data?.[0]?.attributes?.Title,
      date: formatDate(a.publishedAt ?? a.createdAt),
      lede: a.Short_Description ?? "",
      cover: bannerUrl(a.Images) || imageUrl(a.Images?.Featured_image),
      introHtml,
      sections,
    };
  } catch {
    return null;
  }
}

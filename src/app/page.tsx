import { HomePageContent } from "@/components/home/home-page";
import { getBlogs } from "@/lib/cms";

export default async function HomePage() {
  const { featured, feed } = await getBlogs();
  return <HomePageContent blogFeatured={featured} blogPosts={feed.slice(0, 3)} />;
}

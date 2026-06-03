// SIN "use client"
import FeedFilters from "./components/FeedFilters";
import FeedContent from "./components/FeedContent";
import { postsService, PostResponse, PostCategoryResponse } from "./services/post.service";

export default async function FeedPage() {
  const [postsResult, categoriesResult] = await Promise.all([
    postsService.getPosts(),
    postsService.getCategories(),
  ]);

  const posts: PostResponse[] = postsResult.error ? [] : postsResult.data;
  const categories: PostCategoryResponse[] = categoriesResult.error ? [] : categoriesResult.data;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="flex gap-8 p-8 max-w-[1400px] mx-auto">
        <FeedContent posts={posts} categories={categories} />
      </div>
    </div>
  );
}
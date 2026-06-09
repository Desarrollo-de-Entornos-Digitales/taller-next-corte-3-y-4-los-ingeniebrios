// Feed Page - displays questions feed from backend
// Server component that fetches posts and categories
import FeedContent from "./components/FeedContent";
import { postsService, PostResponse, PostCategoryResponse } from "../../../common/services/post.service";

export default async function FeedPage() {
  // Fetch posts and categories asynchronously from API
  const [postsResult, categoriesResult] = await Promise.all([
    postsService.getPosts(),
    postsService.getCategories(),
  ]);

  // Extract data or use empty arrays if error
  const posts: PostResponse[] = postsResult.error ? [] : postsResult.data;
  const categories: PostCategoryResponse[] = categoriesResult.error ? [] : categoriesResult.data;

  return (
    <div className="min-h-screen bg-[#F5F5F7] w-full">
      <div className="flex gap-8 p-8 max-w-[1400px] mx-auto w-full">
        {/* Inyectamos limpiamente las variables obtenidas del Backend */}
        <FeedContent posts={posts} categories={categories} />
      </div>
    </div>
  );
}
import FeedContent from "./components/FeedContent";
import { postsService, PostResponse, PostCategoryResponse } from "../../../common/services/post.service";

export default async function FeedPage() {
  // Consumimos de manera asíncrona los posts y categorías inyectados por el SQL
  const [postsResult, categoriesResult] = await Promise.all([
    postsService.getPosts(),
    postsService.getCategories(),
  ]);

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

import { postsService } from "../../../../common/services/post.service";
import CommentsClient from "../components/CommentsClient";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

// Comments Page - displays a specific question and its answers
// Server component that fetches the question data
export default async function CommentsPage({ params }: Props) {
  const { id } = await params;
  const postId = Number(id);

  // Fetch the specific post by ID
  const result = await postsService.getPostById(postId);

  if (result.error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-500 rounded-2xl p-4 text-sm">
          No se pudo cargar la pregunta: {result.message}
        </div>
      </div>
    );
  }

  // Pass post as prop to client component
  return <CommentsClient post={result.data} />;
}

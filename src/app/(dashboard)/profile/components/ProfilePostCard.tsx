"use client";

interface ProfilePostCardProps {
  post: {
    id: number;
    title: string;
    description: string;
    image?: string;
    answers?: any[];
    createdAt: string;
    solved?: boolean;
  };
}

export default function ProfilePostCard({ post }: ProfilePostCardProps) {
  const date = new Date(post.createdAt).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-3">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800 text-sm flex-1 pr-4 leading-snug">
          {post.title}
        </h3>
        <span className="text-xs text-gray-400 flex-shrink-0">{date}</span>
      </div>

      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.description}</p>

      {post.image && (
        <img src={post.image} alt="post" className="w-full rounded-xl mb-4 max-h-40 object-cover" />
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-[#5856D6] font-medium">
          {post.answers?.length ?? 0} respuestas
        </span>
        {post.solved && (
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            ✓ Resuelto
          </span>
        )}
      </div>
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";

type Post = {
  id: string;

  author: {
    name: string;
    avatar: string;
    level: string;
  };

  content: string;

  category: string;

  image?: string | null;

  commentsCount: number;
};

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 transition hover:shadow-lg">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">

        <img
          src={post.author.avatar}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />

        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {post.author.name}
          </span>

          <span className="text-xs text-gray-500">
            Nivel {post.author.level}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <p className="text-gray-700 whitespace-pre-line mb-4">
        {post.content}
      </p>

      {/* IMAGE */}
      {post.image && (
        <div className="w-full mb-4">
          <img
            src={post.image}
            alt="post"
            className="w-full max-h-96 object-cover rounded-xl"
          />
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between">

        <span className="bg-indigo-100 text-indigo-600 text-xs px-3 py-1 rounded-full">
          {post.category}
        </span>

        <button
          onClick={() => router.push(`/posts/${post.id}`)}
          className="bg-gray-100 hover:bg-gray-200 transition px-4 py-2 rounded-lg text-sm"
        >
          💬 {post.commentsCount}
        </button>
      </div>
    </div>
  );
}
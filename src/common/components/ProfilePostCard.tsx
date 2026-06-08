"use client";

import { useState } from "react";

interface Answer {
  id: number;
  content: string;
  user: {
    name: string;
    avatar: string | null;
  };
  createdAt: string;
}

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

const getToken = () =>
  document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
  ?? localStorage.getItem("token");

export default function ProfilePostCard({ post }: ProfilePostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);

  const date = new Date(post.createdAt).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
  });

  const handleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }

    setExpanded(true);
    if (answers.length > 0) return;

    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const filtered = data.filter((a: any) => a.post?.id === post.id);
      setAnswers(filtered);
    } catch (error) {
      console.error("Error cargando respuestas:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <button
          onClick={handleExpand}
          className="text-xs text-[#5856D6] font-medium hover:opacity-70 transition-opacity"
        >
          {post.answers?.length ?? 0} respuestas {expanded ? "▲" : "▼"}
        </button>
        {post.solved && (
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            ✓ Resuelto
          </span>
        )}
      </div>

      {/* Respuestas expandidas */}
      {expanded && (
        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">
          {loading ? (
            <p className="text-xs text-gray-400 text-center">Cargando respuestas...</p>
          ) : answers.length === 0 ? (
            <p className="text-xs text-gray-400 text-center">No hay respuestas aún.</p>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} className="flex gap-3 items-start">
                <img
                  src={
                    answer.user.avatar && answer.user.avatar.startsWith("data:")
                      ? answer.user.avatar
                      : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(answer.user.name)}`
                  }
                  alt={answer.user.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                />
                <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                  <p className="text-xs font-bold text-gray-700 mb-1">{answer.user.name}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{answer.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
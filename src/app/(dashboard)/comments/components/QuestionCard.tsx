"use client";

import { PostResponse } from "../../../../common/services/post.service";

type Props = {
  post: PostResponse;
  onReply: () => void;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs} hora${hrs > 1 ? "s" : ""}`;
  return `Hace ${Math.floor(hrs / 24)} día(s)`;
}

export default function QuestionCard({ post, onReply }: Props) {
  const level = post.user.student?.level ?? 1;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <h2 className="font-bold text-[#5856D6] text-base">Pregunta ¿?</h2>

      {/* Tarjeta azul */}
      <div className="rounded-2xl bg-[#5856D6] text-white p-5 flex flex-col gap-4">

        {/* Autor */}
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatar || "/default-avatar.png"}
            alt={post.user.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/40"
          />
          <div>
            <p className="font-semibold text-sm">
              {post.user.name} – {post.category.name} – Nivel {level}
            </p>
            <p className="text-xs text-white/60">{timeAgo(post.created_at)}</p>
          </div>
        </div>

        {/* Texto */}
        <p className="text-sm leading-relaxed">{post.description}</p>

        {/* Imagen opcional */}
        {post.image && (
          <img
            src={post.image}
            alt="Imagen de la pregunta"
            className="rounded-xl max-h-48 object-contain bg-white/10"
          />
        )}

        {/* Botón responder */}
        <div className="flex justify-end">
          <button
            onClick={onReply}
            className="bg-white text-[#5856D6] font-semibold text-sm px-4 py-1.5 rounded-full hover:bg-white/90 transition-colors"
          >
            Responder
          </button>
        </div>
      </div>
    </div>
  );
}

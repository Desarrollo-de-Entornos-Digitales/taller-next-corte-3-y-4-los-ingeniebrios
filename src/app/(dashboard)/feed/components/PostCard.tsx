"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostResponse } from '../../../../common/services/post.service';

interface PostCardProps {
  post: PostResponse;
  onDeleted?: (id: number) => void;
}

const getAvatar = (avatar: string | null, name: string) => {
  if (avatar && avatar.startsWith("data:")) return avatar;
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;
};

const checkIsAdmin = (): boolean => {
  try {
    const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
      ?? localStorage.getItem("token");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Array.isArray(payload.permissions) && payload.permissions.includes("delete_post");
  } catch {
    return false;
  }
};

const PostCard: React.FC<PostCardProps> = ({ post, onDeleted }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setIsAdmin(checkIsAdmin());
  }, []);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este post?")) return;
    setDeleting(true);
    try {
      const token = document.cookie.split("; ").find(r => r.startsWith("token="))?.split("=")[1]
        ?? localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onDeleted?.(post.id);
      } else {
        alert("No se pudo eliminar el post.");
      }
    } catch {
      alert("Error al eliminar el post.");
    } finally {
      setDeleting(false);
    }
  };

  const timeAgo = new Date(post.createdAt).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 flex flex-col gap-3 relative">

      <div className="flex items-center gap-3">
        <img
          src={getAvatar(post.user.avatar, post.user.name)}
          alt={post.user.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />
        <div className="flex flex-col flex-1">
          <span className="font-bold text-gray-800 text-sm leading-tight">
            {post.user.name} - Nivel: {post.user.student?.level ?? 1}
          </span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>

        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto flex items-center gap-1 bg-red-50 text-red-500 text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "🗑 Eliminar"}
          </button>
        )}
      </div>

      <div className="mt-1">
        <h3 className="font-semibold text-gray-800 text-sm mb-1">{post.title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>

      {post.image && (
        <div className="w-full overflow-hidden rounded-xl border border-gray-100 flex justify-center">
          <img
            src={post.image}
            alt="Imagen de la publicación"
            className="max-w-full max-h-[300px] h-auto w-auto"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-2">
        <span className="px-3 py-1 bg-[#EBEBFF] text-[#5856D6] rounded-full text-[10px] font-bold">
          {post.category.name}
        </span>

        <Link
          href={`/comments/${post.id}`}
          className="flex items-center gap-1.5 bg-[#F2F2F7] px-3 py-1.5 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <span className="text-xs font-bold text-gray-600">
            {post.answers?.length ?? 0}
          </span>
          <img src="/comment.svg" alt="comments" className="w-4 h-4 opacity-50" />
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
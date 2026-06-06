"use client";

import React from 'react';
import Link from 'next/link';
import { PostResponse } from '../../../../common/services/post.service';

interface PostCardProps {
  post: PostResponse;
}

const getAvatar = (avatar: string | null, name: string) => {
  if (avatar && avatar.startsWith("data:")) return avatar;
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name)}`;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
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
        <div className="flex flex-col">
          <span className="font-bold text-gray-800 text-sm leading-tight">
            {post.user.name} - Nivel: {post.user.student?.level ?? 1}
          </span>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
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
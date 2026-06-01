import React from 'react';
import { postsService, PostResponse } from "../services/post.service";

interface PostCardProps {
  post: PostResponse;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const timeAgo = new Date(post.created_at).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 flex flex-col gap-3 relative">

      <div className="flex items-center gap-3">
        <img 
          src={post.user.avatar || "/default-avatar.png"} 
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

      <div className="flex justify-between items-center mt-2">
        <span className="px-3 py-1 bg-[#EBEBFF] text-[#5856D6] rounded-full text-[10px] font-bold">
          {post.category.name}
        </span>

        <div className="flex items-center gap-1.5 bg-[#F2F2F7] px-3 py-1.5 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
          <span className="text-xs font-bold text-gray-600">3</span>
          <img src="/comment.svg" alt="comments" className="w-4 h-4 opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
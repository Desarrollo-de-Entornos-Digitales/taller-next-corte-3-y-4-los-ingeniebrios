"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { postsService, PostResponse } from "../services/post.service";

interface PostListProps {
  selectedCategory: string;
}

export default function PostList({ selectedCategory }: PostListProps) {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const result = await postsService.getPosts();
      if (result.error) {
        setError("No se pudieron cargar los posts.");
      } else {
        setPosts(result.data ?? []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory === "All categories"
    ? posts
    : posts.filter((post) => post.category.name === selectedCategory);

  if (loading) return (
    <div className="w-full max-w-[850px] flex justify-center py-20">
      <span className="text-gray-400 text-sm animate-pulse">Cargando posts...</span>
    </div>
  );

  if (error) return (
    <div className="w-full max-w-[850px] flex justify-center py-20">
      <span className="text-red-400 text-sm">{error}</span>
    </div>
  );

  if (filteredPosts.length === 0) return (
    <div className="w-full max-w-[850px] flex justify-center py-20">
      <span className="text-gray-400 text-sm">No hay posts en esta categoría.</span>
    </div>
  );

  return (
    <div className="w-full max-w-[850px] flex flex-col gap-4">
      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
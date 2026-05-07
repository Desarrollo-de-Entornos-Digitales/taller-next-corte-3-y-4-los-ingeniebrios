"use client";

import { useEffect, useState } from "react";
import { getPosts } from "../services/post.service"; 
import PostCard from "./PostCard";

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

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setError(null);
        const data = await getPosts();
        
        if (!Array.isArray(data)) {
          throw new Error("Los datos recibidos no son válidos");
        }
        
        setPosts(data);
      } catch (error) {
        console.error(error);
        setError("Error al cargar las publicaciones");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-500">Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-indigo-600 underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No hay publicaciones aún
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
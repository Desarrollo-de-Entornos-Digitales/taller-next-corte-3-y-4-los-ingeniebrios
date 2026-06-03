"use client";

import { useState } from "react";
import FeedFilters from "./FeedFilters";
import PostCard from "./PostCard";
import { PostResponse, PostCategoryResponse } from "../../../../common/services/post.service";

interface FeedContentProps {
  posts: PostResponse[];
  categories: PostCategoryResponse[];
}

export default function FeedContent({ posts, categories }: FeedContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  const filteredPosts = selectedCategory === "All categories"
    ? posts
    : posts.filter((post) => post.category.name === selectedCategory);

  return (
    <>
      <FeedFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="flex-1 flex flex-col gap-6 items-center">
        <section className="bg-[#5454E9] rounded-2xl p-8 relative overflow-hidden text-white shadow-md w-full max-w-[850px]">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-2">Responde las preguntas de otros</h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              ¡Ayuda a otros usuarios y gana recompensas por tu colaboración!
            </p>
          </div>
          <div className="absolute right-4 bottom-0 hidden lg:block">
            <img src="/iguana.png" alt="Mascota" className="h-32 object-contain translate-y-2" />
          </div>
        </section>

        <div className="w-full max-w-[850px] flex flex-col gap-4">
          {filteredPosts.length === 0 ? (
            <div className="flex justify-center py-20">
              <span className="text-gray-400 text-sm">No hay posts en esta categoría.</span>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
"use client";

import { useState } from "react";
import FeedFilters from "./FeedFilters";
import PostCard from "./PostCard";
import { PostResponse, PostCategoryResponse } from "../../../../common/services/post.service";

const iconMapping: Record<string, string> = {
  matematicas: "/icons/mathicon.svg",
  mathematics: "/icons/mathicon.svg",
  diseno: "/icons/desingicon.svg",
  design: "/icons/desingicon.svg",
  fisica: "/icons/physicsicon.svg",
  physics: "/icons/physicsicon.svg",
  quimica: "/icons/chemistryicon.svg",
  chemistry: "/icons/chemistryicon.svg",
  economia: "/icons/economicsicon.svg",
  economics: "/icons/economicsicon.svg",
  programacion: "/icons/programmingicons.svg",
  programming: "/icons/programmingicons.svg",
};

interface FeedContentProps {
  posts: PostResponse[];
  categories: PostCategoryResponse[];
}

export default function FeedContent({ posts: initialPosts, categories }: FeedContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [posts, setPosts] = useState<PostResponse[]>(initialPosts);

  const sanitizedCategories = categories.map((cat) => {
    const normalizedName = cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return {
      ...cat,
      icon: iconMapping[normalizedName] || "/icons/default-category.svg"
    };
  });

  const filteredPosts = selectedCategory === "All categories"
    ? posts
    : posts.filter((post) => post.category?.name === selectedCategory);

  const handleDeleted = (id: number) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      <FeedFilters
        categories={sanitizedCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="flex-1 flex flex-col gap-6 items-center">
        <section className="bg-[#3B3BF6] rounded-3xl p-6 px-8 relative overflow-hidden text-white shadow-sm w-full max-w-[850px] min-h-[115px] flex items-center justify-between">
          <div className="max-w-md flex flex-col gap-1 z-10">
            <h1 className="text-xl font-bold tracking-tight">Responde las preguntas de otros</h1>
            <p className="text-white/80 text-xs font-medium">
              ¡Ayuda a otros usuarios y gana recompensas por tu colaboración!
            </p>
          </div>
          <div className="absolute right-4 bottom-0 w-24 h-24 flex items-end justify-center">
            <img
              src="/iguana.png"
              alt="iguana mascot"
              className="h-full w-full object-contain transform scale-110 origin-bottom"
            />
          </div>
        </section>

        <div className="w-full max-w-[850px] flex flex-col gap-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center gap-2">
              <span className="text-2xl">📝</span>
              <p className="text-gray-500 font-medium text-sm">
                No hay posts en esta categoría todavía.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} onDeleted={handleDeleted} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
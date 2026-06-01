"use client";

import { useEffect, useState } from "react";
import { postsService, PostResponse } from "../services/post.service";

const icons: Record<string, string> = {
  Matemáticas: "/icons/mathicon.svg",
  Diseño: "/icons/desingicon.svg",
  Física: "/icons/physicsicon.svg",
  Química: "/icons/chemistryicon.svg",
  Economía: "/icons/economicsicon.svg",
  Programación: "/icons/programmingicons.svg",
};

interface FeedFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function FeedFilters({ selectedCategory, setSelectedCategory }: FeedFiltersProps) {
  const [categories, setCategories] = useState<PostCategoryResponse[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await postsService.getCategories();
      if (!result.error && result.data) {
        setCategories(result.data);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg text-[#5856D6]">Filtros</h2>
      </div>

      <div className="flex flex-col gap-2">

        {/* All categories */}
        <button
          onClick={() => setSelectedCategory("All categories")}
          className={`flex items-center gap-3 text-left px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium
            ${selectedCategory === "All categories"
              ? "bg-[#EBEBFF] text-[#5856D6]"
              : "text-gray-600 hover:bg-[#F5F5FF] hover:text-[#5856D6]"
            }`}
        >
          <span>All categories</span>
        </button>

        {/* Categorías de la BD */}
        {categories.map((category) => {
          const isActive = selectedCategory === category.name;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`group flex items-center gap-3 text-left px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium
                ${isActive
                  ? "bg-[#EBEBFF] text-[#5856D6]"
                  : "text-gray-600 hover:bg-[#F5F5FF] hover:text-[#5856D6]"
                }`}
            >
              {icons[category.name] && (
                <img
                  src={icons[category.name]}
                  alt={category.name}
                  className={`w-5 h-5 object-contain transition duration-200 ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}
                />
              )}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-center">
        <img src="/zarigueya.png" alt="mascot" className="w-100 object-contain" />
      </div>
    </div>
  );
}
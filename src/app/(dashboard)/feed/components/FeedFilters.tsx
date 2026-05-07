"use client";

import { mockPosts } from "../../../../util/post.util";

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

export default function FeedFilters({
  selectedCategory,
  setSelectedCategory,
}: FeedFiltersProps) {

  const categories = [
    "All categories",
    ...new Set(mockPosts.map((post) => post.category)),
  ];

  return (
    <div className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg text-[#5856D6]">
          Filtros
        </h2>

        <button className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      {/* TITLE */}
      <p className="text-sm text-gray-500 mb-4">
        Seleccionar categoría
      </p>

      {/* CATEGORIES */}
      <div className="flex flex-col gap-2">

        {categories.map((category) => {

          const isActive = selectedCategory === category;

          return (
           <button
  key={category}
  onClick={() => setSelectedCategory(category)}
  className={`
    group
    flex
    items-center
    gap-3
    text-left
    px-3
    py-2
    rounded-xl
    transition-all
    duration-200
    text-sm
    font-medium

    ${
      isActive
        ? "bg-[#EBEBFF] text-[#5856D6]"
        : "text-gray-600 hover:bg-[#F5F5FF] hover:text-[#5856D6]"
    }
  `}
>

  {category !== "All categories" && (
    <img
      src={icons[category]}
      alt={category}
      className={`
        w-5
        h-5
        object-contain
        transition
        duration-200

        ${
          isActive
            ? "opacity-100"
            : "opacity-60 group-hover:opacity-100"
        }
      `}
    />
  )}

  <span>{category}</span>

</button>
          );
        })}
      </div>

      {/* IMAGE */}
      <div className="mt-8 flex justify-center">
        <img
          src="/zarigueya.png"
          alt="mascot"
          className="w-100 object-contain"
        />
      </div>
    </div>
  );
}
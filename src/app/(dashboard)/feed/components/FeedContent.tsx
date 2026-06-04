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

export default function FeedContent({ posts, categories }: FeedContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  // 1. Normalizamos las categorías para resolver el problema de que no se listan/filtran por problemas de texto o iconos vacíos
  const sanitizedCategories = categories.map((cat) => {
    const normalizedName = cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return {
      ...cat,
      // Si tu backend manda el nombre con tildes o en inglés, aquí aseguramos su icono
      icon: iconMapping[normalizedName] || "/icons/default-category.svg"
    };
  });

  const filteredPosts = selectedCategory === "All categories"
    ? posts
    : posts.filter((post) => post.category?.name === selectedCategory);

  return (
    <>
      {/* Pasamos las categorías sanitizadas con sus paths de iconos correctos */}
      <FeedFilters
        categories={sanitizedCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="flex-1 flex flex-col gap-6 items-center">
        {/* 🚀 BANNER MODIFICADO PARA QUEDAR IDÉNTICO A image_ed8d04.png */}
        <section className="bg-[#3B3BF6] rounded-3xl p-6 px-8 relative overflow-hidden text-white shadow-sm w-full max-w-[850px] min-h-[115px] flex items-center justify-between">
          <div className="max-w-md flex flex-col gap-1 z-10">
            <h1 className="text-xl font-bold tracking-tight">Responde las preguntas de otros</h1>
            <p className="text-white/80 text-xs font-medium">
              ¡Ayuda a otros usuarios y gana recompensas por tu colaboración!
            </p>
          </div>
          
          {/* Contenedor de la mascota alineado a la derecha como en la imagen */}
          <div className="absolute right-4 bottom-0 w-24 h-24 flex items-end justify-center">
            <img 
              src="/iguana.png" // Asegúrate de que el archivo se llame así en tu carpeta public
              alt="iguana mascot" 
              className="h-full w-full object-contain transform scale-110 origin-bottom" 
            />
          </div>
        </section>

        {/* Listado de Posts */}
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
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
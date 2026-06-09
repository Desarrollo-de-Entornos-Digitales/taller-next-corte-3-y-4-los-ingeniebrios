"use client";

import { PostCategoryResponse } from '../../../../common/services/post.service';

// Icon mapping for official 5 academic categories
const categoryIcons: Record<string, string> = {
  "Negocios y Economía": "/icons/economicsicon.svg",
  "Ingeniería, Tecnología y Diseño": "/icons/programmingicons.svg",
  "Ciencias de la Salud y Biológicas": "/icons/chemistryicon.svg",
  "Leyes, Sociedad y Comportamiento": "/icons/physicsicon.svg", // Usa el icono que prefieras para leyes
  "Educación y Núcleo Común": "/icons/mathicon.svg" // Usa el icono que prefieras para educación
};

// Fallback list of official categories to ensure proper rendering
const OFFICIAL_CATEGORIES: PostCategoryResponse[] = [
  { id: 1, name: "Negocios y Economía" },
  { id: 2, name: "Ingeniería, Tecnología y Diseño" },
  { id: 3, name: "Ciencias de la Salud y Biológicas" },
  { id: 4, name: "Leyes, Sociedad y Comportamiento" },
  { id: 5, name: "Educación y Núcleo Común" }
];

// Props interface for FeedFilters component
interface FeedFiltersProps {
  categories: PostCategoryResponse[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

// Feed Filters component - sidebar with category filters
export default function FeedFilters({ categories, selectedCategory, setSelectedCategory }: FeedFiltersProps) {
  // Use backend categories if valid, otherwise use fallback list
  const validCategories = categories && categories.some(c => categoryIcons[c.name])
    ? categories
    : OFFICIAL_CATEGORIES;

  return (
    <div className="w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit flex flex-col gap-5">
      <div>
        <h2 className="font-bold text-lg text-[#5856D6]">Filtros</h2>
      </div>

      <div className="flex flex-col gap-1.5">
        {/* Botón para ver todas las publicaciones */}
        <button
          onClick={() => setSelectedCategory("All categories")}
          className={`flex items-center gap-3 text-left px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold w-full
            ${selectedCategory === "All categories"
              ? "bg-[#EBEBFF] text-[#5856D6]"
              : "text-gray-600 hover:bg-[#F5F5FF] hover:text-[#5856D6]"
            }`}
        >
          <span>All categories</span>
        </button>

        {/* Renderizado de las 5 categorías académicas reales */}
        {validCategories.map((category) => {
          const isActive = selectedCategory === category.name;
          const iconSrc = categoryIcons[category.name] || "/icons/mathicon.svg";

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`group flex items-center gap-3 text-left px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium w-full
                ${isActive
                  ? "bg-[#EBEBFF] text-[#5856D6]"
                  : "text-gray-600 hover:bg-[#F5F5FF] hover:text-[#5856D6]"
                }`}
            >
              <img
                src={iconSrc}
                alt={category.name}
                className={`w-5 h-5 object-contain transition duration-200 ${isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                  }`}
              />
              <span className="leading-tight text-gray-700 group-hover:text-[#5856D6] transition-colors">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ilustración de la mascota con signos de pregunta de tu diseño anterior */}
      <div className="mt-4 flex justify-center w-full pt-2 border-t border-gray-50">
        <img
          src="/zarigueya.png"
          alt="Mascota con dudas"
          className="w-full max-w-[150px] object-contain opacity-95"
        />
      </div>
    </div>
  );
}
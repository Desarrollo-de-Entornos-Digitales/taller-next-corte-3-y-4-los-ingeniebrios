"use client";

import { useState } from "react";
import FeedFilters from "./components/FeedFilters";
import PostList from "./components/PostList";
import Navbar from '../../../common/components/Navbar';

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />

      {/* Botón filtros mobile */}
      <div className="flex md:hidden px-4 pt-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-[#5454E9] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow"
        >
          <span>☰</span> {showFilters ? "Ocultar filtros" : "Filtros"}
        </button>
      </div>

      {/* Filtros mobile desplegables */}
      {showFilters && (
        <div className="md:hidden px-4 pt-2 pb-2">
          <FeedFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={(cat) => {
              setSelectedCategory(cat);
              setShowFilters(false);
            }}
          />
        </div>
      )}

      <div className="flex gap-6 p-4 md:p-8 max-w-[1400px] mx-auto">

        {/* Filtros sidebar — visible solo en desktop */}
        <div className="hidden md:block">
          <FeedFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col gap-6 items-center min-w-0">

          <section className="bg-[#5454E9] rounded-2xl p-6 md:p-8 relative overflow-hidden text-white shadow-md w-full max-w-[850px]">
            <div className="max-w-xs md:max-w-md">
              <h1 className="text-lg md:text-2xl font-bold mb-2">
                Responde las preguntas de otros
              </h1>
              <p className="text-indigo-100 text-xs md:text-sm leading-relaxed">
                ¡Ayuda a otros usuarios y gana recompensas por tu colaboración!
              </p>
            </div>

            <div className="absolute right-4 bottom-0 hidden lg:block">
              <img
                src="/iguana.png"
                alt="Mascota"
                className="h-28 lg:h-32 object-contain translate-y-2"
              />
            </div>
          </section>

          <PostList selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import FeedFilters from "./components/FeedFilters";
import PostList from "./components/PostList";
import Navbar from '../../../common/components/Navbar';

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState("All categories");

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />

      <div className="flex gap-8 p-8 max-w-[1400px] mx-auto">

        <FeedFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="flex-1 flex flex-col gap-6 items-center">

          <section className="bg-[#5454E9] rounded-2xl p-8 relative overflow-hidden text-white shadow-md w-full max-w-[850px]">
            <div className="max-w-md">
              <h1 className="text-2xl font-bold mb-2">
                Responde las preguntas de otros
              </h1>
              <p className="text-indigo-100 text-sm leading-relaxed">
                ¡Ayuda a otros usuarios y gana recompensas por tu colaboración!
              </p>
            </div>
 
            <div className="absolute right-4 bottom-0 hidden lg:block">
              <img 
                src="/iguana.png" 
                alt="Mascota" 
                className="h-32 object-contain translate-y-2"
              />
            </div>
          </section>


          <PostList selectedCategory={selectedCategory} />

        </div>
      </div>
    </div>
  );
}
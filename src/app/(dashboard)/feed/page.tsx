"use client";

import { useState } from "react";

import FeedFilters from "./components/FeedFilters";
import PostList from "./components/PostList";
import Navbar from '../../../common/components/Navbar';


export default function FeedPage() {

  const [selectedCategory, setSelectedCategory] =
    useState("All categories");

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      <Navbar />

      <div className="flex gap-8 p-8">

        {/* SIDEBAR */}
        <FeedFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* MAIN */}
        <div className="flex-1 flex flex-col gap-6">

          {/* BANNER */}
<div className="bg-[#5856D6] rounded-2xl px-6 py-5 flex items-center justify-between overflow-hidden">

  {/* TEXT */}
  <div>
    <h1 className="text-white text-2xl font-bold">
      Responde las preguntas de otros
    </h1>

    <p className="text-[#E5E5FF] text-sm mt-1">
      ¡Ayuda a otros usuarios y gana recompensas por tu colaboración!
    </p>
  </div>

  {/* IMAGE */}
  <div className="self-end">
    <img
      src="/iguana.png"
      alt="banner mascot"
      className="w-32 object-contain -mb-1"
    />
  </div>

</div>

          {/* CATEGORY BAR */}
          <div className="bg-[#5856D6] text-white text-center py-3 rounded-full font-bold">
            {selectedCategory}
          </div>

          {/* POSTS */}
          <PostList selectedCategory={selectedCategory} />

        </div>
      </div>
    </div>
  );
}
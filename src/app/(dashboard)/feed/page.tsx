import Navbar from "../../../components/Navbar";

import FeedFilters from "./components/FeedFilters";
import PostList from "./components/PostList";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      <Navbar />

      <div className="flex gap-8 p-8">

        {/* SIDEBAR */}
        <FeedFilters />

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-6">

          {/* BANNER */}
          <div className="bg-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between">

            <div>
              <h1 className="text-3xl font-bold">
                Responde las preguntas de otros
              </h1>

              <p className="mt-2 text-sm">
                Ayuda a otros estudiantes y gana reputación en la comunidad.
              </p>
            </div>

            <div className="text-6xl">
              🦖
            </div>
          </div>

          {/* CATEGORY TAB */}
          <div className="bg-indigo-600 text-white text-center py-3 rounded-full font-semibold">
            Todas las categorías
          </div>

          {/* POSTS */}
          <PostList />

        </div>
      </div>
    </div>
  );
}
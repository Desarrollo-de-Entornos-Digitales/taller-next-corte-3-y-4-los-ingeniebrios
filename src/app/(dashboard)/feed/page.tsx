"use client"
import React from 'react';
import PostCard from './components/PostCard'; 
import { mockPosts } from '../../../util/post.util';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8">
      {/* Contenedor Principal con Layout de 2 Columnas */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        
        {/* COLUMNA IZQUIERDA (Espacio para el Sidebar) */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl h-[500px] shadow-sm border border-gray-100 p-6">
            {/* Aquí irá el contenido del filtro que trabajaremos después */}
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Categorías</p>
            <div className="mt-4 space-y-4">
               <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
               <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        </aside>

        {/* COLUMNA DERECHA (Banner + Feed) */}
        <main className="flex-1 flex flex-col gap-6">
          
          {/* BANNER AZUL (Info de recompensas) */}
          <section className="bg-[#5454E9] rounded-2xl p-8 relative overflow-hidden text-white shadow-md">
            <div className="max-w-md">
              <h1 className="text-2xl font-bold mb-2">
                Responde las preguntas de otros
              </h1>
              <p className="text-indigo-100 text-sm leading-relaxed">
                ¡Ayuda a otros usuarios y gana recompensas por tu colaboración!
              </p>
            </div>
            
            {/* Ilustración del banner (Ajusta la posición para que "salga" del banner) */}
            <div className="absolute right-4 bottom-0 hidden lg:block">
              <img 
                src="/iguana.png" 
                alt="Mascota" 
                className="h-32 object-contain translate-y-2"
              />
            </div>
          </section>

          {/* LISTADO DE CARDS (Mapeo del mockData) */}
          <div className="flex flex-col gap-4">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
        </main>

      </div>
    </div>
  );
}
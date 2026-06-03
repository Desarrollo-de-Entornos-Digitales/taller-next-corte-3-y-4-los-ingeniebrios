"use client";
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full h-20 bg-white shadow-sm flex items-center justify-between px-10">

      <div className="flex items-center">
        <button className="text-[#5856D6] text-3xl hover:opacity-80 transition">☰</button>
      </div>

      <div className="flex gap-16 font-semibold">
        <button className="text-gray-400 hover:text-[#5856D6] transition">Pregunta</button>
        <button className="text-[#5856D6] border-b-2 border-[#5856D6] pb-1">Comunidad</button>
        <button className="text-gray-400 hover:text-[#5856D6] transition">Monitores</button>
      </div>

      {/* Este link lleva a profile */}
      <Link href="/profile">
        <div className="p-[3px] rounded-full border-[3px] border-[#5856D6] cursor-pointer">
          <img src="/Andy.png" alt="profile" className="w-12 h-12 rounded-full object-cover" />
        </div>
      </Link>

    </nav>
  );
}